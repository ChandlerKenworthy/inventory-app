use crate::state::AppState;
use std::sync::Arc;
use crate::models::order::{CreateOrderPayload, OrderResponse, OrderSummaryResponse, OrderItemResponse};
use axum::{Json, extract::State, http::StatusCode, extract::Path};
use sqlx::{Row};
use uuid::Uuid;
use chrono::Utc;

pub async fn create_order(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateOrderPayload>
) -> Result<Json<String>, (StatusCode, Json<String>)> {
    // Begin the transaction (either everything happens or nothing happens)
    let mut tx = state.db.begin().await.map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(format!("Transaction error: {}", e)))
    })?;

    // Generate a V4 UUID for this order on the backend - expose as little as possible to the frontend
    // for security reasons
    let order_id = Uuid::new_v4().to_string();
    let mut calculated_total_price = 0.0;
    let mut items_to_insert = Vec::new();

    // validate the inventory and get the unit prices (current)
    for item in &payload.items {
        // JOIN products and inventory to verify price and stock in one trip
        let row = sqlx::query(
            r#"
            SELECT p.name, p.price, i.quantity 
            FROM products p
            JOIN inventory i ON p.id = i.product_id
            WHERE p.id = ?
            "#
        )
        .bind(&item.product_id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Database error".into())))?
        .ok_or((StatusCode::NOT_FOUND, Json(format!("Product {} not found", item.product_id))))?;

        let name: String = row.get("name");
        let price: f64 = row.get("price");
        let stock: i64 = row.get("quantity");

        if stock < item.quantity {
            return Err((
                StatusCode::BAD_REQUEST, 
                Json(format!("Insufficient stock for {}. Available: {}", name, stock))
            ));
        }

        calculated_total_price += price * (item.quantity as f64);

        items_to_insert.push((
            Uuid::new_v4().to_string(), // order_items id field
            item.product_id.clone(),
            item.quantity,
            price // record the price at time of sale
        ));

        // Deduct Inventory (inside the transaction, all or nothing approach)
        sqlx::query("UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?")
        .bind(item.quantity)
        .bind(&item.product_id)
        .execute(&mut *tx)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to update stock".into())))?;
    }

    // Insert Order with Timestamps
    // SQLite's CURRENT_TIMESTAMP uses "YYYY-MM-DD HH:MM:SS"
    let now = Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    // TODO: Worked to here and then got this error:
    // Failed to place order: Order insert failed: error returned from database: (code: 20) datatype mismatch

    // Insert into 'orders' table (doesn't include items just the order details)
    sqlx::query(
        r#"
        INSERT INTO orders (id, customer_id, status, total_price, created_at)
        VALUES (?, ?, ?, ?, ?)
        "#
    )
    .bind(order_id.clone() as String)
    .bind(payload.customer_id.clone() as String) 
    .bind(0 as i64) // Status: Pending    // To match INTEGER Sqlite
    .bind(calculated_total_price as f64)  // f64 bind to match REAL
    .bind(now)                            // String (formatted as timestamp)
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(format!("Order insert failed: {}", e))))?;

    // Insert line items
    for (line_id, prod_id, qty, price) in items_to_insert {
        sqlx::query(
            "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(line_id)
        .bind(&order_id)
        .bind(prod_id)
        .bind(qty)
        .bind(price)
        .execute(&mut *tx)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to create line items".into())))?;
    }

    tx.commit().await.map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Final commit failed".into())))?;

    Ok(Json("Order finalized successfully".to_string()))
}

pub async fn get_orders(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<OrderResponse>>, (StatusCode, Json<String>)> {
    // Join orders and order_items to get all details in one query
    let rows = sqlx::query(
        r#"
        SELECT 
            o.id, o.customer_id, o.status, o.created_at, o.total_price,
            oi.product_id, oi.quantity, oi.unit_price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.created_at DESC
        "#
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    // Since one order has multiple rows (one per item), group them
    let mut orders_map: std::collections::BTreeMap<String, OrderResponse> = std::collections::BTreeMap::new();

    for row in rows {
        let order_id: String = row.get("id");

        let entry = orders_map.entry(order_id.clone()).or_insert_with(|| OrderResponse {
            id: order_id,
            customer_id: row.get("customer_id"),
            status: row.get("status"),
            created_at: row.get("created_at"),
            total_price: row.get("total_price"),
            items: Vec::new(),
        });

        // Add the item info if it exists (LEFT JOIN might return nulls for empty orders)
        if let Ok(prod_id) = row.try_get::<String, _>("product_id") {
            entry.items.push(OrderItemResponse {
                product_id: prod_id,
                quantity: row.get("quantity"),
                unit_price: row.get("unit_price"),
            });
        }
    }
    Ok(Json(orders_map.into_values().collect()))
}

pub async fn get_orders_summary(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<OrderSummaryResponse>>, (StatusCode, Json<String>)> {
    let rows = sqlx::query(
        r#"
        SELECT 
            o.id, o.customer_id, o.status, o.created_at, o.total_price, SUM(oi.quantity) as number_of_items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.created_at DESC
        "#
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    let orders_summary: Vec<OrderSummaryResponse> = rows.into_iter().map(|row| {
        OrderSummaryResponse {
            id: row.get("id"),
            customer_id: row.get("customer_id"),
            status: row.get("status"),
            created_at: row.get("created_at"),
            total_price: row.get("total_price"),
            number_of_items: row.get("number_of_items"), // TODO: Calculate actual number of items
        }
    }).collect();

    Ok(Json(orders_summary))
}

pub async fn get_order_details(
    State(state): State<Arc<AppState>>,
    Path(order_id): Path<String>
) -> Result<Json<OrderResponse>, (StatusCode, Json<String>)> {
    // Join orders and order_items to get all details in one query
    let rows = sqlx::query(
        r#"
        SELECT 
            o.id, o.customer_id, o.status, o.created_at, o.total_price,
            oi.product_id, oi.quantity, oi.unit_price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        ORDER BY o.created_at DESC
        "#
    )
    .bind(&order_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    if rows.is_empty() {
        return Err((StatusCode::NOT_FOUND, Json("Order not found".into())));
    }

    // Initialize the order from the first row
    let first = &rows[0];
    let mut order = OrderResponse {
        id: first.get("id"),
        customer_id: first.get("customer_id"),
        status: first.get("status"),
        created_at: first.get("created_at"),
        total_price: first.get("total_price"),
        items: Vec::new(),
    };

    // Collect all items from the result set
    for row in rows {
        // try_get ensures we don't crash if an order exists but has 0 items
        if let Ok(Some(prod_id)) = row.try_get::<Option<String>, _>("product_id") {
            order.items.push(OrderItemResponse {
                product_id: prod_id,
                quantity: row.get("quantity"),
                unit_price: row.get("unit_price"),
            });
        }
    }

    Ok(Json(order))
}
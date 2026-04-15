use crate::state::AppState;
use std::sync::Arc;
use crate::models::order::{CreateOrderPayload, OrderResponse, OrderSummaryResponse, OrderItemResponse, OrderRow};
use axum::{Json, extract::State, http::StatusCode, extract::Path};
use sqlx::{Row};
use uuid::Uuid;
use chrono::Utc;
use crate::extractors::ValidatedJson;

pub async fn create_order(
    State(state): State<Arc<AppState>>,
    ValidatedJson(payload): ValidatedJson<CreateOrderPayload>
) -> Result<Json<String>, (StatusCode, Json<String>)> {
    // Begin the transaction
    let mut tx = state.db.begin().await.map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(format!("Transaction error: {e}")))
    })?;

    // Use native Uuid types
    let order_id = Uuid::new_v4(); 
    let mut calculated_total_price = 0.0;
    let mut items_to_insert = Vec::new();

    // Validate inventory and gather pricing
    for item in &payload.items {
        // We can use a temporary struct or just get the row
        let row = sqlx::query(
            r"
            SELECT p.name, p.price, i.quantity 
            FROM products p
            JOIN inventory i ON p.id = i.product_id
            WHERE p.id = ?
            "
        )
        .bind(item.product_id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?
        .ok_or((StatusCode::NOT_FOUND, Json(format!("Product {} not found", item.product_id))))?;

        let name: String = row.get("name");
        let price: f64 = row.get("price");
        let stock: i64 = row.get("quantity");

        if stock < i64::from(item.quantity) {
            return Err((
                StatusCode::BAD_REQUEST, 
                Json(format!("Insufficient stock for {name}. Available: {stock}"))
            ));
        }

        calculated_total_price += price * (f64::from(item.quantity));

        // Store the data for the bulk insert later
        items_to_insert.push((
            Uuid::new_v4(),
            item.product_id,
            item.quantity,
            price
        ));

        // Deduct Inventory
        sqlx::query("UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?")
            .bind(item.quantity)
            .bind(item.product_id)
            .execute(&mut *tx)
            .await
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to update stock".into())))?;
    }

    // Handle Timestamps as the SQLite expects them
    let now = Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    // Insert Parent Order
    sqlx::query(
        r"
        INSERT INTO orders (id, customer_id, status, total_price, created_at)
        VALUES (?, ?, ?, ?, ?)
        "
    )
    .bind(order_id)          
    .bind(payload.customer_id)
    .bind(0_i64) // order state, for now default to 0 (pending)
    .bind(calculated_total_price)
    .bind(now)
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(format!("Order insert failed: {e}"))))?;

    // Insert Line Items
    for (line_id, prod_id, qty, price) in items_to_insert {
        sqlx::query(
            r"
            INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) 
            VALUES (?, ?, ?, ?, ?)
            "
        )
        .bind(line_id) 
        .bind(order_id)
        .bind(prod_id) 
        .bind(qty)
        .bind(price)
        .execute(&mut *tx)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to create line items".into())))?;
    }

    // Commit it all at once
    tx.commit().await.map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json("Final commit failed".into())))?;

    Ok(Json("Order finalized successfully".to_string()))
}

pub async fn get_orders(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<OrderResponse>>, (StatusCode, Json<String>)> {
    // Fetch flat rows using the FromRow struct we defined earlier
    let rows = sqlx::query_as::<_, OrderRow>(
        r"
        SELECT 
            o.id, o.customer_id, o.status, o.created_at, o.total_price,
            oi.product_id, oi.quantity, oi.unit_price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.created_at DESC
        "
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    // Use a Map to group items by Order ID
    // We use a BTreeMap (or HashMap) to track unique orders
    let mut orders_map: std::collections::BTreeMap<Uuid, OrderResponse> = std::collections::BTreeMap::new();

    for row in rows {
        let entry = orders_map.entry(row.id).or_insert_with(|| OrderResponse {
            id: row.id,
            customer_id: row.customer_id,
            status: row.status,
            created_at: row.created_at,
            total_price: row.total_price,
            items: Vec::new(),
        });

        // Add item if it exists (handling the Option from the LEFT JOIN)
        if let (Some(p_id), Some(qty), Some(price)) = (row.product_id, row.quantity, row.unit_price) {
            entry.items.push(OrderItemResponse {
                product_id: p_id,
                quantity: qty,
                unit_price: price,
            });
        }
    }

    // Convert map values back to a Vector for the JSON response
    let result: Vec<OrderResponse> = orders_map.into_values().collect();
    
    Ok(Json(result))
}

pub async fn get_orders_summary(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<OrderSummaryResponse>>, (StatusCode, Json<String>)> {
    sqlx::query_as::<_, OrderSummaryResponse>(
        r"
        SELECT 
            o.id, o.customer_id, o.status, o.created_at, o.total_price, 
            COALESCE(SUM(oi.quantity), 0) as number_of_items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
        "
    )
    .fetch_all(&state.db)
    .await
    .map(Json)
    .map_err(|e| {
        eprintln!("Error fetching order summaries: {e}");
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })
}

pub async fn get_order_details(
    State(state): State<Arc<AppState>>,
    Path(order_id): Path<Uuid>
) -> Result<Json<OrderResponse>, (StatusCode, Json<String>)> {
    // Join orders and order_items to get all details in one query
    let rows = sqlx::query_as::<_, OrderRow>(
        r"
        SELECT 
            o.id, o.customer_id, o.status, o.created_at, o.total_price,
            oi.product_id, oi.quantity, oi.unit_price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        ORDER BY o.created_at DESC
        "
    )
    .bind(order_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    if rows.is_empty() {
        return Err((StatusCode::NOT_FOUND, Json("Order not found".into())));
    }

    // Since it's a join on a single Order ID, metadata is the same for all rows
    let first = &rows[0];
    let mut order_response = OrderResponse {
        id: first.id,
        customer_id: first.customer_id,
        status: first.status,
        created_at: first.created_at.clone(),
        total_price: first.total_price,
        items: Vec::new(),
    };

    // Extract items from rows (skipping if product_id is NULL)
    for row in rows {
        if let (Some(p_id), Some(qty), Some(price)) = (row.product_id, row.quantity, row.unit_price) {
            order_response.items.push(OrderItemResponse {
                product_id: p_id,
                quantity: qty,
                unit_price: price,
            });
        }
    }

    Ok(Json(order_response))
}
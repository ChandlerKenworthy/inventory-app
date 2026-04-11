use crate::state::AppState;
use std::sync::Arc;
use crate::models::order::{OrderResponseItem};
use axum::{Json, extract::State, http::StatusCode};
use sqlx::{Row};
use serde::{Deserialize};
use uuid::Uuid;
use chrono::Utc;

#[derive(Deserialize)]
pub struct CreateOrderPayload {
    pub customer_id: String,
    pub items: Vec<OrderItemInput>,
}

#[derive(Deserialize)]
pub struct OrderItemInput {
    pub product_id: String,
    pub quantity: i64,
}

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
) -> Json<Vec<OrderResponseItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, customer_id, status, created_at, total_price FROM orders
        "#
    ).fetch_all(&state.db)
    .await.unwrap();

    let orders = rows.into_iter().map(|row| {
        OrderResponseItem {
            id: row.get("id"),
            customer_id: row.get("customer_id"),
            status: row.get("status"),
            order_time: row.get("created_at"),
            total_price: row.get("total_price"),
        }
    }).collect();

    Json(orders)
}
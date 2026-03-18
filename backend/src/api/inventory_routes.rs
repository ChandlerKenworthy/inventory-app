use axum::{
    extract::State,
    Json,
    http::StatusCode
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::inventory::{InventoryResponseItem, CreateInventoryItem};
use crate::state::AppState;

pub async fn get_inventory(State(state): State<Arc<AppState>>) -> Json<Vec<InventoryResponseItem>> {

    let rows = sqlx::query(
        "SELECT product_id, quantity, aisle, shelf, bin FROM inventory"
    ).fetch_all(&state.db)
    .await.unwrap();

    let inventory = rows.into_iter().map(|row| {
        InventoryResponseItem {
            product_id: row.get("product_id"),
            quantity: row.get("quantity"),
            aisle: row.get("aisle"),
            shelf: row.get("shelf"),
            bin: row.get("bin"),
        }
    }).collect();

    Json(inventory)
}

pub async fn update_inventory(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateInventoryItem>
) -> Result<Json<String>, StatusCode> {
    let result = sqlx::query(
        r#"INSERT INTO inventory (product_id, quantity, aisle, shelf, bin)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(product_id)
            DO UPDATE SET
            quantity = inventory.quantity + excluded.quantity
        "#
    )
    .bind(payload.product_id as i64)
    .bind(payload.quantity as i64)
    .bind(payload.aisle as i64)
    .bind(payload.shelf as i64)
    .bind(payload.bin as i64)
    .execute(&state.db);
    
    match result.await {
        Ok(_) => Ok(Json("Item added".to_string())),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}


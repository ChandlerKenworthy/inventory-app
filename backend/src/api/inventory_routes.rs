use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use uuid::Uuid;
use crate::models::inventory::InventoryItem;
use crate::models::order::OrderItemRecord;
use crate::state::AppState;
use crate::extractors::ValidatedJson;

pub async fn get_inventory(State(state): State<Arc<AppState>>) 
-> Result<Json<Vec<InventoryItem>>, (StatusCode, Json<String>)> {
    sqlx::query_as::<_, InventoryItem>(
        r"
        SELECT product_id, quantity, aisle, shelf, bin FROM inventory
        "
    )
    .fetch_all(&state.db)
    .await
    .map(Json)
    .map_err(|e| {
        eprintln!("Error fetching inventory: {e}");
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })
}

pub async fn get_instock_inventory(State(state): State<Arc<AppState>>) 
-> Result<Json<Vec<OrderItemRecord>>, (StatusCode, Json<String>)> {
    sqlx::query_as::<_, OrderItemRecord>(
        r"
        SELECT i.product_id, p.name AS product_name, i.quantity, p.price AS unit_price
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.quantity > 0
        "
    )
    .fetch_all(&state.db)
    .await
    .map(Json)
    .map_err(|e| {
        eprintln!("Error fetching in-stock inventory: {e}");
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })
}

pub async fn modify_inventory(
    State(state): State<Arc<AppState>>,
    ValidatedJson(payload): ValidatedJson<InventoryItem>
) -> Result<StatusCode, StatusCode> {
    sqlx::query(
        r"
        UPDATE inventory
        SET quantity = ?, aisle = ?, shelf = ?, bin = ?
        WHERE product_id = ?
        "
    )
    .bind(payload.location.quantity)
    .bind(payload.location.aisle)
    .bind(payload.location.shelf)
    .bind(payload.location.bin)
    .bind(payload.product_id)
    .execute(&state.db)
    .await
    .map(|_| StatusCode::OK)
    .map_err(|e| {
        eprintln!("Error updating inventory: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })
}

pub async fn update_inventory(
    State(state): State<Arc<AppState>>,
    ValidatedJson(payload): ValidatedJson<InventoryItem>
) -> Result<StatusCode, StatusCode> {
    sqlx::query(
        r"INSERT INTO inventory (product_id, quantity, aisle, shelf, bin)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(product_id)
            DO UPDATE SET
            quantity = inventory.quantity + excluded.quantity
        "
    )
    .bind(payload.product_id)
    .bind(payload.location.quantity)
    .bind(payload.location.aisle)
    .bind(payload.location.shelf)
    .bind(payload.location.bin)
    .execute(&state.db)
    .await
    .map(|_| StatusCode::OK)
    .map_err(|e| {
        eprintln!("Error updating inventory: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })
}

pub async fn delete_inventory_item(
    State(state): State<Arc<AppState>>,
    Path(product_id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query("DELETE FROM inventory WHERE product_id = ?")
        .bind(product_id)
        .execute(&state.db)
        .await
        .map_err(|e| {
            eprintln!("Error deleting inventory item: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    
    Ok(StatusCode::OK)
}
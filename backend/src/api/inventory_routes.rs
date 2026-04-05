use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::inventory::{InventoryResponseItem, CreateInventoryItem};
use crate::state::AppState;

pub async fn get_inventory(State(state): State<Arc<AppState>>) -> Json<Vec<InventoryResponseItem>> {

    let rows = sqlx::query(
        r#"
        SELECT product_id, quantity, aisle, shelf, bin FROM inventory
        WHERE quantity > 0
        "#
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

pub async fn modify_inventory(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateInventoryItem>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r#"
        UPDATE inventory
        SET quantity = ?, aisle = ?, shelf = ?, bin = ?
        WHERE product_id = ?
        "#
    )
    .bind(payload.quantity as i64)
    .bind(payload.aisle as i64)
    .bind(payload.shelf as i64)
    .bind(payload.bin as i64)
    .bind(payload.product_id as String) // Match on the ID
    .execute(&state.db);
    
    match result.await {
        Ok(_) => Ok(StatusCode::OK),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn update_inventory(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateInventoryItem>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r#"INSERT INTO inventory (product_id, quantity, aisle, shelf, bin)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(product_id)
            DO UPDATE SET
            quantity = inventory.quantity + excluded.quantity
        "#
    )
    .bind(payload.product_id as String)
    .bind(payload.quantity as i64)
    .bind(payload.aisle as i64)
    .bind(payload.shelf as i64)
    .bind(payload.bin as i64)
    .execute(&state.db);
    
    match result.await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn delete_inventory_item(
    State(state): State<Arc<AppState>>,
    Path(product_id): Path<String>, // Extracts {id} from the URL
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r#"
        DELETE FROM inventory WHERE product_id = ?
        "#
    )
    .bind(product_id)
    .execute(&state.db);

    match result.await {
        Ok(res) => {// Check if any rows were actually deleted
            if res.rows_affected() == 0 {
                return Err(StatusCode::NOT_FOUND);
            }
            Ok(StatusCode::OK)
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
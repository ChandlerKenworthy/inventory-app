use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::inventory::{InventoryResponseItem, CreateInventoryItem};
use crate::models::order::OrderItemRecord;
use crate::state::AppState;

pub async fn get_inventory(State(state): State<Arc<AppState>>) -> Json<Vec<InventoryResponseItem>> {
    let rows = sqlx::query(
        r"
        SELECT product_id, quantity, aisle, shelf, bin FROM inventory
        "
    ).fetch_all(&state.db)
    .await
    .unwrap();

    let items = rows.into_iter().map(|row| {
        InventoryResponseItem {
            product_id: row.get("product_id"),
            quantity: row.get("quantity"),
            aisle: row.get("aisle"),
            shelf: row.get("shelf"),
            bin: row.get("bin"),
        }
    }).collect();

    Json(items)
}

pub async fn get_instock_inventory(State(state): State<Arc<AppState>>) -> Json<Vec<OrderItemRecord>> {
    let rows = sqlx::query(
        r"
        SELECT i.product_id, p.name AS product_name, i.quantity, p.price AS unit_price
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.quantity > 0
        "
    ).fetch_all(&state.db)
    .await.unwrap();

    let items = rows.into_iter().map(|row| {
        OrderItemRecord {
            product_id: row.get("product_id"),
            product_name: row.get("product_name"),
            quantity: row.get("quantity"),
            unit_price: row.get("unit_price"),
        }
    }).collect();

    Json(items)
}

pub async fn modify_inventory(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateInventoryItem>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r"
        UPDATE inventory
        SET quantity = ?, aisle = ?, shelf = ?, bin = ?
        WHERE product_id = ?
        "
    )
    .bind(i64::from(payload.quantity))
    .bind(i64::from(payload.aisle))
    .bind(i64::from(payload.shelf))
    .bind(i64::from(payload.bin))
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
        r"INSERT INTO inventory (product_id, quantity, aisle, shelf, bin)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(product_id)
            DO UPDATE SET
            quantity = inventory.quantity + excluded.quantity
        "
    )
    .bind(payload.product_id as String)
    .bind(i64::from(payload.quantity))
    .bind(i64::from(payload.aisle))
    .bind(i64::from(payload.shelf))
    .bind(i64::from(payload.bin))
    .execute(&state.db);
    
    match result.await {
        Ok(_) => Ok(StatusCode::OK),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn delete_inventory_item(
    State(state): State<Arc<AppState>>,
    Path(product_id): Path<String>, // Extracts {id} from the URL
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r"
        DELETE FROM inventory WHERE product_id = ?
        "
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
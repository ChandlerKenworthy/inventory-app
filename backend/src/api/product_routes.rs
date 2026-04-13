use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::product::ProductResponseItem;
use crate::state::AppState;

pub async fn get_products(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<ProductResponseItem>>, (StatusCode, Json<String>)> {
    let rows = sqlx::query(
        "
        SELECT * FROM products
        "
    ).fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    let products = rows.into_iter().map(|row| {
        ProductResponseItem {
            name: row.get("name"),
            id: row.get("id"),
            is_fragile: row.get("is_fragile"),
            weight: row.get("weight"),
            width: row.get("width"),
            height: row.get("height"),
            depth: row.get("depth"),
            price: row.get("price"),
        }
    }).collect();

    Ok(Json(products))
}

pub async fn get_product_details(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>
) -> Result<Json<ProductResponseItem>, StatusCode> {
    let row = sqlx::query(
        "
        SELECT * FROM products
        WHERE id = ?
        "
    )
    .bind(id as String)
    .fetch_one(&state.db)
    .await;

    match row {
        Ok(row) => {
            let product = ProductResponseItem {
                name: row.get("name"),
                id: row.get("id"),
                is_fragile: row.get("is_fragile"),
                weight: row.get("weight"),
                width: row.get("width"),
                height: row.get("height"),
                depth: row.get("depth"),
                price: row.get("price"),
            };
            Ok(Json(product))
        }
        Err(_) => Err(StatusCode::NOT_FOUND)
    }
}

pub async fn add_product(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ProductResponseItem>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r"
        INSERT INTO products (id, name, is_fragile, weight, width, height, depth, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        "
    )
    .bind(payload.id as String)
    .bind(payload.name)
    .bind(payload.is_fragile)
    .bind(payload.weight)
    .bind(payload.width)
    .bind(payload.height)
    .bind(payload.depth)
    .bind(payload.price)
    .execute(&state.db);
    
    match result.await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn delete_product(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r"
        DELETE FROM products
        WHERE id = ?
        "
    )
    .bind(id as String)
    .execute(&state.db);
    
    match result.await {
        Ok(res) => { // Check if any rows were actually deleted
            if res.rows_affected() == 0 {
                return Err(StatusCode::NOT_FOUND);
            }
            Ok(StatusCode::OK)
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
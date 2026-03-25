use axum::{
    extract::State,
    Json,
    http::StatusCode
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::product::ProductResponseItem;
use crate::state::AppState;

pub async fn get_products(
    State(state): State<Arc<AppState>>
) -> Json<Vec<ProductResponseItem>> {
    let rows = sqlx::query(
        "
        SELECT * FROM products
        "
    ).fetch_all(&state.db)
    .await.unwrap();

    let products = rows.into_iter().map(|row| {
        ProductResponseItem {
            name: row.get("name"),
            id: row.get("id"),
            is_fragile: row.get("is_fragile"),
            weight: row.get("weight"),
            width: row.get("width"),
            height: row.get("height"),
            depth: row.get("depth"),
        }
    }).collect();

    Json(products)
}

pub async fn add_product(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ProductResponseItem>
) -> Result<Json<String>, StatusCode> {
    let result = sqlx::query(
        r#"
        INSERT INTO products (id, name, is_fragile, weight, width, height, depth)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(payload.id as i64)
    .bind(payload.name)
    .bind(payload.is_fragile)
    .bind(payload.weight as f64)
    .bind(payload.width as f64)
    .bind(payload.height as f64)
    .bind(payload.depth as f64)
    .execute(&state.db);
    
    match result.await {
        Ok(_) => Ok(Json("Product added".to_string())),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
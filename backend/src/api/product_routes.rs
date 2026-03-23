use axum::{
    extract::State,
    Json,
    http::StatusCode
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::product::ProductResponseItem;
use crate::state::AppState;

pub async fn get_products(State(state): State<Arc<AppState>>) -> Json<Vec<ProductResponseItem>> {
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
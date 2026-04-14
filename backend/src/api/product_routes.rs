use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use uuid::Uuid;
use crate::models::product::ProductResponseItem;
use crate::state::AppState;
use crate::extractors::ValidatedJson;

pub async fn get_products(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<ProductResponseItem>>, (StatusCode, Json<String>)> {
    sqlx::query_as::<_, ProductResponseItem>(
        "
        SELECT * FROM products
        "
    ).fetch_all(&state.db)
    .await
    .map(Json)
    .map_err(|e| {
        eprintln!("Error fetching products: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })
}

pub async fn get_product_details(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>
) -> Result<Json<ProductResponseItem>, StatusCode> {
    sqlx::query_as::<_, ProductResponseItem>("SELECT * FROM products WHERE id = ?")
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map(Json)
    .map_err(|e| {
        eprintln!("Error fetching product details: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })
}

pub async fn add_product(
    State(state): State<Arc<AppState>>,
    ValidatedJson(payload): ValidatedJson<ProductResponseItem>
) -> Result<StatusCode, StatusCode> {
    sqlx::query(
        r"
        INSERT INTO products (id, name, is_fragile, weight, width, height, depth, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        "
    )
    .bind(payload.id)
    .bind(payload.name)
    .bind(payload.is_fragile)
    .bind(payload.weight)
    .bind(payload.width)
    .bind(payload.height)
    .bind(payload.depth)
    .bind(payload.price)
    .execute(&state.db)
    .await
    .map(|_| StatusCode::CREATED)
    .map_err(|e| {
        eprintln!("Error adding product: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })
}

pub async fn delete_product(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query("DELETE FROM products WHERE id = ?")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| {
            eprintln!("Error deleting product: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    
    Ok(StatusCode::OK)
}
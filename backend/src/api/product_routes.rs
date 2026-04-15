use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use uuid::Uuid;
use crate::models::product::{ProductResponseItem, ProductDetails, ProductDetailsRow, Dimensions};
use crate::models::inventory::LocationInformation;
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
        eprintln!("Error fetching products: {e}");
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })
}

pub async fn get_product_details(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>
) -> Result<Json<ProductDetails>, StatusCode> {
    // Note this is future-proofed to handle multiple inventory locations per product, even though our current schema only supports one
    let rows = sqlx::query_as::<_, ProductDetailsRow>(
        r"
        SELECT p.id, p.name, p.is_fragile, p.weight, p.width, p.height, p.depth, p.price,
               COALESCE(i.quantity, 0) AS quantity,
               COALESCE(i.aisle, 0) AS aisle,
               COALESCE(i.shelf, 0) AS shelf,
               COALESCE(i.bin, 0) AS bin
        FROM products p
        LEFT JOIN inventory i ON p.id = i.product_id
        WHERE p.id = ?
        "
    )
    .bind(id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| {
        eprintln!("Error fetching product details: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if rows.is_empty() {
        return Err(StatusCode::NOT_FOUND);
    }

    // Since it's a join on a single product ID, metadata is the same for all rows
    let first = &rows[0];
    let mut product_response = ProductDetails {
        id: first.id,
        name: first.name.clone(),
        is_fragile: first.is_fragile,
        dimensions: Dimensions {
            weight: first.dimensions.weight,
            width: first.dimensions.width,
            height: first.dimensions.height,
            depth: first.dimensions.depth,
        },
        price: first.price,
        inventory: Vec::new(),
    };

    // Extract items from rows (skipping if product_id is NULL)
    for row in rows {
        if let (Some(qty), Some(aisle), Some(shelf), Some(bin)) = (row.quantity, row.aisle, row.shelf, row.bin) {
            product_response.inventory.push(LocationInformation {
                quantity: qty,
                aisle,
                shelf,
                bin,
            });
        }
    }

    Ok(Json(product_response))
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
    .bind(payload.dimensions.weight)
    .bind(payload.dimensions.width)
    .bind(payload.dimensions.height)
    .bind(payload.dimensions.depth)
    .bind(payload.price)
    .execute(&state.db)
    .await
    .map(|_| StatusCode::CREATED)
    .map_err(|e| {
        eprintln!("Error adding product: {e}");
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
            eprintln!("Error deleting product: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    
    Ok(StatusCode::OK)
}
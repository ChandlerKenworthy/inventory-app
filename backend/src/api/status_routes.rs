use axum::{
    http::StatusCode,
    extract::State,
    Json
};
use std::sync::Arc;
use crate::state::AppState;
use crate::models::database::TableStatus;

pub async fn get_status() -> StatusCode {
    StatusCode::OK
}

pub async fn get_db_status(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<TableStatus>>, StatusCode> {
    let rows = sqlx::query_as::<_, TableStatus>(
        r#"
        SELECT 
            /* Extract the base table name from index names (e.g., 'orders_1' -> 'orders') */
            CASE 
                WHEN name LIKE 'products%' THEN 'products'
                WHEN name LIKE 'orders%' THEN 'orders'
                WHEN name LIKE 'order_items%' THEN 'order_items'
                WHEN name LIKE 'inventory%' THEN 'inventory'
                WHEN name LIKE 'customers%' THEN 'customers'
                ELSE name 
            END as table_name,
            (SUM(pgsize) * 1.0 / (1024 * 1024)) as size_mb
        FROM dbstat
        WHERE aggregate = TRUE 
          AND name NOT LIKE 'sqlite_%'
        GROUP BY table_name
        ORDER BY table_name ASC;
        "#
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| {
        eprintln!("Database status error: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(rows))
}
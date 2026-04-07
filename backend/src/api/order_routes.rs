use crate::state::AppState;
use std::sync::Arc;
use crate::models::order::{OrderResponseItem};
use axum::{Json, extract::State, http::StatusCode};
use sqlx::Row;

pub async fn create_order(
    State(state): State<Arc<AppState>>,
    //Json(payload): Json<Not sure what the type should be here>
) -> Result<StatusCode, StatusCode> {
    //let result = sqlx::query(
    //    r#"
    //    INSERT INTO orders ......
    //    "#
    //)
    //.bind(...)
    //.execute(&state.db);

    //match result.await {
    //    Ok(_) => Ok(StatusCode::CREATED),
    //    Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    //}
    Ok(StatusCode::CREATED)
}

pub async fn get_orders(
    State(state): State<Arc<AppState>>
) -> Json<Vec<OrderResponseItem>> {
    let rows = sqlx::query(
        r#"
        SELECT id, customer_id, status, created_at, delivery_date FROM orders
        "#
    ).fetch_all(&state.db)
    .await.unwrap();

    let orders = rows.into_iter().map(|row| {
        OrderResponseItem {
            id: row.get("id"),
            customer_id: row.get("customer_id"),
            status: row.get("status"),
            order_time: row.get("created_at"),
            delivery_date: row.get("delivery_date"),
        }
    }).collect();

    Json(orders)
}
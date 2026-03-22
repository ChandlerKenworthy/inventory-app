use axum::{
    extract::State,
    Json,
    http::StatusCode
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::customer::{Customer};
use crate::state::AppState;

pub async fn get_customers(State(state): State<Arc<AppState>>) -> Json<Vec<Customer>> {

    let rows = sqlx::query(
        "SELECT id, first_name, second_name, email FROM customers"
    ).fetch_all(&state.db)
    .await.unwrap();

    let customers = rows.into_iter().map(|row| {
        Customer {
            id: row.get("id"),
            first_name: row.get("first_name"),
            second_name: row.get("second_name"),
            email: row.get("email"),
        }
    }).collect();

    Json(customers)
}

pub async fn update_customers(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<Customer>
) -> Result<Json<String>, StatusCode> {
    let result = sqlx::query(
        r#"
        INSERT INTO customers (id, first_name, second_name, email)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                second_name = EXCLUDED.second_name,
                email = EXCLUDED.email
        "#
    )
    .bind(payload.id as i64)
    .bind(payload.first_name as String)
    .bind(payload.second_name as String)
    .bind(payload.email as String)
    .execute(&state.db);

    match result.await {
        Ok(_) => Ok(Json("Customer added".to_string())),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}


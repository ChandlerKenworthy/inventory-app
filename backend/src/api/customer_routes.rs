use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use uuid::Uuid;
use std::sync::Arc;
use crate::models::customer::{Customer, CustomerWithOrderCount};
use crate::state::AppState;
use crate::extractors::ValidatedJson;

pub async fn get_customer_details(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>
) -> Result<Json<Customer>, StatusCode> {
    sqlx::query_as::<_, Customer>(
        r"
        SELECT * FROM customers
        WHERE id = ?
        "
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    .map(Json)
    .map_err(|e| match e {
            sqlx::Error::RowNotFound => StatusCode::NOT_FOUND,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        })
}

pub async fn get_customers(State(state): State<Arc<AppState>>) 
-> Result<Json<Vec<CustomerWithOrderCount>>, (StatusCode, Json<String>)> {
    sqlx::query_as::<_, CustomerWithOrderCount>(
        r"
        SELECT c.id, c.first_name, c.second_name, c.email, COUNT(o.id) AS order_count
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id
        "
    )
    .fetch_all(&state.db)
    .await
    .map(Json)
    .map_err(|e| {
        eprintln!("Error fetching customers: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })
}

pub async fn add_new_customer(
    State(state): State<Arc<AppState>>,
    ValidatedJson(payload): ValidatedJson<Customer>
) -> Result<StatusCode, StatusCode> {
    sqlx::query(
        r"
        INSERT INTO customers (id, first_name, second_name, email)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                second_name = EXCLUDED.second_name,
                email = EXCLUDED.email
        "
    )
    .bind(payload.id)
    .bind(payload.first_name)
    .bind(payload.second_name)
    .bind(payload.email)
    .execute(&state.db)
    .await
    .map(|_| StatusCode::CREATED)
    .map_err(|e| {
        eprintln!("Error adding customer: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })
}

pub async fn delete_customer(
    State(state): State<Arc<AppState>>,
    Path(customer_id): Path<Uuid>, // Axum will only accept valid UUIDs, i.e. validation is done safely
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query("DELETE FROM customers WHERE id = ?")
        .bind(customer_id)
        .execute(&state.db)
        .await
        .map_err(|e| {
            eprintln!("Error deleting customer: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    
    Ok(StatusCode::OK)
}

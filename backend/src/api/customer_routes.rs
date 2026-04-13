use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::customer::{Customer};
use crate::state::AppState;

pub async fn get_customer_details(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>
) -> Result<Json<Customer>, StatusCode> {
    let row = sqlx::query(
        r"
        SELECT * FROM customers
        WHERE id = ?
        "
    ).bind(id as String).fetch_one(&state.db).await;

    match row {
        Ok(row) => {
            let customer = Customer {
                id: row.get("id"),
                first_name: row.get("first_name"),
                second_name: row.get("second_name"),
                email: row.get("email"),
            };
            Ok(Json(customer))
        }
        Err(sqlx::Error::RowNotFound) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

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

pub async fn add_new_customer(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<Customer>
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r"
        INSERT INTO customers (id, first_name, second_name, email)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                second_name = EXCLUDED.second_name,
                email = EXCLUDED.email
        "
    )
    .bind(payload.id as String)
    .bind(payload.first_name as String)
    .bind(payload.second_name as String)
    .bind(payload.email as String)
    .execute(&state.db);

    match result.await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn delete_customer(
    State(state): State<Arc<AppState>>,
    Path(customer_id): Path<String>, // Extracts {id} from the URL
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query(
        r"
        DELETE FROM customers WHERE id = ?
        "
    )
    .bind(customer_id as String)
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

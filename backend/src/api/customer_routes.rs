use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use std::sync::Arc;
use sqlx::Row;
use crate::models::customer::{Customer, CustomerWithOrderCount};
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

pub async fn get_customers(State(state): State<Arc<AppState>>) 
-> Result<Json<Vec<CustomerWithOrderCount>>, (StatusCode, Json<String>)> {
    let rows = sqlx::query(
        r"
        SELECT c.id, c.first_name, c.second_name, c.email, COUNT(o.id) AS order_count
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id
        "
    ).fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())))?;

    let customers = rows.into_iter().map(|row| {
        CustomerWithOrderCount {
            id: row.get("id"),
            first_name: row.get("first_name"),
            second_name: row.get("second_name"),
            email: row.get("email"),
            order_count: row.get("order_count"),
        }
    }).collect();

    Ok(Json(customers))
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

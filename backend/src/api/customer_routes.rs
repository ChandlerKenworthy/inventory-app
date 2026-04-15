use axum::{
    extract::State,
    Json,
    http::StatusCode,
    extract::Path,
};
use uuid::Uuid;
use std::sync::Arc;
use crate::models::customer::{Customer, CustomerWithOrderCount, CustomerWithOrderHistory, CustomerRow};
use crate::models::order::OrderBriefResponse;
use crate::state::AppState;
use crate::extractors::ValidatedJson;

pub async fn get_customer_details(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>
) -> Result<Json<CustomerWithOrderHistory>, (StatusCode, Json<String>)> {
    let rows = sqlx::query_as::<_, CustomerRow>(
        r"
        SELECT 
            c.id, c.first_name, c.second_name, c.email, 
            o.id AS order_id, o.created_at, o.total_price
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        WHERE c.id = ?
        "
    )
    .bind(id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| {
        eprintln!("Error fetching customer details: {e}");
        (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))
    })?;

    if rows.is_empty() {
        return Err((StatusCode::NOT_FOUND, Json("Customer not found".into())));
    }

    // Since it's a join on a single customer ID, metadata is the same for all rows
    let first = &rows[0];
    let mut customer_response = CustomerWithOrderHistory {
        first_name: first.first_name.clone(),
        second_name: first.second_name.clone(),
        email: first.email.clone(),
        id: first.id,
        orders: Vec::new(),
    };

    // Extract items from rows (skipping if product_id is NULL)
    for row in rows {
        if let (Some(o_id), Some(created_at), Some(total_price)) = (row.order_id, row.created_at, row.total_price) {
            customer_response.orders.push(OrderBriefResponse {
                order_id: o_id,
                created_at,
                total_price,
            });
        }
    }

    Ok(Json(customer_response))
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
        eprintln!("Error fetching customers: {e}");
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
        eprintln!("Error adding customer: {e}");
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
            eprintln!("Error deleting customer: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    
    Ok(StatusCode::OK)
}

use serde::{Deserialize, Serialize};
use crate::models::order::OrderBriefResponse;
use validator::Validate;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Clone, Validate, sqlx::FromRow)]
pub struct Customer {
    #[validate(length(min = 2, max = 100, message = "First name must be between 2 and 100 characters"))]
    pub first_name: String, // first name of the customer e.g. "John"
    #[validate(length(min = 2, max = 100, message = "Second name must be between 2 and 100 characters"))]
    pub second_name: String, // second name of the customer e.g. "Smith"
    #[validate(email)]
    pub email: String,
    pub id: Uuid, // uuidv4 string e.g. "550e8400-e29b-41d4-a716-446655440000"
}

#[derive(Serialize, sqlx::FromRow)]
pub struct CustomerRow {
    pub first_name: String,
    pub second_name: String,
    pub email: String,
    pub id: Uuid,
    // These come from the LEFT JOIN and might be NULL
    pub order_id: Option<Uuid>,
    pub created_at: Option<String>,
    pub total_price: Option<f64>,
}

#[derive(Serialize)]
pub struct CustomerWithOrderHistory {
    pub first_name: String, // first name of the customer e.g. "John"
    pub second_name: String, // second name of the customer e.g. "Smith"
    pub email: String,
    pub id: Uuid, // uuidv4 string e.g. "550e8400-e29b-41d4-a716-446655440000"
    pub orders: Vec<OrderBriefResponse>, // list of orders associated with this customer
}

#[derive(Deserialize, Serialize, Clone, Validate, sqlx::FromRow)]
pub struct CustomerWithOrderCount {
    #[validate(length(min = 2, max = 100, message = "First name must be between 2 and 100 characters"))]
    pub first_name: String, // first name of the customer e.g. "John"
    #[validate(length(min = 2, max = 100, message = "Second name must be between 2 and 100 characters"))]
    pub second_name: String, // second name of the customer e.g. "Smith"
    #[validate(email)]
    pub email: String,
    pub id: Uuid, // uuidv4 string e.g. "550e8400-e29b-41d4-a716-446655440000"
    #[validate(range(min = 0, message = "Order count must be a non-negative integer"))]
    pub order_count: i64, // number of orders associated with this customer
}

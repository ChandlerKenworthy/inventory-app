// use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};
use validator::Validate;
use uuid::Uuid;

#[derive(Deserialize, Validate, sqlx::FromRow)] // Used when making new orders
pub struct CreateOrderPayload {
    pub customer_id: Uuid,
    #[validate(length(min = 1, message = "Order must contain at least one item"))]
    pub items: Vec<OrderItemInput>,
}

#[derive(Deserialize, Serialize, Validate, sqlx::FromRow)] // Used when making new orders
pub struct OrderItemInput {
    pub product_id: Uuid,
    #[validate(range(min = 1, message = "Quantity must be a positive integer"))]
    pub quantity: i32,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct OrderRow {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    // These come from the LEFT JOIN and might be NULL
    pub product_id: Option<Uuid>,
    pub quantity: Option<i64>,
    pub unit_price: Option<f64>,
}

#[derive(Serialize)] // used when returning orders to the frontend
pub struct OrderResponse {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    pub items: Vec<OrderItemResponse>,
}

#[derive(Serialize)] // used in OrderResponse to return the line items for an order
pub struct OrderItemResponse {
    pub product_id: Uuid,
    pub quantity: i64,
    pub unit_price: f64,
}

#[derive(Serialize, sqlx::FromRow)] // used when returning order summaries to the frontend
pub struct OrderSummaryResponse {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    pub number_of_items: i64,
}

#[derive(Serialize, Clone, sqlx::FromRow)]
pub struct OrderItemRecord {
    pub product_id: Uuid,
    pub product_name: Option<String>,
    pub quantity: u32,
    pub unit_price: f64,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct OrderBriefResponse {
    pub order_id: Uuid,
    pub created_at: String,
    pub total_price: f64,
}
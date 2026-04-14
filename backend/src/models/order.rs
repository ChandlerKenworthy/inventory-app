// use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};
use validator::Validate;

#[derive(Deserialize, Validate)] // Used when making new orders
pub struct CreateOrderPayload {
    pub customer_id: String,
    #[validate(length(min = 1, message = "Order must contain at least one item"))]
    pub items: Vec<OrderItemInput>,
}

#[derive(Deserialize, Serialize, Validate)] // Used when making new orders
pub struct OrderItemInput {
    pub product_id: String,
    #[validate(range(min = 1, message = "Quantity must be a positive integer"))]
    pub quantity: i32,
}

#[derive(Serialize)] // used when returning orders to the frontend
pub struct OrderResponse {
    pub id: String,
    pub customer_id: String,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    pub items: Vec<OrderItemResponse>,
}

#[derive(Serialize)] // used in OrderResponse to return the line items for an order
pub struct OrderItemResponse {
    pub product_id: String,
    pub quantity: i64,
    pub unit_price: f64,
}

#[derive(Serialize)] // used when returning order summaries to the frontend
pub struct OrderSummaryResponse {
    pub id: String,
    pub customer_id: String,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    pub number_of_items: i64,
}

#[derive(Serialize, Clone)] // used in inventory_routes (???)
pub struct OrderItemRecord {
    pub product_id: String,
    pub product_name: Option<String>,
    pub quantity: u32,
    pub unit_price: f64,
}

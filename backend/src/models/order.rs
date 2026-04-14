// use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};
use validator::Validate;
use uuid::Uuid;

#[derive(Deserialize, Validate, sqlx::FromRow)] // Used when making new orders
pub struct CreateOrderPayload {
    #[sqlx(try_from = "String")]
    pub customer_id: Uuid,
    #[validate(length(min = 1, message = "Order must contain at least one item"))]
    pub items: Vec<OrderItemInput>,
}

#[derive(Deserialize, Serialize, Validate, sqlx::FromRow)] // Used when making new orders
pub struct OrderItemInput {
    #[sqlx(try_from = "String")]
    pub product_id: Uuid,
    #[validate(range(min = 1, message = "Quantity must be a positive integer"))]
    pub quantity: i32,
}

#[derive(Serialize, sqlx::FromRow)] // used when returning orders to the frontend
pub struct OrderResponse {
    #[sqlx(try_from = "String")]
    pub id: Uuid,
    #[sqlx(try_from = "String")]
    pub customer_id: Uuid,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    pub items: Vec<OrderItemResponse>,
}

#[derive(Serialize, sqlx::FromRow)] // used in OrderResponse to return the line items for an order
pub struct OrderItemResponse {
    #[sqlx(try_from = "String")]
    pub product_id: Uuid,
    pub quantity: i64,
    pub unit_price: f64,
}

#[derive(Serialize, sqlx::FromRow)] // used when returning order summaries to the frontend
pub struct OrderSummaryResponse {
    #[sqlx(try_from = "String")]
    pub id: Uuid,
    #[sqlx(try_from = "String")]
    pub customer_id: Uuid,
    pub status: i32,
    pub created_at: String,
    pub total_price: f64,
    pub number_of_items: i64,
}

#[derive(Serialize, Clone, sqlx::FromRow)] // used in inventory_routes (???)
pub struct OrderItemRecord {
    #[sqlx(try_from = "String")]
    pub product_id: Uuid,
    pub product_name: Option<String>,
    pub quantity: u32,
    pub unit_price: f64,
}

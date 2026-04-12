use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};

#[derive(Deserialize)] // Used when making new orders
pub struct CreateOrderPayload {
    pub customer_id: String,
    pub items: Vec<OrderItemInput>,
}

#[derive(Deserialize)] // Used when making new orders
pub struct OrderItemInput {
    pub product_id: String,
    pub quantity: i64,
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

pub struct Order {
    pub id: String, // unique order ID (uuidv4)
    pub customer_id: String, // ID of the customer who placed the order (uuidv4)
    pub status: OrderStatus,
    pub items: Vec<OrderItem>, // vector of all products in the order
    pub order_time: DateTime<Utc>,
    pub delivery_date: Option<NaiveDate>, // may not have a specificed delivery date yet

}

pub struct OrderItem {
    pub product_id: String,
    pub quantity: u32,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum OrderStatus {
    Received,
    Processing,
    Dispatched,
    Delivered,
    Cancelled,
}
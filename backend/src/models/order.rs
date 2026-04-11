use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Clone)]
pub struct OrderResponseItem {
    pub id: String,
    pub customer_id: String,
    pub status: u8,
    pub order_time: String,
    pub total_price: f64
}

#[derive(Serialize, Clone)]
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
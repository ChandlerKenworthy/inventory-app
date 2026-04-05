use chrono::{DateTime, Utc, NaiveDate};
use super::product::ProductId;
use serde::{Serialize, Deserialize};

pub struct OrderId(pub u64);

#[derive(Serialize, Clone)]
pub struct OrderResponseItem {
    pub id: u64,
    pub customer_id: u64,
    pub status: u8,
    //pub items: Vec<OrderItem>,
    pub order_time: String,
    pub delivery_date: Option<String>,
}

pub struct Order {
    pub id: OrderId, // unique order ID
    pub customer_id: String, // ID of the customer who placed the order
    pub status: OrderStatus,
    pub items: Vec<OrderItem>, // vector of all products in the order
    pub order_time: DateTime<Utc>,
    pub delivery_date: Option<NaiveDate>, // may not have a specificed delivery date yet

}

pub struct OrderItem {
    pub product_id: ProductId,
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
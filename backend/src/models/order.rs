use chrono::{DateTime, Utc, NaiveDate};
use super::customer::CustomerId;
use super::product::ProductId;

pub struct OrderId(pub u64);

pub struct Order {
    pub id: OrderId, // unique order ID
    pub customer_id: CustomerId, // ID of the customer who placed the order
    pub status: OrderStatus,
    pub items: Vec<OrderItem>, // vector of all products in the order
    pub order_time: DateTime<Utc>,
    pub delivery_date: Option<NaiveDate>, // may not have a specificed delivery date yet

}

pub struct OrderItem {
    pub product_id: ProductId,
    pub quantity: u32,
}

pub enum OrderStatus {
    Received,
    Processing,
    Dispatched,
    Delivered,
    Cancelled,
}
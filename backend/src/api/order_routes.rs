use serde::Deserialize;
use axum::{extract::State, Json};
use std::sync::Arc;

use crate::state::AppState;
use crate::models::product::ProductId;

#[derive(Deserialize)]
pub struct CreateOrderRequest {
    pub customer_id: u64,
    pub items: Vec<CreateOrderItem>,
}

#[derive(Deserialize)]
pub struct CreateOrderItem {
    pub product_id: u64,
    pub quantity: u32,
}

pub async fn create_order(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateOrderRequest>,
) -> Json<String> {

    let mut inventory = state.inventory.lock().unwrap();

    // Check inventory availability
    for item in &request.items {

        let product_id = ProductId(item.product_id);

        let stock_item = inventory
            .stock
            .get_mut(&product_id)
            .expect("Product does not exist");

        if stock_item.quantity < item.quantity {
            panic!("Not enough stock");
        }

        stock_item.quantity -= item.quantity;
    }

    Json("Order placed successfully".to_string())
}
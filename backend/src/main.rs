use axum::{Router, routing::get, routing::post};
use std::{sync::Arc, collections::HashMap};
use sqlx::sqlite::SqlitePool;

mod models;
mod api;
mod state;

use state::AppState;
use models::inventory::Inventory;
use models::inventory::{InventoryItem, WarehouseLocation};
use models::product::ProductId;
use models::customer::{CustomerId, Customer, CustomerList};

#[tokio::main]
async fn main() {

    let pool = SqlitePool::connect("sqlite:inventory.db")
        .await
        .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS inventory (
            product_id INTEGER PRIMARY KEY,
            quantity INTEGER NOT NULL,
            aisle INTEGER,
            shelf INTEGER,
            bin INTEGER
        );
        "#
    )
    .execute(&pool)
    .await
    .unwrap();

    let state = Arc::new(AppState { db: pool });

    let app = Router::new()
        .route("/api/inventory", get(api::inventory_routes::get_inventory))
        .route("/api/inventory", post(api::inventory_routes::update_inventory))
        //.route("/api/orders", post(api::order_routes::create_order))
        //.route("/api/customers", get(api::customer_routes::get_customers))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}
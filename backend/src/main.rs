// Make clippy very pedantic to enforce best practices and catch potential issues early
#![warn(clippy::all)]
#![warn(clippy::pedantic)]
#![allow(clippy::module_name_repetitions)] // Allow some pedantic lints
#![allow(clippy::missing_errors_doc)] // Allow some pedantic lints
#![allow(clippy::missing_docs_in_private_items)] // Allow some pedantic lints
#![allow(clippy::too_many_arguments)] // Allow some pedantic lints

use axum::{Router, routing::get, routing::post, routing::delete};
use std::{sync::Arc};
use sqlx::sqlite::SqlitePool;

mod models;
mod api;
mod state;
mod extractors;

use state::AppState;

#[tokio::main]
async fn main() {

    let pool = SqlitePool::connect("sqlite:inventory.db")
        .await
        .unwrap();

    sqlx::query(
        r"
        CREATE TABLE IF NOT EXISTS inventory (
            product_id BLOB PRIMARY KEY,
            quantity INTEGER NOT NULL,
            aisle INTEGER,
            shelf INTEGER,
            bin INTEGER
        );
        "
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r"
        CREATE TABLE IF NOT EXISTS customers (
            id BLOB PRIMARY KEY,
            first_name TEXT NOT NULL,
            second_name TEXT NOT NULL,
            email TEXT NOT NULL
        );
        "
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r"
        CREATE TABLE IF NOT EXISTS products (
            id BLOB PRIMARY KEY,
            name TEXT NOT NULL,
            is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
            weight REAL NOT NULL,
            width REAL NOT NULL,
            height REAL NOT NULL,
            depth REAL NOT NULL,
            price REAL NOT NULL
        );
        "
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r"
        CREATE TABLE IF NOT EXISTS orders (
            id BLOB PRIMARY KEY NOT NULL,
            customer_id BLOB NOT NULL,
            status INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            delivery_date TIMESTAMP,
            total_price REAL NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );
        "
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r"
        CREATE TABLE IF NOT EXISTS order_items (
            id BLOB PRIMARY KEY NOT NULL,
            order_id BLOB NOT NULL,
            product_id BLOB NOT NULL,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            unit_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
        "
    )
    .execute(&pool)
    .await
    .unwrap();

    let state = Arc::new(AppState { db: pool });

    let app = Router::new()
        // Inventory CRUD routes
        .route("/api/inventory/instock", get(api::inventory_routes::get_instock_inventory))
        .route("/api/inventory", get(api::inventory_routes::get_inventory))
        .route("/api/inventory", post(api::inventory_routes::update_inventory))
        .route("/api/inventory/{id}", delete(api::inventory_routes::delete_inventory_item))
        .route("/api/modify_inventory", post(api::inventory_routes::modify_inventory))
        // Customer CRUD routes
        .route("/api/customers", get(api::customer_routes::get_customers))
        .route("/api/customers", post(api::customer_routes::add_new_customer))
        .route("/api/customers/{id}", get(api::customer_routes::get_customer_details))
        .route("/api/customers/{id}", delete(api::customer_routes::delete_customer))
        // Routes for CRUD operations on products
        .route("/api/products", get(api::product_routes::get_products))
        .route("/api/products", post(api::product_routes::add_product))
        .route("/api/products/{id}", delete(api::product_routes::delete_product))
        .route("/api/products/{id}", get(api::product_routes::get_product_details))
        // Routes for CRUD operations on orders
        .route("/api/orders", get(api::order_routes::get_orders)) // For all orders
        .route("/api/orders/summary", get(api::order_routes::get_orders_summary)) // For summary of all orders
        .route("/api/orders/{id}", get(api::order_routes::get_order_details)) // For a single order
        .route("/api/orders", post(api::order_routes::create_order))
        // For monitoring server health and database status
        .route("/api/health", get(api::status_routes::get_status))        
        .route("/api/query", post(api::special_routes::run_custom_query))
        .route("/api/db_status", get(api::status_routes::get_db_status))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}
use axum::{Router, routing::get, routing::post, routing::delete};
use std::{sync::Arc};
use sqlx::sqlite::SqlitePool;

mod models;
mod api;
mod state;

use state::AppState;

#[tokio::main]
async fn main() {

    let pool = SqlitePool::connect("sqlite:inventory.db")
        .await
        .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS inventory (
            product_id TEXT PRIMARY KEY,
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

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            first_name TEXT NOT NULL,
            second_name TEXT NOT NULL,
            email TEXT NOT NULL
        );
        "#
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
            weight REAL NOT NULL,
            width REAL NOT NULL,
            height REAL NOT NULL,
            depth REAL NOT NULL,
            price REAL NOT NULL
        );
        "#
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY NOT NULL,
            customer_id INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            delivery_date TIMESTAMP,
            total_price REAL NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );
        "#
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY NOT NULL,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            unit_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
        "#
    )
    .execute(&pool)
    .await
    .unwrap();

    let state = Arc::new(AppState { db: pool });

    let app = Router::new()
        .route("/api/inventory", get(api::inventory_routes::get_inventory))
        .route("/api/inventory/instock", get(api::inventory_routes::get_instock_inventory))
        .route("/api/inventory", post(api::inventory_routes::update_inventory))
        .route("/api/modify_inventory", post(api::inventory_routes::modify_inventory))
        .route("/api/customers", get(api::customer_routes::get_customers))
        .route("/api/customers", post(api::customer_routes::add_new_customer))
        .route("/api/health", get(api::status_routes::get_status))
        .route("/api/products", get(api::product_routes::get_products))
        .route("/api/products", post(api::product_routes::add_product))
        .route("/api/inventory/{id}", delete(api::inventory_routes::delete_inventory_item))
        .route("/api/products/{id}", delete(api::product_routes::delete_product))
        .route("/api/products/{id}", get(api::product_routes::get_product_details))
        .route("/api/customers/{id}", delete(api::customer_routes::delete_customer))
        .route("/api/orders", get(api::order_routes::get_orders))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}
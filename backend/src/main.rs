use axum::{Router, routing::get, routing::post};
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

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY,
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
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
            weight REAL NOT NULL,
            width REAL NOT NULL,
            height REAL NOT NULL,
            depth REAL NOT NULL
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
        .route("/api/customers", get(api::customer_routes::get_customers))
        .route("/api/customers", post(api::customer_routes::update_customers))
        .route("/api/health", get(api::status_routes::get_status))
        .route("/api/products", get(api::product_routes::get_products))
        .route("/api/products", post(api::product_routes::add_product))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}
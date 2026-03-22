use axum::{
    http::StatusCode,
};

pub async fn get_status() -> StatusCode {
    StatusCode::OK
}
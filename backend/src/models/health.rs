use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    status: &'static str,
    db: bool,
}
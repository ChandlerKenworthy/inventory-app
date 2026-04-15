#[derive(serde::Serialize, sqlx::FromRow)]
pub struct TableStatus {
    pub table_name: String,
    pub size_mb: f64,
}

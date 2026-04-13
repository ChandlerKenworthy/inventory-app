use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct ProductResponseItem {
    pub name: String,
    pub id: String,
    pub is_fragile: bool,
    pub weight: f32,
    pub width: f32,
    pub height: f32,
    pub depth: f32,
    pub price: f32,
}
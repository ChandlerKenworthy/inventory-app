use serde::{Serialize, Deserialize};
use validator::Validate;
use crate::models::inventory::LocationInformation;
use uuid::Uuid;

#[derive(Serialize, sqlx::FromRow)]
pub struct ProductDetails {
    pub id: Uuid,
    pub name: String,
    pub is_fragile: bool,
    pub weight: f32,
    pub width: f32,
    pub height: f32,
    pub depth: f32,
    pub price: f32,
    pub inventory: Vec<LocationInformation>,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct ProductDetailsRow {
    pub id: Uuid,
    pub name: String,
    pub is_fragile: bool,
    pub weight: f32,
    pub width: f32,
    pub height: f32,
    pub depth: f32,
    pub price: f32,
    pub quantity: Option<u32>,
    pub aisle: Option<u16>,
    pub shelf: Option<u16>,
    pub bin: Option<u16>,
}

#[derive(Deserialize, Serialize, Clone, Validate, sqlx::FromRow)]
pub struct ProductResponseItem {
    #[validate(length(min = 1, max = 255, message = "Name must be between 1 and 255 characters"))]
    pub name: String,
    pub id: Uuid,
    pub is_fragile: bool,
    #[validate(range(min = 0.0, max = 1000.0, message = "Weight (kg) must be a non-negative number, less than 1000 kg"))]
    pub weight: f32,
    #[validate(range(min = 0.0, max = 500.0, message = "Width (cm) must be a non-negative number, less than 500 cm"))]
    pub width: f32,
    #[validate(range(min = 0.0, max = 500.0, message = "Height (cm) must be a non-negative number, less than 500 cm"))]
    pub height: f32,
    #[validate(range(min = 0.0, max = 500.0, message = "Depth (cm) must be a non-negative number, less than 500 cm"))]
    pub depth: f32,
    #[validate(range(min = 0.0, message = "Price must be a non-negative number"))]
    pub price: f32,
}
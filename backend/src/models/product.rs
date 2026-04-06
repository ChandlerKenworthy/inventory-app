use serde::{Serialize, Deserialize};

pub struct Dimensions { // in mm
    pub width: f32,
    pub height: f32,
    pub depth: f32,
}

pub struct Product {
    pub name: String, // customer-friendly name e.g "Luxury Chocolate Box 12-pieces"
    pub id: String, // uuidv4 string e.g "550e8400-e29b-41d4-a716-446655440000"
    pub is_fragile: bool, // is it fragile i.e. made of glass/ceramics etc.
    pub weight: f32, // weight in kg
    pub dimensions: Dimensions, // dimensions in mm
    pub price: f32, // price in GBP
}

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
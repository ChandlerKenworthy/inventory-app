use serde::{Serialize, Deserialize};

#[derive(Serialize, Eq, PartialEq, Hash, Clone)]
pub struct ProductId(pub u64);

pub struct Dimensions { // in mm
    pub width: f32,
    pub height: f32,
    pub depth: f32,
}

pub struct Product {
    pub name: String, // customer-friendly name e.g "Luxury Chocolate Box 12-pieces"
    pub id: ProductId, // unique product ID i.e. the barcode
    pub is_fragile: bool, // is it fragile i.e. made of glass/ceramics etc.
    pub weight: f32, // weight in kg
    pub dimensions: Dimensions, // dimensions in mm
}

#[derive(Deserialize, Serialize, Clone)]
pub struct ProductResponseItem {
    pub name: String,
    pub id: u64,
    pub is_fragile: bool,
    pub weight: f32,
    pub width: f32,
    pub height: f32,
    pub depth: f32,
}
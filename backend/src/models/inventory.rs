use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Clone)]
pub struct Inventory {
    pub stock: HashMap<String, InventoryItem>,
}

#[derive(Serialize, Clone)]
pub struct InventoryItem {
    pub quantity: u32,
    pub location: WarehouseLocation,
}

#[derive(Serialize, Clone)]
pub struct WarehouseLocation {
    pub aisle: u16,
    pub shelf: u16,
    pub bin: u16,
}

#[derive(Serialize, Clone)]
pub struct InventoryResponseItem {
    pub product_id: String,
    pub quantity: u32,
    pub aisle: u16,
    pub shelf: u16,
    pub bin: u16,
}

#[derive(Deserialize)]
pub struct CreateInventoryItem {
    pub product_id: String,
    pub quantity: u32,
    pub aisle: u16,
    pub shelf: u16,
    pub bin: u16,
}
use serde::{Serialize, Deserialize};

#[derive(Serialize, Clone)]
pub struct InventoryResponseItem {
    pub product_id: String,
    pub quantity: u32,
    pub aisle: u16,
    pub shelf: u16,
    pub bin: u16,
}

#[derive(Deserialize, Debug)]
pub struct CreateInventoryItem {
    pub product_id: String,
    pub quantity: u32,
    pub aisle: u16,
    pub shelf: u16,
    pub bin: u16,
}
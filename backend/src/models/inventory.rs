use serde::{Serialize, Deserialize};
use validator::Validate;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone, Validate, sqlx::FromRow)]
pub struct LocationInformation {
    #[validate(range(min = 0, max = 10000, message = "Quantity must be a non-negative integer"))]
    pub quantity: u32,
    #[validate(range(min = 0, max = 100, message = "Aisle must be in the range 0-100"))]
    pub aisle: u16,
    #[validate(range(min = 0, max = 50, message = "Shelf must be in the range 0-50"))]
    pub shelf: u16,
    #[validate(range(min = 0, max = 10, message = "Bin must be in the range 0-10"))]
    pub bin: u16,
}

#[derive(Deserialize, Serialize, Debug, Clone, Validate, sqlx::FromRow)]
pub struct InventoryItem {
    pub product_id: Uuid,
    #[sqlx(flatten)]
    #[validate(nested)] // Ensures validation rules on the inner struct are checked
    pub location: LocationInformation,
}

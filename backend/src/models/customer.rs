use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct Customer {
    pub first_name: String, // first name of the customer e.g. "John"
    pub second_name: String, // second name of the customer e.g. "Smith"
    pub email: String,
    pub id: String, // uuidv4 string e.g. "550e8400-e29b-41d4-a716-446655440000"
}

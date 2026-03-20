use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Eq, PartialEq, Hash, Clone)]
pub struct CustomerId(pub u64);

#[derive(Serialize, Clone)]
pub struct CustomerList {
    pub customers: Vec<Customer>,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct Customer {
    pub first_name: String, // first name of the customer e.g. "John"
    pub second_name: String, // second name of the customer e.g. "Smith"
    pub email: String,
    pub id: u64, // unique customer ID
}

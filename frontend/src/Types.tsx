export type InventoryItem = {
  product_id: number,
  quantity: number
  aisle: number
  shelf: number
  bin: number
}

export type ProductResponseItem = {
  id: number,
  name: string,
  is_fragile: boolean,
  weight: number,
  width: number,
  height: number,
  depth: number
}

export type CustomerItem = {
  id: number,
  first_name: string,
  second_name: string,
  email: string,
  is_new_customer: boolean
}

export const DefaultCustomer = {
  id: 0,
  first_name: "",
  second_name: "",
  email: "",
  is_new_customer: true
} as CustomerItem;
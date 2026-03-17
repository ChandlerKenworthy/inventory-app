// src/pages/InventoryPage.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type InventoryItem = {
  product_id: number,
  quantity: number
  aisle: number
  shelf: number
  bin: number
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const fetchInventory = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div>
        <Navbar />
        <h1>Inventory</h1>
        {inventory.map((item: InventoryItem) => (
            <div key={item.product_id}>
            {item.product_id} - {item.quantity}
            </div>
        ))}
    </div>
  );
}
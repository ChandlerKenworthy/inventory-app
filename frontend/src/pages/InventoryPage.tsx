// src/pages/InventoryPage.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Page.css";

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
    <div className="page-container">
    	<Navbar />
        <div className="content-container">
        	<h1>Inventory</h1>
			{inventory.map((item: InventoryItem) => (
				<div key={item.product_id}>
				{item.product_id} - {item.quantity}
				</div>
			))}
        </div>
    </div>
  );
}
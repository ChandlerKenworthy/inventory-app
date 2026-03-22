// src/pages/InventoryPage.tsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { InventoryItem } from "../Types";
import InventoryItemRow from "../components/InventoryItemRow";
import { GoFilter, GoSortAsc, GoSortDesc } from "react-icons/go";
import "../styles/Page.css";
import "../styles/pages/InventoryPage.css";

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
        	<h1 className="page-title">Inventory</h1>
            <div className="filters-wrapper">
              <div className="filter-icon"> Filter <GoFilter /></div>
              <div className="filter-icon"> Sort Asc <GoSortAsc /></div>
              <div className="filter-icon"> Sort Desc <GoSortDesc /></div>
            </div>
            <div className="inventory-list">
              <div className="inventory-table-header">
                <span>Product ID</span>
                <span>Quantity</span>
                <span>Aisle</span>
                <span>Shelf</span>
                <span>Bin</span>
                <span>Edit</span>
              </div>
              <div className="inventory-table-body">
                {inventory.map((item: InventoryItem) => (
                  <InventoryItemRow item={item} key={item.product_id} />
                ))}
              </div>
            </div> 
        </div>
    </div>
  );
}
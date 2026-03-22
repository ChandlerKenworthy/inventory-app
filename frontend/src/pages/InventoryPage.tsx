// src/pages/InventoryPage.tsx
import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import type { InventoryItem } from "../Types";
import InventoryItemRow from "../components/InventoryItemRow";
import { GoFilter, GoSortAsc, GoSortDesc } from "react-icons/go";
import "../styles/pages/Page.css";
import "../styles/pages/InventoryPage.css";

type SortField = "product_id" | "quantity";
type SortDirection = "asc" | "desc";

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);

  const fetchInventory = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Derive sorted list — only re-runs when inventory or sort changes
  const sortedInventory = useMemo(() => {
    if (!sort) return inventory;

    return [...inventory].sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];

      // product_id is a string, quantity is a number — handle both
      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [inventory, sort]);

  const handleSort = (field: SortField, direction: SortDirection) => {
    // Clicking the active sort again clears it back to default order
    if (sort?.field === field && sort?.direction === direction) {
      setSort(null);
    } else {
      setSort({ field, direction });
    }
  };

  const isActive = (field: SortField, direction: SortDirection) =>
    sort?.field === field && sort?.direction === direction;

  return (
    <div className="page-container">
    	<Navbar />
        <div className="content-container">
        	<h1 className="page-title">Inventory</h1>

            <div className="filters-wrapper">
              <div className="filter-icon">Filter <GoFilter /></div>

              <div className="sort-group">
                <span className="sort-label">Product ID</span>
                <button
                  className={`filter-icon${isActive("product_id", "asc") ? " filter-icon--active" : ""}`}
                  onClick={() => handleSort("product_id", "asc")}
                >
                  Asc <GoSortAsc />
                </button>
                <button
                  className={`filter-icon${isActive("product_id", "desc") ? " filter-icon--active" : ""}`}
                  onClick={() => handleSort("product_id", "desc")}
                >
                  Desc <GoSortDesc />
                </button>
              </div>

              <div className="sort-group">
                <span className="sort-label">Quantity</span>
                <button
                  className={`filter-icon${isActive("quantity", "asc") ? " filter-icon--active" : ""}`}
                  onClick={() => handleSort("quantity", "asc")}
                >
                  Asc <GoSortAsc />
                </button>
                <button
                  className={`filter-icon${isActive("quantity", "desc") ? " filter-icon--active" : ""}`}
                  onClick={() => handleSort("quantity", "desc")}
                >
                  Desc <GoSortDesc />
                </button>
              </div>
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
                {sortedInventory.map((item: InventoryItem) => (
                  <InventoryItemRow item={item} key={item.product_id} />
                ))}
              </div>
            </div> 
        </div>
    </div>
  );
}
import { useEffect, useState, useMemo } from "react";
import type { InventoryItem } from "../Types";
import InventoryItemRow from "../components/InventoryItemRow";
import { GoFilter, GoSortAsc, GoSortDesc, GoSearch, GoXCircle } from "react-icons/go";
import "../styles/pages/InventoryPage.css";
import Page from "../components/Page";
import type { UUIDTypes } from "uuid";
import { inventoryService } from "../services/inventoryService";

type SortField = "product_id" | "quantity";
type SortDirection = "asc" | "desc";

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

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
    if (!searchTerm && !sort) return inventory;

    // 1. Filter the list first
    let result = inventory;
    if(searchTerm) {
      result = inventory.filter((item) =>
        item.product_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sort the filtered result
    if (!sort) return result;

    return [...result].sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];

      // product_id is a string, quantity is a number — handle both
      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [inventory, sort, searchTerm]);

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

  const deleteItemHandler = async (id: UUIDTypes) => {
    const result = await inventoryService.delete(id);
    if(result.success) {
      fetchInventory(); // Refresh the list
    } else {
      alert("Failed to delete item: " + result.message);
    }
  }

  return (
    <Page title="Inventory">
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
        <div className="sort-group">
          <input
            className="filter-icon"
            type="text" 
            placeholder="Search by Product ID" 
            value={searchTerm || ""} 
            onChange={(e) => setSearchTerm(e.target.value || null)}
          />
          <button
            className="search-btn"
            onClick={() => setSearchTerm(null)}
          >
            {searchTerm ? <GoXCircle /> : <GoSearch />}
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
          <span>Delete</span>
        </div>
        <div className="inventory-table-body">
          {sortedInventory.map((item: InventoryItem) => (
            <InventoryItemRow 
              item={item} 
              key={item.product_id as string} 
              deleteItemHandler={deleteItemHandler}
              onUpdateSuccess={fetchInventory} />
          ))}
        </div>
      </div> 
    </Page>
  );
}
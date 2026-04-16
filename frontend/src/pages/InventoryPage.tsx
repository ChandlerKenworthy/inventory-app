import { useEffect, useState, useMemo } from "react";
import type { InventoryItem } from "../Types";
import { GoFilter, GoSortAsc, GoSortDesc, GoSearch, GoXCircle, GoTrash, GoPencil } from "react-icons/go";
import "../styles/pages/InventoryPage.css";
import Page from "../components/Page";
import type { UUIDTypes } from "uuid";
import { inventoryService } from "../services/inventoryService";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import { Link } from "react-router";

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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInventory = async () => {
    setLoading(true);
    toast.promise(
      inventoryService.get_inventory(),
      {
        loading: "Loading inventory...",
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          setInventory(result.data);
          return "Inventory loaded";
        },
        error: (err) => "Failed to load inventory: " + err.message,
      }
    );
    setLoading(false);
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
    toast.promise(
      inventoryService.delete(id),
      {
        loading: "Deleting item...",
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          fetchInventory(); // Refresh the list after deletion
          return "Item deleted";
        },
        error: (err) => "Failed to delete item: " + err.message,
      }
    );
  }

  const columns = [
    { 
      key: "product_id", 
      label: "Product ID", 
      render: (val: string) => (
          <Link className="product-id-link" to={`/products/${val}`}>
          {val.slice(0, 16)}...
          </Link>
      )
    },
    { key: "quantity", label: "Quantity", width: "25%", render: (_: any, record: InventoryItem) => record.location.quantity },
    { key: "aisle", label: "Aisle", width: "10%", render: (_: any, record: InventoryItem) => record.location.aisle },
    { key: "shelf", label: "Shelf", width: "10%", render: (_: any, record: InventoryItem) => record.location.shelf },
    { key: "bin", label: "Bin", width: "10%", render: (_: any, record: InventoryItem) => record.location.bin },
    {
      key: "actions",
      label: "Edit",
      width: "10%",
      render: (_: any, record: InventoryItem) => (
        <button
          type="button"
          onClick={() => toast.error("Edit functionality not implemented yet")}
          className="edit-inventory-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <GoPencil color="#1c87ba" size={18} />
        </button>
      )
    },
    { 
      key: "actions", 
      label: "Delete",
      width: "10%",
      render: (_: any, record: InventoryItem) => (
      <button 
          type="button"
          onClick={() => deleteItemHandler(record.product_id)}
          className="delete-inventory-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
          <GoTrash color="#ba1c1c" size={18} />
      </button>
      )
      }
  ];

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
        <DataTable
          columns={columns}
          data={sortedInventory}
          isLoading={loading}
          skeletonRows={5}
        />
      </div> 
    </Page>
  );
}
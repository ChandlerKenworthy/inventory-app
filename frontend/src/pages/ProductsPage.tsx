import { useState, useEffect, useMemo } from "react";
import type { ProductItem } from "../Types";
import "../styles/pages/ProductsPage.css"
import { GoPlusCircle, GoSearch, GoTrash, GoXCircle } from "react-icons/go";
import AddNewProductForm from "../components/forms/AddNewProductForm";
import Page from "../components/Page";
import { productService } from "../services/productService";
import type { UUIDTypes } from "uuid";
import { inventoryService } from "../services/inventoryService";
import toast from "react-hot-toast";
import DataTable from "../components/DataTable";
import { Link } from "react-router-dom";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [productIDSearchTerm, setProductIDSearchTerm] = useState<string | null>("");
    const [productNameSearchTerm, setProductNameSearchTerm] = useState<string | null>("");
    const [loading, setLoading] = useState<boolean>(false);

    const filteredProducts = useMemo(() => {
        const result = products.filter((product) => {
            const t1 = productIDSearchTerm ? product.id.toString().toLowerCase().includes(productIDSearchTerm.toLowerCase()) : true;
            const t2 = productNameSearchTerm ? product.name.toLowerCase().includes(productNameSearchTerm.toLowerCase()) : true;
            return t1 && t2;
        });
        return result;
    }, [products, productIDSearchTerm, productNameSearchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        toast.promise(
            productService.get_all(),
            {
                loading: "Loading products...",
                success: (result) => {
                    if (!result.success) throw new Error(result.message);
                    setProducts(result.data);
                    return "Products loaded";
                },
                error: (err) => "Failed to load products: " + err.message,
            }
        );
        setLoading(false);
    }

    const deleteProductHandler = async (id: UUIDTypes) => {
        toast.promise(
            productService.delete(id),
            {
                loading: 'Deleting product...',
                success: (result) => {
                    if (!result.success) throw new Error(result.message); // Catch logic errors
                    fetchProducts();
                    return "Product deleted successfully";
                },
                error: (err) => `Error: ${err.message || "Could not delete product"}`,
            }
        );
    }

    const addToInventoryHandler = async (id: UUIDTypes) => {
        toast.promise(
            inventoryService.add_product(id),
            {
                loading: 'Adding product to inventory...',
                success: (result) => {
                    if (!result.success) throw new Error(result.message); // Catch logic errors
                    return "Product added to inventory successfully";
                },
                error: (err) => `Error: ${err.message || "Could not add product to inventory"}`,
            }
        );
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const columns = [
        { 
            key: "id", 
            label: "Product ID", 
            render: (val: string) => (
                <Link className="product-id-link" to={`/products/${val}`}>
                {val.slice(0, 8)}...
                </Link>
            )
        },
        { key: "name", label: "Name", width: "25%" },
        { key: "weight", label: "Weight (kg)", width: "15%", render: (_: any, record: ProductItem) => record.dimensions.weight },
        { key: "dimensions", label: "Dim. (W/H/D) (cm)", width: "20%", render: (value) => `${value.width} x ${value.height} x ${value.depth}` },
        { key: "isFragile", label: "Fragile", width: "10%", render: (value) => value ? "Yes" : "No" },
        { key: "price", label: "Price (£)", width: "15%", render: (value: number) => `£${value.toFixed(2)}` },
        { 
            key: "actions", 
            label: "Add",
            width: "80px",
            render: (_: any, record: ProductItem) => (
            <button 
                type="button"
                onClick={() => addToInventoryHandler(record.id)}
                className="delete-customer-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <GoPlusCircle color="#148de3" size={18} />
            </button>
            )
        },
        { 
            key: "actions", 
            label: "Delete",
            width: "80px",
            render: (_: any, record: ProductItem) => (
            <button 
                type="button"
                onClick={() => deleteProductHandler(record.id)}
                className="delete-customer-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <GoTrash color="#ba1c1c" size={18} />
            </button>
            )
        }
    ];

    return (
        <Page title="Products Catalogue">
            <div className="products-page-content-wrapper">
                <AddNewProductForm onSuccess={() => fetchProducts()} />
                <div className="products-list">
                    <div className="search-fields">
                        <div className="sort-group">
                            <span>Product ID:</span>
                            <input
                            className="filter-icon"
                            type="text" 
                            placeholder="Search by Product ID" 
                            value={productIDSearchTerm || ""} 
                            onChange={(e) => setProductIDSearchTerm(e.target.value || null)}
                            />
                            <button
                                className="search-btn"
                                onClick={() => setProductIDSearchTerm(null)}
                            >
                                {productIDSearchTerm ? <GoXCircle /> : <GoSearch />}
                            </button>
                        </div>
                        <div className="sort-group">
                            <span>Product Name:</span>
                            <input
                            className="filter-icon"
                            type="text" 
                            placeholder="Search by Product Name" 
                            value={productNameSearchTerm || ""} 
                            onChange={(e) => setProductNameSearchTerm(e.target.value || null)}
                            />
                            <button
                                className="search-btn"
                                onClick={() => setProductNameSearchTerm(null)}
                            >
                                {productNameSearchTerm ? <GoXCircle /> : <GoSearch />}
                            </button>
                        </div>
                    </div>
                    <DataTable 
                        columns={columns}
                        data={filteredProducts}
                        isLoading={loading}
                        skeletonRows={8}
                    />
                </div>  
            </div>
        </Page>
    );
}
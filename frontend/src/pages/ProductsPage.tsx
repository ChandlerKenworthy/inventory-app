import { useState, useEffect, useMemo } from "react";
import type { ProductItem } from "../Types";
import "../styles/pages/ProductsPage.css"
import { GoSearch, GoXCircle } from "react-icons/go";
import AddNewProductForm from "../components/forms/AddNewProductForm";
import ProductItemRow from "../components/ProductItemRow";
import Page from "../components/Page";
import { productService } from "../services/productService";
import type { UUIDTypes } from "uuid";
import { inventoryService } from "../services/inventoryService";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [productIDSearchTerm, setProductIDSearchTerm] = useState<string | null>("");
    const [productNameSearchTerm, setProductNameSearchTerm] = useState<string | null>("");

    const filteredProducts = useMemo(() => {
        const result = products.filter((product) => {
            const t1 = productIDSearchTerm ? product.id.toString().toLowerCase().includes(productIDSearchTerm.toLowerCase()) : true;
            const t2 = productNameSearchTerm ? product.name.toLowerCase().includes(productNameSearchTerm.toLowerCase()) : true;
            return t1 && t2;
        });
        return result;
    }, [products, productIDSearchTerm, productNameSearchTerm]);

    const fetchProducts = async () => {
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
                    <div className="products-table-header">
                        <span>Product ID</span>
                        <span>Name</span>
                        <span>Weight (kg)</span>
                        <span>Dim. (W/H/D) (cm)</span>
                        <span>Is Fragile</span>
                        <span>Price (£)</span>
                        <span>Add</span>
                        <span>Delete</span>
                    </div>
                    <div className="products-table-body">
                    {filteredProducts.map((product: ProductItem) => (
                        <ProductItemRow 
                            key={product.id as string} 
                            product={product} 
                            deleteProductHandler={deleteProductHandler}
                            addToInventoryHandler={addToInventoryHandler}
                        />
                    ))}
                    </div>
                </div>  
            </div>
        </Page>
    );
}
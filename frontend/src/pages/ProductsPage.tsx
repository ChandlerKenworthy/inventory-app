import { useState, useEffect, useMemo } from "react";
import type { ProductResponseItem } from "../Types";
import "../styles/pages/ProductsPage.css"
import { GoSearch, GoXCircle } from "react-icons/go";
import AddNewProduct from "../components/forms/AddNewProduct";
import ProductItemRow from "../components/ProductItemRow";
import Page from "../components/Page";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponseItem[]>([]);
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
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
    }

    const deleteProductHandler = async (id: number) => {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });
        if(!response.ok) {
            console.error('Failed to delete product from catalogue');
        } else {
            console.log('Product removed successfully');
        }
        fetchProducts();
    }

    const addToInventoryHandler = async (id: number) => {
        // Add the item with this ID with default quantity of 1 and default location to the inventory of the warehouse
        const response = await fetch(`/api/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: id,
                quantity: 1,
                aisle: 0,
                shelf: 0,
                bin: 0
            }),
        });
        if(!response.ok) {
            console.error('Failed to add product to inventory');
        } else {
            console.log('Product added to inventory successfully');
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Page title="Products Catalogue">
            <div className="content-wrapper">
                <AddNewProduct onSuccess={() => fetchProducts()} />
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
                        <span>Add</span>
                        <span>Modify</span>
                        <span>Delete</span>
                    </div>
                    <div className="products-table-body">
                    {filteredProducts.map((product: ProductResponseItem) => (
                        <ProductItemRow 
                            key={product.id} 
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
import { useState, useEffect } from "react";
import type { ProductResponseItem } from "../Types";
import Navbar from "../components/Navbar";
import "../styles/pages/Page.css";
import "../styles/pages/ProductsPage.css"
import AddNewProduct from "../components/forms/AddNewProduct";
import ProductItemRow from "../components/ProductItemRow";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponseItem[]>([]);

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
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <h1 className="page-title">Product Catalogue</h1>
                <div className="content-wrapper">
                    <AddNewProduct onSuccess={() => fetchProducts()} />
                    <div className="products-list">
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
                        {products.map((product: ProductResponseItem) => (
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
            </div>
        </div>
    );
}
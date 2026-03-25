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

    const deleteProductHandler = () => console.log("Delete product");

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
                            />
                        ))}
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    );
}
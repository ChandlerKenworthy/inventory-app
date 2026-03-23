import { useState, useEffect } from "react";
import type { ProductResponseItem } from "../Types";
import { GoPlusCircle } from "react-icons/go";
import Navbar from "../components/Navbar";
import "../styles/pages/Page.css";
import "../styles/pages/ProductsPage.css"

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponseItem[]>([]);

    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <h1 className="page-title">Products</h1>
                <button className="add-product-btn">
                    <GoPlusCircle />
                    Add Product
                </button>


                <div className="products-wrapper">
                    {products.length === 0 && <p>No products found, consider checking the database connection via the status page.</p>}
                    {products.map((product: ProductResponseItem) => (
                        <div key={product.id} className="product-tile">
                            <h4>{product.name}</h4>
                            <span className="product-id">ID: {product.id}</span>
                            <span>{product.width} x {product.height} x {product.depth}</span>
                            <span>{product.weight} kg</span>
                            <span>{product.is_fragile ? "Fragile" : "Not Fragile"}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
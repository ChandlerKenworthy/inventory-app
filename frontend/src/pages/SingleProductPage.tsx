import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProductResponseItem } from "../Types";
import Page from "../components/Page";

export default function SingleProductPage() {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<ProductResponseItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        console.log("Attempting to fetch product with ID:", id);
        try {
            setLoading(true);
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) {
                throw new Error("Product not found");
            }
            const data = await res.json();
            setProduct(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    // Handle loading and error states
    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No product data found.</p>;

    return (
        <Page title={`Product: ${product.id}`}>            
            <div className="product-card">
                <h2>{product.name}</h2>
                <hr />
                <h3>Product Details</h3>
                <ul>
                    <li><strong>Weight:</strong> {product.weight} (kg)</li>
                    <li><strong>Width:</strong> {product.width} (cm)</li>
                    <li><strong>Height:</strong> {product.height} (cm)</li>
                    <li><strong>Depth:</strong> {product.depth} (cm)</li>
                </ul>
                <hr />
                <h3>Inventory Availability</h3>
                <ul>
                    <li><strong>Quantity:</strong>  ??</li>
                    <li><strong>Aisle:</strong> ??</li>
                    <li><strong>Shelf:</strong>  ??</li>
                    <li><strong>Location:</strong> ??</li>
                </ul>
            </div>
        </Page>
    );
}
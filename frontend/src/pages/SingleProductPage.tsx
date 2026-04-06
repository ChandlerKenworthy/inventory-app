import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProductItem } from "../Types";
import Page from "../components/Page";
import { productService } from "../services/productService";
import type { UUIDTypes } from "uuid";

export default function SingleProductPage() {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<ProductItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        setLoading(true);
        const result = await productService.get(id as UUIDTypes);
        if(result.success) {
            setProduct(result.data);
        } else {
            setError(result.message);
        }
        setLoading(false);
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
                    <li><strong>Price:</strong> £{product.price.toFixed(2)}</li>
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProductItem } from "../Types";
import Page from "../components/Page";
import { productService } from "../services/productService";
import type { UUIDTypes } from "uuid";
import Barcode from "react-barcode";
import "../styles/pages/SingleProductPage.css";

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
        <Page title={`${product.name}`}>            
            <div className="product-card">
                <div className="product-main-info">
                    <div className="product-dummy-img"></div>
                    <Barcode value={product.id} format="CODE128" width={1} height={100} displayValue={true} />
                </div>
                
                <div className="product-details-wrapper">
                    <h3>Product Details</h3>
                    <ul>
                        <li><strong>Weight:</strong> {product.weight} (kg)</li>
                        <li><strong>Width:</strong> {product.width} (cm)</li>
                        <li><strong>Height:</strong> {product.height} (cm)</li>
                        <li><strong>Depth:</strong> {product.depth} (cm)</li>
                        <li><strong>Price:</strong> £{product.price.toFixed(2)}</li>
                    </ul>
                </div>

                <div className="product-details-wrapper">
                    <h3>Inventory Availability</h3>
                    <ul>
                        <li><strong>Quantity:</strong>  ??</li>
                        <li><strong>Aisle:</strong> ??</li>
                        <li><strong>Shelf:</strong>  ??</li>
                        <li><strong>Location:</strong> ??</li>
                    </ul>
                </div>                

            </div>
        </Page>
    );
}
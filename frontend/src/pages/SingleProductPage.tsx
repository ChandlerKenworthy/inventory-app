import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProductItem } from "../Types";
import Page from "../components/Page";
import { productService } from "../services/productService";
import type { UUIDTypes } from "uuid";
import Barcode from "react-barcode";
import "../styles/pages/SingleProductPage.css";
import toast from "react-hot-toast";

export default function SingleProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductItem | null>(null);

    const fetchProduct = async () => {
        toast.promise(
            productService.get(id as UUIDTypes),
            {
                loading: "Fetching product details...",
                success: (result) => {
                    setProduct(result.data);
                    return `Product details loaded successfully!`;
                },
                error: (err) => `Error fetching product: ${err}`,
            }
        );
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

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
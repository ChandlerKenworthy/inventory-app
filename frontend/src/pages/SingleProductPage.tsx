import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProductItemWithLocationInfo } from "../Types";
import Page from "../components/Page";
import { productService } from "../services/productService";
import type { UUIDTypes } from "uuid";
import Barcode from "react-barcode";
import "../styles/pages/SingleProductPage.css";
import toast from "react-hot-toast";

export default function SingleProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductItemWithLocationInfo | null>(null);

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
                        <li><strong>Weight:</strong> {product.dimensions.weight} (kg)</li>
                        <li><strong>Width:</strong> {product.dimensions.width} (cm)</li>
                        <li><strong>Height:</strong> {product.dimensions.height} (cm)</li>
                        <li><strong>Depth:</strong> {product.dimensions.depth} (cm)</li>
                        <li><strong>Price:</strong> £{product.price.toFixed(2)}</li>
                    </ul>
                </div>

                <div className="product-details-wrapper">
                    <h3 className="title">Inventory Availability</h3>
                    {product.inventory && product.inventory.length > 0 ? (
                        <div className="inventory-table-container">
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>Aisle</th>
                                        <th>Shelf</th>
                                        <th>Bin</th>
                                        <th className="text-right">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.inventory.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.aisle}</td>
                                            <td>{item.shelf}</td>
                                            <td>{item.bin}</td>
                                            <td className="text-right font-mono">
                                                <span className={item.quantity > 0 ? "in-stock" : "out-of-stock"}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-inventory">No inventory data available for this product.</p>
                    )}
                </div>                
            </div>
        </Page>
    );
}
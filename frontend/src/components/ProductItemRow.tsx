import type { ProductItem } from "../Types"
import { GoPlusCircle, GoTrash } from "react-icons/go";
import "../styles/components/ProductItemRow.css";
import { Link } from "react-router-dom";
import type { UUIDTypes } from "uuid";

export default function ProductItemRow(
    { product, deleteProductHandler, addToInventoryHandler } : 
    { 
        product: ProductItem, 
        deleteProductHandler: (id: UUIDTypes) => void,
        addToInventoryHandler: (id: UUIDTypes) => void,
    }) {
    return (
        <div className="product-table-row">
            <Link 
                to={`/products/${product.id}`} 
                className="product-id-link"
            >
                {product.id}
            </Link>
            <span>{product.name}</span>
            <span>{product.dimensions.weight.toFixed(2)}</span>
            <span>{product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}</span>
            <span>{product.is_fragile ? "Yes" : "No"}</span>
            <span>£{product.price.toFixed(2)}</span>
            <button
                type="button"
                onClick={() => addToInventoryHandler(product.id)}
                className="modify-delete"
            >
                <GoPlusCircle />
            </button>
            <button 
                type="button"
                onClick={() => deleteProductHandler(product.id)}
                className="modify-delete">
                    <GoTrash color="#ba1c1c" />
            </button>
        </div>
    )
}
import type { ProductResponseItem } from "../Types"
import { GoPlusCircle, GoPencil, GoTrash } from "react-icons/go";
import "../styles/components/ProductItemRow.css";
import { Link } from "react-router-dom";

export default function ProductItemRow(
    { product, deleteProductHandler, addToInventoryHandler } : 
    { 
        product: ProductResponseItem, 
        deleteProductHandler: (id: number) => void,
        addToInventoryHandler: (id: number) => void,
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
            <span>{product.weight}</span>
            <span>{product.width} x {product.height} x {product.depth}</span>
            <span>{product.is_fragile ? "Yes" : "No"}</span>
            <button
                type="button"
                onClick={() => addToInventoryHandler(product.id)}
                className="modify-delete"
            >
                <GoPlusCircle />
            </button>
            <button
                type="button"
                onClick={() => console.log("Modify product")}
                className="modify-delete"
            >
                <GoPencil />
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
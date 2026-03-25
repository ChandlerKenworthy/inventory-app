import type { ProductResponseItem } from "../Types"
import { GoPlusCircle, GoPencil, GoTrash } from "react-icons/go";
import "../styles/components/ProductItemRow.css";

export default function ProductItemRow({ product, deleteProductHandler }: { product: ProductResponseItem, deleteProductHandler: (id: number) => void }) {
    return (
        <div className="product-table-row">
            <span>{product.id}</span>
            <span>{product.name}</span>
            <span>{product.weight}</span>
            <span>{product.width} x {product.height} x {product.depth}</span>
            <span>{product.is_fragile ? "Yes" : "No"}</span>
            <span><GoPlusCircle /></span>
            <span><GoPencil /></span>
            <button 
                type="button"
                onClick={() => deleteProductHandler(product.id)}
                className="modify-delete">
                    <GoTrash color="#ba1c1c" />
            </button>
        </div>
    )
}
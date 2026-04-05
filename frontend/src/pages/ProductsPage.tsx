import { useState, useEffect, useMemo } from "react";
import type { APIResponse, ProductItem } from "../Types";
import "../styles/pages/ProductsPage.css"
import { GoSearch, GoXCircle } from "react-icons/go";
import AddNewProductForm from "../components/forms/AddNewProductForm";
import ProductItemRow from "../components/ProductItemRow";
import Page from "../components/Page";
import FeedbackPopup from "../components/FeedbackPopup";
import { productService } from "../services/productService";
import { ClimbingBoxLoader } from "react-spinners";
import type { UUIDTypes } from "uuid";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [productIDSearchTerm, setProductIDSearchTerm] = useState<string | null>("");
    const [productNameSearchTerm, setProductNameSearchTerm] = useState<string | null>("");
    const [feedback, setFeedback] = useState<{ type: APIResponse, message: string }>({
        type: null,
        message: ''
    });
    const [loading, setLoading] = useState<boolean>(true);

    const filteredProducts = useMemo(() => {
        const result = products.filter((product) => {
            const t1 = productIDSearchTerm ? product.id.toString().toLowerCase().includes(productIDSearchTerm.toLowerCase()) : true;
            const t2 = productNameSearchTerm ? product.name.toLowerCase().includes(productNameSearchTerm.toLowerCase()) : true;
            return t1 && t2;
        });
        return result;
    }, [products, productIDSearchTerm, productNameSearchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    }

    const deleteProductHandler = async (id: UUIDTypes) => {
        setLoading(true);
        const result = await productService.delete(id);
        setFeedback({
            type: result.success ? 'success' : 'error',
            message: result.message
        });
        if (result.success) {
            fetchProducts(); // Refresh the list
        }
        setLoading(false);
    }

    const addToInventoryHandler = async (id: UUIDTypes) => {
        // No need to toggle loading state as this does not effect the product catalogue
        //const result = await productService.add(id);
        //setFeedback({
        //    type: result.success ? 'success' : 'error',
        //    message: result.message
        //});
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Page title="Products Catalogue">
            {feedback.type && <FeedbackPopup feedback={feedback} onClose={() => setFeedback({ type: null, message: '' })} />}
            <div className="products-page-content-wrapper">
                <AddNewProductForm onSuccess={() => fetchProducts()} setFeedback={setFeedback} />
                <div className="products-list">
                    <div className="search-fields">
                        <div className="sort-group">
                            <span>Product ID:</span>
                            <input
                            className="filter-icon"
                            type="text" 
                            placeholder="Search by Product ID" 
                            value={productIDSearchTerm || ""} 
                            onChange={(e) => setProductIDSearchTerm(e.target.value || null)}
                            />
                            <button
                                className="search-btn"
                                onClick={() => setProductIDSearchTerm(null)}
                            >
                                {productIDSearchTerm ? <GoXCircle /> : <GoSearch />}
                            </button>
                        </div>
                        <div className="sort-group">
                            <span>Product Name:</span>
                            <input
                            className="filter-icon"
                            type="text" 
                            placeholder="Search by Product Name" 
                            value={productNameSearchTerm || ""} 
                            onChange={(e) => setProductNameSearchTerm(e.target.value || null)}
                            />
                            <button
                                className="search-btn"
                                onClick={() => setProductNameSearchTerm(null)}
                            >
                                {productNameSearchTerm ? <GoXCircle /> : <GoSearch />}
                            </button>
                        </div>
                    </div>
                    <ClimbingBoxLoader color="#000" size={12} loading={loading} />
                    {!loading && (<>
                    <div className="products-table-header">
                        <span>Product ID</span>
                        <span>Name</span>
                        <span>Weight (kg)</span>
                        <span>Dim. (W/H/D) (cm)</span>
                        <span>Is Fragile</span>
                        <span>Price (£)</span>
                        <span>Add</span>
                        <span>Delete</span>
                    </div>
                    <div className="products-table-body">
                    {filteredProducts.map((product: ProductItem) => (
                        <ProductItemRow 
                            key={product.id as string} 
                            product={product} 
                            deleteProductHandler={deleteProductHandler}
                            addToInventoryHandler={addToInventoryHandler}
                        />
                    ))}
                    </div>
                    </>)}
                </div>  
            </div>
        </Page>
    );
}
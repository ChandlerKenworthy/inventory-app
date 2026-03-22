import Navbar from "../components/Navbar";
import "../styles/pages/Page.css";
import "../styles/pages/ProductsPage.css"

export default function ProductsPage() {
    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <h1 className="page-title">Products</h1>
                <div className="products-wrapper">
                    <div className="product-tile">
                        <h4>Product Name</h4>
                        <span className="product-id">ID: 1855734</span>
                        <span className="product-location">Loc: 19-12-3</span>
                        <div className="dummy-img"></div>
                    </div>
                
                    

                </div>
            </div>
        </div>
    );
}
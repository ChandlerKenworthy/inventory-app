import { Link } from "react-router-dom";
import { GoContainer, GoHome, GoPackage, GoPencil, GoPerson } from "react-icons/go";
import '../styles/Navbar.css';

export default function Navbar() {
    return (
        <div className="nav-wrapper">
            <nav className="nav-menu">
                <div className="nav-item">
                    <GoHome size={20} color="#181818" />
                    <Link to="/">Home</Link>
                </div>
                <div className="nav-item">
                    <GoContainer size={20} color="#181818" />
                    <Link to="/inventory">Inventory</Link>
                </div>
                <div className="nav-item">
                    <GoPencil size={20} color="#181818" />
                    <Link to="/update-inventory">Modify</Link>
                </div>
                <div className="nav-item">
                    <GoPerson size={20} color="#181818" />
                    <Link to="/customers">Customers</Link>
                </div>
                <div className="nav-item">
                    <GoPackage size={20} color="#181818" />
                    <Link to="/products">Products</Link>
                </div>
            </nav>
        </div>
    )
}
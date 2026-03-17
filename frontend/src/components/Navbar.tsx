import { Link } from "react-router-dom";
import { GoContainer, GoHome } from "react-icons/go";
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
            </nav>
        </div>
    )
}
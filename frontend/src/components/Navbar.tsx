import { NavLink } from "react-router-dom";
import { GoContainer, GoGitBranch, GoHome, GoPackage, GoPerson, GoPlusCircle, GoPulse, GoTag } from "react-icons/go";
import '../styles/components/Navbar.css';

const links = [
  { to: "/",                 label: "Home",      Icon: GoHome,      end: true },
  { to: "/inventory",        label: "Inventory", Icon: GoContainer, end: false },
  { to: "/customers",        label: "Customers", Icon: GoPerson,    end: false },
  { to: "/products",         label: "Products",  Icon: GoPackage,   end: false },
  { 
    to: "/orders",           
    label: "Orders",    
    Icon: GoTag,       
    end: true, // Only active on /orders
    children: [
      { to: "/orders/new", label: "New Order", Icon: GoPlusCircle }
    ]
  },
  { to: "/status",           label: "Status",    Icon: GoPulse,     end: false },
  { to: "/query",            label: "Query",     Icon: GoGitBranch, end: false },
];

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="nav-menu">
        {links.map((link) => (
          <div key={link.to} className="nav-group">
            {/* Parent Link */}
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}
            >
              <link.Icon size={20} />
              <span>{link.label}</span>
            </NavLink>

            {link.children && (
              <div className="nav-submenu">
                {link.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) => `nav-item nav-item--sub${isActive ? " nav-item--active" : ""}`}
                  >
                    <child.Icon size={16} />
                    <span>{child.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
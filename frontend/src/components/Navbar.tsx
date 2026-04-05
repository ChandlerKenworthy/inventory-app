import { NavLink } from "react-router-dom";
import { GoContainer, GoHome, GoPackage, GoPerson, GoPulse, GoTag } from "react-icons/go";
import '../styles/components/Navbar.css';

const links = [
  { to: "/",                 label: "Home",      Icon: GoHome      },
  { to: "/inventory",        label: "Inventory", Icon: GoContainer },
  { to: "/customers",        label: "Customers", Icon: GoPerson    },
  { to: "/products",         label: "Products",  Icon: GoPackage   },
  { to: "/orders",           label: "Orders",    Icon: GoTag       },
  { to: "/status",           label: "Status",    Icon: GoPulse     },
];

export default function Navbar() {
  return (
    <div className="nav-wrapper">
      <nav className="nav-menu">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}  // prevents "/" matching every route
            className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
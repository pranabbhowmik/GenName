import logo from "../../../public/namelogo.jpg";
import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-20" />
        </NavLink>

        {/* Hamburger Menu */}
      </div>
    </nav>
  );
}

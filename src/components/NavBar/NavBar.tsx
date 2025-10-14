import React from "react";
import { Cpu } from "lucide-react";
import "./NavBar.css";

interface NavBarProps {
  cartItemCount: number;
  onCartClick: () => void;
  onBrandClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ cartItemCount, onCartClick, onBrandClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={onBrandClick}>
          <Cpu className="navbar-brand-icon" />
          <div>
            <h1 className="navbar-title">TechCollector</h1>
            <p className="navbar-subtitle">Rare Technology Artifacts</p>
          </div>
        </div>
        <button onClick={onCartClick} className="cart-button">
          Cart
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;

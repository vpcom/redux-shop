import React from "react";
import {
  Package,
  Zap,
  Blocks,
  Brain,
  Cpu,
} from "lucide-react";
import "./ProductCard.css";
// import { Product } from "../../App";
import type { Product } from "../../Types/product";

const categoryIcons: Record<string, React.ComponentType<any>> = {
  NFC: Zap,
  Blockchain: Blocks,
  AI: Brain,
  Quantum: Cpu,
  IoT: Package,
};

const categoryColors: Record<string, string> = {
  NFC: "category-nfc",
  Blockchain: "category-blockchain",
  AI: "category-ai",
  Quantum: "category-quantum",
  IoT: "category-iot",
};

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct, onAddToCart }) => {
  const Icon = categoryIcons[product.category] || Package;
  const colorClass = categoryColors[product.category] || "category-default";

  return (
    <div className="product-card">
      <div className={`product-card-image ${colorClass}-light`}>
        <Icon className={`product-card-icon ${colorClass}-text`} />
        <div className={`product-category-badge ${colorClass}`}>{product.category}</div>
      </div>
      <div className="product-card-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price-row">
          <span className="product-price">${product.price}</span>
          <span className="product-stock">{product.stock} in stock</span>
        </div>
        <div className="product-buttons">
          <button
            onClick={() => onViewProduct(product)}
            className="product-button product-button-secondary"
          >
            View Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="product-button product-button-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

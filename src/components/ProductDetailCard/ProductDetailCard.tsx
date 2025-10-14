import React from "react";
import type { Product } from "../../Types/product";
import {
  Package,
  Cpu,
  Blocks,
  Brain,
  Zap,
} from "lucide-react";
import "./ProductDetailCard.css";

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

interface ProductDetailCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onBack: () => void;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({ product, onAddToCart, onBuyNow, onBack }) => {
  const Icon = categoryIcons[product.category ?? ""] || Package;
  const colorClass = categoryColors[product.category ?? ""] || "category-default";

  return (
    <div className="product-detail-container">
      <button onClick={onBack} className="back-button">
        ← Back to Products
      </button>
      <div className="product-detail-card">
        <div className={`product-detail-image ${colorClass}-light`}>
          <Icon className={`product-detail-icon ${colorClass}-text`} />
        </div>
        <div className="product-detail-content">
          <div className="product-detail-header">
            <div>
              <div className={`product-detail-category ${colorClass}`}>
                {product.category}
              </div>
              <h1 className="product-detail-title">{product.name}</h1>
              <p className="product-detail-description">{product.description}</p>
            </div>
            <div className="product-detail-price-info">
              <div className="product-detail-price">${product.price}</div>
              <div className="product-detail-stock">{product.stock} units available</div>
            </div>
          </div>
          <div className="product-detail-actions">
            <button
              onClick={() => onAddToCart(product)}
              className="product-detail-button product-detail-button-primary"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(product)}
              className="product-detail-button product-detail-button-secondary"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;

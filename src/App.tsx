import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Search,
  ChevronDown,
  X,
  Package,
  Cpu,
  Blocks,
  Brain,
  Zap,
} from "lucide-react";
import './App.css';
import Cart from "./components/Cart/Cart";
import { mockProducts } from "./mockProducts";
import ProductCard from "./components/ProductCard/ProductCard";
import ProductDetailCard from "./components/ProductDetailCard/ProductDetailCard";
import type { Product } from "./Types/product";

export interface CartItem extends Product {
  quantity: number;
}

// Icon mapping
const categoryIcons: Record<string, React.ComponentType<any>> = {
  NFC: Zap,
  Blockchain: Blocks,
  AI: Brain,
  Quantum: Cpu,
  IoT: Package,
};

// Color mapping for categories
const categoryColors: Record<string, string> = {
  NFC: "category-nfc",
  Blockchain: "category-blockchain",
  AI: "category-ai",
  Quantum: "category-quantum",
  IoT: "category-iot",
};

// Main App Component
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentView, setCurrentView] = useState("home"); // 'home', 'product', 'cart'
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  // Simulate API fetch
  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map((p) => p.category))];
    return cats;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView("product");
  };

  const checkout = () => {
    alert(
      `Order placed! Total: $${cartTotal.toFixed(
        2
      )}\nThank you for your purchase!`
    );
    clearCart();
    setShowCart(false);
  };
  
  // ...existing code...

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div
            className="navbar-brand"
            onClick={() => setCurrentView("home")}
          >
            <Cpu className="navbar-brand-icon" />
            <div>
              <h1 className="navbar-title">
                TechCollector
              </h1>
              <p className="navbar-subtitle">
                Rare Technology Artifacts
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="cart-button"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="cart-badge">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {currentView === "home" && (
          <>
            {/* Filters */}
            <div className="filters-container">
              <div className="filters-row">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filters-controls">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">No products found</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewProduct={viewProduct}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentView === "product" && selectedProduct && (
          <ProductDetailCard
            product={selectedProduct}
            onAddToCart={(product) => {
              addToCart(product);
              alert("Added to cart!");
            }}
            onBuyNow={(product) => {
              addToCart(product);
              setShowCart(true);
            }}
            onBack={() => setCurrentView("home")}
          />
        )}
      </div>

      {/* Cart Sidebar */}
      <Cart
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        showCart={showCart}
        onClose={() => setShowCart(false)}
        onRemoveFromCart={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={checkout}
        onClearCart={clearCart}
      />

      {/* Overlay */}
      {showCart && (
        <div
          className="overlay"
          onClick={() => setShowCart(false)}
        ></div>
      )}
    </div>
  );
}

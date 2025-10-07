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

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Mock API data
const mockProducts = [
  {
    id: 1,
    name: "NFC Mifare Classic Card",
    price: 12.99,
    category: "NFC",
    description: "Original 13.56MHz RFID card, perfect for collectors",
    image: "nfc",
    stock: 25,
  },
  {
    id: 2,
    name: "Bitcoin Genesis Block NFT",
    price: 299.99,
    category: "Blockchain",
    description:
      "Limited edition digital collectible commemorating Bitcoin's first block",
    image: "blockchain",
    stock: 10,
  },
  {
    id: 3,
    name: "GPT-3 Launch Token",
    price: 89.99,
    category: "AI",
    description: "Commemorative token from OpenAI's GPT-3 launch event",
    image: "ai",
    stock: 15,
  },
  {
    id: 4,
    name: "Ethereum Proof-of-Stake Pin",
    price: 45.5,
    category: "Blockchain",
    description: "Limited edition pin celebrating The Merge to PoS",
    image: "blockchain",
    stock: 30,
  },
  {
    id: 5,
    name: "NFC Ring Gen 1",
    price: 67.0,
    category: "NFC",
    description: "First generation NFC smart ring, rare collector's item",
    image: "nfc",
    stock: 8,
  },
  {
    id: 6,
    name: "Neural Network Chip Prototype",
    price: 199.99,
    category: "AI",
    description: "Early prototype of dedicated AI inference chip",
    image: "ai",
    stock: 5,
  },
  {
    id: 7,
    name: "Lightning Network Node Badge",
    price: 34.99,
    category: "Blockchain",
    description: "Official badge for early Lightning Network node operators",
    image: "blockchain",
    stock: 20,
  },
  {
    id: 8,
    name: "RFID Implant Kit v1.0",
    price: 149.99,
    category: "NFC",
    description: "Original RFID biohacking implant kit, sealed",
    image: "nfc",
    stock: 3,
  },
  {
    id: 9,
    name: "AlphaGo Victory Commemorative",
    price: 129.99,
    category: "AI",
    description:
      "Limited edition piece from DeepMind's historic AlphaGo victory",
    image: "ai",
    stock: 12,
  },
  {
    id: 10,
    name: "Smart Contract Ledger",
    price: 78.99,
    category: "Blockchain",
    description:
      "Physical ledger containing first 1000 smart contracts on Ethereum",
    image: "blockchain",
    stock: 18,
  },
  {
    id: 11,
    name: "Quantum Computing Demo Chip",
    price: 499.99,
    category: "Quantum",
    description: "Decommissioned quantum qubit demonstration chip",
    image: "quantum",
    stock: 2,
  },
  {
    id: 12,
    name: "IoT Sensor Array v1",
    price: 54.99,
    category: "IoT",
    description: "First generation IoT environmental sensor array",
    image: "iot",
    stock: 22,
  },
];

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

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const Icon = categoryIcons[product.category] || Package;
    const colorClass = categoryColors[product.category] || "category-default";

    return (
      <div className="product-card">
        <div className={`product-card-image ${colorClass}-light`}>
          <Icon className={`product-card-icon ${colorClass}-text`} />
          <div className={`product-category-badge ${colorClass}`}>
            {product.category}
          </div>
        </div>
        <div className="product-card-content">
          <h3 className="product-title">
            {product.name}
          </h3>
          <p className="product-description">
            {product.description}
          </p>
          <div className="product-price-row">
            <span className="product-price">
              ${product.price}
            </span>
            <span className="product-stock">
              {product.stock} in stock
            </span>
          </div>
          <div className="product-buttons">
            <button
              onClick={() => viewProduct(product)}
              className="product-button product-button-secondary"
            >
              View Details
            </button>
            <button
              onClick={() => addToCart(product)}
              className="product-button product-button-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Detail View
  const ProductDetail = () => {
    if (!selectedProduct) return null;
    const Icon = categoryIcons[selectedProduct.category] || Package;
    const colorClass = categoryColors[selectedProduct.category] || "category-default";

    return (
      <div className="product-detail-container">
        <button
          onClick={() => setCurrentView("home")}
          className="back-button"
        >
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
                  {selectedProduct.category}
                </div>
                <h1 className="product-detail-title">
                  {selectedProduct.name}
                </h1>
                <p className="product-detail-description">
                  {selectedProduct.description}
                </p>
              </div>
              <div className="product-detail-price-info">
                <div className="product-detail-price">
                  ${selectedProduct.price}
                </div>
                <div className="product-detail-stock">
                  {selectedProduct.stock} units available
                </div>
              </div>
            </div>
            <div className="product-detail-actions">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  alert("Added to cart!");
                }}
                className="product-detail-button product-detail-button-primary"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setShowCart(true);
                }}
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

  // Cart Sidebar
  const CartSidebar = () => (
    <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
      <div className="cart-header">
        <h2 className="cart-title">
          Cart ({cartItemCount})
        </h2>
        <button
          onClick={() => setShowCart(false)}
          className="cart-close-button"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart className="cart-empty-icon" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-header">
                  <h3 className="cart-item-name">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cart-item-remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="cart-item-controls">
                  <div className="cart-quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="cart-quantity-button"
                    >
                      -
                    </button>
                    <span className="cart-quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="cart-quantity-button"
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={checkout}
            className="cart-checkout-button"
          >
            Checkout
          </button>
          <button
            onClick={clearCart}
            className="cart-clear-button"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );

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
            <ShoppingCart className="cart-button-icon" />
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
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {currentView === "product" && <ProductDetail />}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />

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

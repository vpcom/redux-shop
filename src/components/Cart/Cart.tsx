import React from "react";
import { X, ShoppingCart } from "lucide-react";
import type { CartItem as CartItemType } from "../../App";
import CartItem from "../CartItem/CartItem";
import { useAppSelector } from "../../redux/hooks";
import { selectTotal } from "../../redux/slices/cartSlice";
import "./Cart.css";

interface CartProps {
  cart: CartItemType[];
  cartItemCount: number;
  cartTotal: number;
  showCart: boolean;
  onClose: () => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  cartItemCount,
  cartTotal,
  showCart,
  onClose,
  onRemoveFromCart,
  onUpdateQuantity,
  onCheckout,
  onClearCart,
}) => {
  const total = useAppSelector(selectTotal);

  return (
    <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
      <div className="cart-header">
        <h2 className="cart-title">Cart ({cartItemCount})</h2>
        <button onClick={onClose} className="cart-close-button">
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
              <CartItem
                key={item.id}
                item={item}
                onRemove={onRemoveFromCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="cart-total">Total: {total.toFixed(2)}</div>
      </div>
      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total (store):</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="cart-checkout-button">
            Checkout
          </button>
          <button onClick={onClearCart} className="cart-clear-button">
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

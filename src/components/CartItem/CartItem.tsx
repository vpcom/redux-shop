import React from "react";
import { X } from "lucide-react";
import type { CartItem as CartItemType } from "../../App";
import "./CartItem.css";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => (
  <div className="cart-item">
    <div className="cart-item-header">
      <h3 className="cart-item-name">{item.name}</h3>
      <button
        onClick={() => onRemove(item.id)}
        className="cart-item-remove"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="cart-item-controls">
      <div className="cart-quantity-controls">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="cart-quantity-button"
        >
          -
        </button>
        <span className="cart-quantity">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
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
);

export default CartItem;

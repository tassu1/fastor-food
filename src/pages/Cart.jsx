import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const nav = useNavigate();
  const { items, total, dispatch } = useCart();
  return (
    <div className="screen cart">
      <header className="cart-head">
        <button className="back" aria-label="Back" onClick={() => nav("/")}>
          <ArrowLeft size={20} />
        </button>
        <h1>Your cart</h1>
      </header>
      {items.length === 0 ? (
        <div className="empty big">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn">
            Browse food
          </Link>
        </div>
      ) : (
        <>
          {items.map((i) => (
            <div key={i.key} className="line">
              <div className="line-body">
                <b>{i.name}</b>
                <small className="muted">{i.option}</small>
                <b className="orange">₹{(i.unitPrice * i.qty).toFixed(2)}</b>
              </div>
              <div className="stepper">
                <button
                  aria-label={`Decrease ${i.name}`}
                  onClick={() =>
                    dispatch({ type: "qty", key: i.key, delta: -1 })
                  }
                >
                  <Minus size={14} />
                </button>
                <b>{i.qty}</b>
                <button
                  aria-label={`Increase ${i.name}`}
                  onClick={() =>
                    dispatch({ type: "qty", key: i.key, delta: 1 })
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                className="icon-plain"
                aria-label={`Remove ${i.name}`}
                onClick={() => dispatch({ type: "remove", key: i.key })}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div className="total row">
            <span>Total</span>
            <b>₹{total.toFixed(2)}</b>
          </div>
          <p className="muted note">
            Checkout isn't connected to a backend yet; this cart is stored on
            your device.
          </p>
          <button
            className="btn"
            onClick={() => {
              if (confirm("Clear the cart?")) dispatch({ type: "clear" });
            }}
          >
            Clear cart
          </button>
        </>
      )}
    </div>
  );
}

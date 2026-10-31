import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { getProduct, portions } from "../data/mockProducts.js";
import { useCart } from "../context/CartContext.jsx";
import FoodImage from "../components/FoodImage.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { dispatch } = useCart();
  const p = getProduct(id);
  const [qty, setQty] = useState(1);
  const [portion, setPortion] = useState(portions[3].id);
  const [added, setAdded] = useState(false);
  if (!p) return <Navigate to="/" replace />;
  const opt = portions.find((x) => x.id === portion);
  const unit = p.price + opt.extra;

  function add() {
    dispatch({
      type: "add",
      item: {
        key: `${p.id}:${opt.id}`,
        id: p.id,
        name: p.name,
        option: opt.label,
        unitPrice: unit,
        qty,
        emoji: p.emoji,
        image: p.image,
      },
    });
    setAdded(true);
    setTimeout(() => nav("/cart"), 700);
  }
  return (
    <div className="screen pd">
      <button className="back float" aria-label="Back" onClick={() => nav(-1)}>
        <ArrowLeft size={20} />
      </button>
      <FoodImage product={p} className="hero" />
      <div className="row mid">
        <b className="price">₹{unit.toFixed(2)}</b>
        <div className="stepper">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus size={14} />
          </button>
          <b aria-live="polite">{qty}</b>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <h1 className="pname">{p.name}</h1>
      <p className="muted pdesc">{p.description}</p>
      <fieldset className="portion">
        <legend>Personal portion</legend>
        {portions.map((o) => (
          <label key={o.id} className="opt">
            <span>{o.label}</span>
            <span className="dots" />
            <span>+₹{o.extra.toFixed(2)}</span>
            <input
              type="radio"
              name="portion"
              checked={portion === o.id}
              onChange={() => setPortion(o.id)}
            />
            <i />
          </label>
        ))}
      </fieldset>
      <button className="btn" onClick={add} disabled={added}>
        {added ? "Added ✓" : `Add to cart · ₹${(unit * qty).toFixed(2)}`}
      </button>
    </div>
  );
}

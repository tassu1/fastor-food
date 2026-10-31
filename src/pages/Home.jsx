import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, ShoppingBag, MapPin, Search } from "lucide-react";
import { products } from "../data/mockProducts.js";
import { fetchRestaurants } from "../services/restaurantService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import FoodImage from "../components/FoodImage.jsx";

export default function Home() {
  const { token, user, logout } = useAuth();
  const { count, dispatch } = useCart();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    loading: true,
    error: "",
    results: [],
    totalPages: 1,
  });

  useEffect(() => {
    let off = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    fetchRestaurants(token, page)
      .then(
        (r) =>
          !off &&
          setState({
            loading: false,
            error: "",
            results: r.results,
            totalPages: r.totalPages,
          }),
      )
      .catch(
        (e) =>
          !off && setState((s) => ({ ...s, loading: false, error: e.message })),
      );
    return () => {
      off = true;
    };
  }, [token, page]);

  const match = (p) => p.name.toLowerCase().includes(q.trim().toLowerCase());
  const best = useMemo(
    () => products.filter((p) => p.bestSeller && match(p)),
    [q],
  );
  const popular = useMemo(
    () => products.filter((p) => p.popular && match(p)),
    [q],
  );
  const quickAdd = (p) =>
    dispatch({
      type: "add",
      item: {
        key: `${p.id}:personal`,
        id: p.id,
        name: p.name,
        option: "Personal (4 Slides)",
        unitPrice: p.price,
        qty: 1,
        emoji: p.emoji,
        image: p.image,
      },
    });

  return (
    <div className="screen home">
      <header className="loc">
        <div>
          <small>Current Location</small>
          <strong>
            <MapPin size={13} /> Model Town, New Delhi
          </strong>
        </div>
        <div className="loc-actions">
          <Link
            to="/cart"
            className="icon-btn peach"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={18} />
            {count > 0 && <i className="badge">{count}</i>}
          </Link>
          <button
            className="icon-btn blue"
            aria-label="Log out"
            onClick={logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <label className="search">
        <Search size={16} />
        <input
          placeholder={`Search food${user && user.user_name ? `, ${user.user_name}` : ""}`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search food"
        />
      </label>

      <h2>Best Seller</h2>
      {best.length ? (
        <div className="best">
          {best.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="best-item">
              <FoodImage product={p} />
              <span>₹{p.price}.00</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty">No best sellers match "{q}".</p>
      )}

      <div className="banner" role="img" aria-label="30% off on our new dish">
        <div>
          <small>Experience our delicious new dish</small>
          <b>30% OFF</b>
        </div>
        <span aria-hidden>🍕</span>
      </div>

      <h2>Popular Items</h2>
      {popular.length ? (
        popular.map((p) => (
          <div key={p.id} className="pop">
            <Link to={`/product/${p.id}`}>
              <FoodImage product={p} className="pop-img" />
            </Link>
            <div className="pop-body">
              <div className="row">
                <b>{p.name}</b>
                <b className="orange">₹{p.price}.00</b>
              </div>
              <small className="muted">{p.description.slice(0, 38)}…</small>
              <div className="pills">
                <button className="pill solid" onClick={() => quickAdd(p)}>
                  Add
                </button>
                <Link className="pill soft" to={`/product/${p.id}`}>
                  Customize
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="empty">No popular items match "{q}".</p>
      )}

      <h2>Restaurants near you</h2>
      {state.loading && (
        <p className="empty" role="status">
          Loading restaurants…
        </p>
      )}
      {state.error && (
        <div className="empty">
          <p className="error">{state.error}</p>
          <button className="pill solid" onClick={() => setPage((p) => p)}>
            Reload
          </button>
        </div>
      )}
      {!state.loading && !state.error && state.results.length === 0 && (
        <p className="empty">No restaurants found.</p>
      )}
      {!state.loading &&
        state.results
          .filter(
            (r) =>
              r.restaurant_name &&
              r.restaurant_name.toLowerCase().includes(q.trim().toLowerCase()),
          )
          .map((r) => (
            <div key={r.restaurant_id} className="rest">
              {r.logo ? (
                <img
                  src={r.logo}
                  alt=""
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              ) : (
                <div className="rest-ph">🏪</div>
              )}
              <div>
                <b>{r.restaurant_name}</b>
                <small className="muted">{r.address_complete}</small>
              </div>
            </div>
          ))}
      {state.totalPages > 1 && (
        <div className="pager">
          <button
            className="pill soft"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {state.totalPages}
          </span>
          <button
            className="pill soft"
            disabled={page >= state.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

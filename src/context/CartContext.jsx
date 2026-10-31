import { createContext, useContext, useEffect, useReducer } from "react";
const Ctx = createContext(null);
const KEY = "fastor_cart";
const init = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

function reducer(items, a) {
  switch (a.type) {
    case "add": {
      const i = items.findIndex((x) => x.key === a.item.key);
      if (i < 0) return [...items, a.item];
      return items.map((x, j) =>
        j === i ? { ...x, qty: x.qty + a.item.qty } : x,
      );
    }
    case "qty":
      return items.map((x) =>
        x.key === a.key ? { ...x, qty: Math.max(1, x.qty + a.delta) } : x,
      );
    case "remove":
      return items.filter((x) => x.key !== a.key);
    case "clear":
      return [];
    default:
      return items;
  }
}
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, init);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items]);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.qty * x.unitPrice, 0);
  return (
    <Ctx.Provider value={{ items, count, total, dispatch }}>
      {children}
    </Ctx.Provider>
  );
}
export const useCart = () => useContext(Ctx);

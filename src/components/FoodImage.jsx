import { useState } from 'react';
export default function FoodImage({ product, className = '' }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div className={`food-fallback ${className}`} role="img" aria-label={product.name}>{product.emoji}</div>;
  return <img className={className} src={product.image} alt={product.name} loading="lazy" onError={() => setBad(true)} />;
}

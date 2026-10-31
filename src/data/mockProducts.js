// MOCK DATA: no product APIs exist in the Postman collection. Replace with a productService later.
const u = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;
export const portions = [
  { id: 'personal', label: 'Personal (4 Slides)', extra: 0 },
  { id: 'medium', label: 'Medium (8 Slides)', extra: 3 },
  { id: 'familiar', label: 'Familiar (10 Slides)', extra: 6 },
  { id: 'jumbo', label: 'Jumbo (12 Slides)', extra: 10 },
];
export const products = [
  { id: 'p1', name: 'Margherita Pizza', price: 14, emoji: '🍕', image: u('photo-1513104890138-7c749659a591'), bestSeller: true,
    description: 'Hand-stretched dough, tomato sauce, fresh mozzarella and basil, baked in a stone oven.' },
  { id: 'p2', name: 'Chicken Burger', price: 20, emoji: '🍔', image: u('photo-1568901346375-23c9450c58cd'), bestSeller: true, popular: true,
    description: 'Crispy chicken fillet, lettuce, tomato and house sauce in a toasted brioche bun.' },
  { id: 'p3', name: 'Salmon Sushi', price: 12, emoji: '🍣', image: u('photo-1579871494447-9811cf80d66c'), bestSeller: true,
    description: 'Eight pieces of fresh salmon nigiri and maki with soy, wasabi and pickled ginger.' },
  { id: 'p4', name: 'Veg Noodle Bowl', price: 11, emoji: '🍜', image: u('photo-1569718212165-3a8278d5f624'), bestSeller: true,
    description: 'Wok-tossed noodles with seasonal vegetables, garlic and a light soy glaze.' },
  { id: 'p5', name: 'Berry Cheesecake', price: 9, emoji: '🍰', image: u('photo-1533134242443-d4fd215305ad'), bestSeller: true,
    description: 'Creamy baked cheesecake on a biscuit base, topped with mixed berry compote.' },
  { id: 'p6', name: 'Strawberry Shake', price: 20, emoji: '🥤', image: u('photo-1572490122747-3968b75cc699'), popular: true,
    description: 'Thick shake blended with fresh strawberries and vanilla ice cream.' },
  { id: 'p7', name: 'Pepperoni Pizza', price: 16, emoji: '🍕', image: u('photo-1628840042765-356cda07504e'), popular: true,
    description: 'Loaded with spicy pepperoni, mozzarella and oregano on a thin crust.' },
];
export const getProduct = id => products.find(p => p.id === id);

// ─── Shared interfaces — imported by both services and all components ──────────

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;      // URL (from API) or emoji fallback
  discount: number;   // percentage 0-100
}

export interface CartItem {
  product: Product;
  quantity: number;
}

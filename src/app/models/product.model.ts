// ─── Shared interfaces ────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  discount: number;   // percentage 0-100
  category?: string;
  rating?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

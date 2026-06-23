import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  discount: number; // percentage e.g. 10 = 10%
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly products: Product[] = [
    { id: 1, name: 'Wireless Headphones', price: 99.99,  description: 'Premium noise-cancelling over-ear headphones with 30hr battery life.', image: '🎧', discount: 10 },
    { id: 2, name: 'Mechanical Keyboard', price: 129.99, description: 'Compact TKL keyboard with tactile switches and RGB backlight.', image: '⌨️',  discount: 0  },
    { id: 3, name: 'USB-C Hub',           price: 49.99,  description: '7-in-1 hub with HDMI 4K, 3× USB-A, SD card, and PD charging.', image: '🔌',  discount: 15 },
    { id: 4, name: 'Webcam HD 1080p',     price: 79.99,  description: 'Full HD webcam with built-in mic and auto light correction.', image: '📷',  discount: 5  },
    { id: 5, name: 'Desk Lamp LED',       price: 39.99,  description: 'Adjustable colour-temperature lamp with wireless phone charger base.', image: '💡',  discount: 20 },
    { id: 6, name: 'Mouse Pad XL',        price: 24.99,  description: 'Extra-large stitched-edge gaming & productivity desk mat.', image: '🖱️',  discount: 0  },
  ];

  // Reactive cart state using Angular signals
  private cartItems = signal<CartItem[]>([]);

  // Derived signals (computed)
  readonly cart          = this.cartItems.asReadonly();
  readonly cartCount     = computed(() => this.cartItems().reduce((s, i) => s + i.quantity, 0));
  readonly totalBefore   = computed(() => this.cartItems().reduce((s, i) => s + i.product.price * i.quantity, 0));
  readonly totalAfter    = computed(() =>
    this.cartItems().reduce((s, i) => {
      const discounted = i.product.price * (1 - i.product.discount / 100);
      return s + discounted * i.quantity;
    }, 0)
  );

  getProduct(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addToCart(product: Product): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) { this.removeFromCart(productId); return; }
    this.cartItems.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(i => i.product.id === productId);
  }
}

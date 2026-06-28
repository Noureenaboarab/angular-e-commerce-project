import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

// ─── ProductCartService ────────────────────────────────────────────────────────
// Owns ALL cart state. Components never mutate state directly — they call methods.
@Injectable({ providedIn: 'root' })
export class CartService {

  // ── Single source of truth ─────────────────────────────────────────────────
  private _items = signal<CartItem[]>([]);

  // ── Public read-only signals ───────────────────────────────────────────────
  readonly items = this._items.asReadonly();

  readonly totalCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  // Grand total BEFORE any discounts (original price × qty)
  readonly grandTotalBefore = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  // Grand total AFTER discounts applied
  readonly grandTotalAfter = computed(() =>
    this._items().reduce((sum, i) => {
      const unit = i.product.price * (1 - i.product.discount / 100);
      return sum + unit * i.quantity;
    }, 0)
  );

  readonly totalSavings = computed(() =>
    this.grandTotalBefore() - this.grandTotalAfter()
  );

  // ── Per-item helpers (called from template) ────────────────────────────────
  unitPriceAfter(p: Product): number {
    return p.price * (1 - p.discount / 100);
  }

  lineTotalBefore(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  lineTotalAfter(item: CartItem): number {
    return this.unitPriceAfter(item.product) * item.quantity;
  }

  // ── Mutations ──────────────────────────────────────────────────────────────
  addToCart(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  updateQuantity(productId: number, qty: number): void {
    if (qty <= 0) { this.remove(productId); return; }
    this._items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    );
  }

  remove(productId: number): void {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  isInCart(productId: number): boolean {
    return this._items().some(i => i.product.id === productId);
  }

  quantityOf(productId: number): number {
    return this._items().find(i => i.product.id === productId)?.quantity ?? 0;
  }
}

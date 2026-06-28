import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  // ── Private writable signals ───────────────────────────────────────────────
  private _products = signal<Product[]>([]);
  private _loading  = signal<boolean>(false);
  private _error    = signal<string | null>(null);

  // ── Public read-only signals (components bind to these) ───────────────────
  readonly products = this._products.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  // ── Computed: look up one product by id ───────────────────────────────────
  productById(id: number) {
    return computed(() => this._products().find(p => p.id === id));
  }

  // ── FakeStore API — swap for your real backend URL ────────────────────────
  private readonly API_URL = 'https://fakestoreapi.com/products';

  // ── Fetch all products ────────────────────────────────────────────────────
  loadProducts(): void {
    if (this._products().length > 0) return; // cache: only fetch once
    this._loading.set(true);
    this._error.set(null);

    this.http.get<any[]>(this.API_URL).subscribe({
      next: (raw) => {
        const mapped: Product[] = raw.map(item => ({
          id:          item.id,
          name:        item.title,
          price:       +item.price,
          description: item.description,
          image:       item.image,
          discount:    this.fakeDiscount(item.id),
        }));
        this._products.set(mapped);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load products. Please try again.');
        this._loading.set(false);
        console.error(err);
      }
    });
  }

  // Assigns a discount to some product ids for demo purposes
  private fakeDiscount(id: number): number {
    const map: Record<number, number> = {
      1: 10, 3: 15, 5: 20, 7: 5, 9: 25, 11: 10, 13: 30, 15: 8
    };
    return map[id] ?? 0;
  }
}

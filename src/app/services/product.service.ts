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

  // ── Public read-only signals ───────────────────────────────────────────────
  readonly products = this._products.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  // ── Computed: look up one product by id ───────────────────────────────────
  productById(id: number) {
    return computed(() => this._products().find(p => p.id === id));
  }

  // ── FakeStore API ─────────────────────────────────────────────────────────
  private readonly API_URL = 'https://fakestoreapi.com/products';

  // ── Fetch all products ────────────────────────────────────────────────────
  loadProducts(): void {
    if (this._products().length > 0) return;
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
          category:    item.category,
          rating:      item.rating?.rate ?? 0,
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

  // ── Fetch all as Observable (for resolver) ────────────────────────────────
  getAll() {
    return this.http.get<any[]>(this.API_URL);
  }

  // ── Fetch single as Observable (for resolver) ─────────────────────────────
  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // ── Add a product (posts to fake API) ─────────────────────────────────────
  addProduct(product: Omit<Product, 'id'>): void {
    const newId = this._products().length
      ? Math.max(...this._products().map(p => p.id)) + 1
      : 1;
    const newProduct: Product = { ...product, id: newId };
    this._products.update(list => [newProduct, ...list]);
  }

  // ── Update a product ──────────────────────────────────────────────────────
  updateProduct(id: number, changes: Partial<Product>): void {
    this._products.update(list =>
      list.map(p => p.id === id ? { ...p, ...changes } : p)
    );
  }

  // ── Delete a product ──────────────────────────────────────────────────────
  deleteProduct(id: number): void {
    this._products.update(list => list.filter(p => p.id !== id));
  }

  private fakeDiscount(id: number): number {
    const map: Record<number, number> = {
      1: 10, 3: 15, 5: 20, 7: 5, 9: 25, 11: 10, 13: 30, 15: 8
    };
    return map[id] ?? 0;
  }
}

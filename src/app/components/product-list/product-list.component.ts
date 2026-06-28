import { Component, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService }    from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { HighlightDirective }   from '../../directives/highlight.directive';
import { AppIfDirective }       from '../../directives/app-if.directive';
import { TruncatePipe }         from '../../pipes/custom.pipes';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent, RouterLink, NgClass, NgStyle,
    HighlightDirective, AppIfDirective, TruncatePipe,
  ],
  templateUrl: './product-list.component.html',
  styleUrl:    './product-list.component.css',
})
export class ProductListComponent {
  productService = inject(ProductService);
  cartService    = inject(CartService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  // Resolver data feeds into the list
  resolvedProducts = signal<Product[]>(
    this.route.snapshot.data['products'] ?? []
  );

  constructor() {
    const resolved: Product[] = this.route.snapshot.data['products'] ?? [];
    if (resolved.length > 0) {
      this.productService['_products'].set(resolved);
    }
  }

  // ── Category filter ────────────────────────────────────────────────────────
  selectedCategory = signal<string>('all');

  categories = computed(() => {
    const cats = this.resolvedProducts().map(p => p.category ?? '').filter(Boolean);
    return ['all', ...new Set(cats)];
  });

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'all'
      ? this.resolvedProducts()
      : this.resolvedProducts().filter(p => p.category === cat);
  });

  // ── Delete confirm modal state ─────────────────────────────────────────────
  confirmDeleteId   = signal<number | null>(null);
  confirmDeleteName = signal<string>('');

  requestDelete(product: Product): void {
    this.confirmDeleteId.set(product.id);
    this.confirmDeleteName.set(product.name);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
    this.confirmDeleteName.set('');
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (id === null) return;
    this.productService.deleteProduct(id);
    this.resolvedProducts.update(list => list.filter(p => p.id !== id));
    this.cancelDelete();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  onAdd(product: Product): void    { this.cartService.addToCart(product); }
  onView(id: number): void         { this.router.navigate(['/product', id]); }
  onEdit(id: number): void         { this.router.navigate(['/product', id, 'edit']); }
}

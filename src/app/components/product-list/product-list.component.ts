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

  // ── Resolver feeds data in via route data ──────────────────────────────────
  resolvedProducts = signal<Product[]>(
    this.route.snapshot.data['products'] ?? []
  );

  // Sync resolver data → service cache so detail/edit pages can reuse it
  constructor() {
    const resolved: Product[] = this.route.snapshot.data['products'] ?? [];
    if (resolved.length > 0) {
      // Warm the service cache from resolver result
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

  // ── Actions ────────────────────────────────────────────────────────────────
  onAdd(product: Product): void {
    this.cartService.addToCart(product);
  }

  onView(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  onEdit(productId: number): void {
    this.router.navigate(['/product', productId, 'edit']);
  }

  onDelete(productId: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.deleteProduct(productId);
    this.resolvedProducts.update(list => list.filter(p => p.id !== productId));
  }
}

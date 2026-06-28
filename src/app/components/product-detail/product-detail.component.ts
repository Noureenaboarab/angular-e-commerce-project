import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService }    from '../../services/cart.service';
import { Product }        from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl:    './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService            = inject(CartService);

  // ── Local signal holds the resolved product ────────────────────────────────
  product = signal<Product | undefined>(undefined);

  // ── Computed values derived from the product signal ────────────────────────
  hasDiscount     = computed(() => (this.product()?.discount ?? 0) > 0);
  discountedPrice = computed(() => {
    const p = this.product();
    return p ? p.price * (1 - p.discount / 100) : 0;
  });
  isImageUrl = computed(() => {
    const img = this.product()?.image ?? '';
    return img.startsWith('http') || img.startsWith('/');
  });
  inCart    = computed(() => this.cartService.isInCart(this.product()?.id ?? -1));
  cartCount = computed(() => this.cartService.quantityOf(this.product()?.id ?? -1));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Products may already be cached — try immediately, then poll
    const tryResolve = () => {
      const p = this.productService.productById(id)();
      if (p) { this.product.set(p); return true; }
      return false;
    };
    if (!tryResolve()) {
      this.productService.loadProducts();
      const t = setInterval(() => { if (tryResolve()) clearInterval(t); }, 100);
    }
  }

  addToCart(): void {
    const p = this.product();
    if (p) this.cartService.addToCart(p);
  }
}

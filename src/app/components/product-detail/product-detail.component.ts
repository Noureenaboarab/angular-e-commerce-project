import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product }     from '../../models/product.model';
import { HighlightDirective }  from '../../directives/highlight.directive';
import { AppIfDirective }      from '../../directives/app-if.directive';
import { DiscountedPricePipe, TruncatePipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink, NgClass, NgStyle,
    HighlightDirective, AppIfDirective,
    DiscountedPricePipe, TruncatePipe,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl:    './product-detail.component.css',
})
export class ProductDetailComponent {
  private route   = inject(ActivatedRoute);
  cartService     = inject(CartService);

  // ── Product arrives from the resolver via route data ──────────────────────
  product: Product = this.route.snapshot.data['product'];

  // ── Computed helpers ──────────────────────────────────────────────────────
  hasDiscount = computed(() => (this.product?.discount ?? 0) > 0);

  inCart    = computed(() => this.cartService.isInCart(this.product?.id));
  cartCount = computed(() => this.cartService.quantityOf(this.product?.id));

  // Star rating helpers
  get fullStars(): number[] {
    return Array(Math.floor(this.product?.rating ?? 0)).fill(0);
  }
  get hasHalfStar(): boolean {
    return (this.product?.rating ?? 0) % 1 >= 0.5;
  }

  addToCart(): void {
    if (this.product) this.cartService.addToCart(this.product);
  }
}

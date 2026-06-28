import { Component, input, output, computed } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl:    './product-card.component.css',
})
export class ProductCardComponent {

  // ── Signal inputs (Angular 17+ API) ───────────────────────────────────────
  product   = input.required<Product>();
  inCart    = input<boolean>(false);
  cartCount = input<number>(0);

  // ── Signal outputs ─────────────────────────────────────────────────────────
  addToCart   = output<Product>();
  viewDetails = output<number>();   // emits product id

  // ── Derived values ─────────────────────────────────────────────────────────
  hasDiscount     = computed(() => this.product().discount > 0);
  discountedPrice = computed(() =>
    this.product().price * (1 - this.product().discount / 100)
  );
  isImageUrl = computed(() =>
    this.product().image.startsWith('http') || this.product().image.startsWith('/')
  );
}

import { Component, input, output, computed } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { Product } from '../../models/product.model';
import { HighlightDirective }  from '../../directives/highlight.directive';
import { DiscountedPricePipe, TruncatePipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgClass, NgStyle, HighlightDirective, DiscountedPricePipe, TruncatePipe],
  templateUrl: './product-card.component.html',
  styleUrl:    './product-card.component.css',
})
export class ProductCardComponent {

  // ── Signal inputs ──────────────────────────────────────────────────────────
  product   = input.required<Product>();
  inCart    = input<boolean>(false);
  cartCount = input<number>(0);

  // ── Signal outputs ─────────────────────────────────────────────────────────
  addToCart   = output<Product>();
  viewDetails = output<number>();

  // ── Derived values ─────────────────────────────────────────────────────────
  hasDiscount = computed(() => this.product().discount > 0);
  isImageUrl  = computed(() =>
    this.product().image.startsWith('http') || this.product().image.startsWith('/')
  );
}

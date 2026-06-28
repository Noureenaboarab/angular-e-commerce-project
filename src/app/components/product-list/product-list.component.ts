import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService }    from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl:    './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  cartService    = inject(CartService);
  private router = inject(Router);

  // Expose service signals directly — template reads them reactively
  products = this.productService.products;
  loading  = this.productService.loading;
  error    = this.productService.error;

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  // Called when child ProductCard emits (addToCart) output signal
  onAdd(product: Product): void {
    this.cartService.addToCart(product);
  }

  // Called when child ProductCard emits (viewDetails) output signal
  onView(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
}

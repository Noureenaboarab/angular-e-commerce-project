import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  cart           = inject(CartService);
  product        = signal<Product | undefined>(undefined);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product.set(this.cart.getProduct(id));
  }

  get finalPrice(): number {
    const p = this.product();
    if (!p) return 0;
    return p.price * (1 - p.discount / 100);
  }
}

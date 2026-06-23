import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  cart = inject(CartService);

  itemTotal(price: number, discount: number, qty: number): number {
    return price * (1 - discount / 100) * qty;
  }

  itemTotalBefore(price: number, qty: number): number {
    return price * qty;
  }

  onQuantityChange(productId: number, value: string): void {
    const qty = parseInt(value, 10);
    if (!isNaN(qty)) this.cart.updateQuantity(productId, qty);
  }

  get savings(): number {
    return this.cart.totalBefore() - this.cart.totalAfter();
  }
}

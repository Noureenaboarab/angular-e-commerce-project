import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl:    './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  // Inject service — ALL state and logic lives there
  cartService = inject(CartService);

  // Expose signals as local aliases for cleaner template binding
  items            = this.cartService.items;
  totalCount       = this.cartService.totalCount;
  grandTotalBefore = this.cartService.grandTotalBefore;
  grandTotalAfter  = this.cartService.grandTotalAfter;
  totalSavings     = this.cartService.totalSavings;
}

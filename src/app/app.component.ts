import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CartService } from './services/cart.service';
import { AppIfDirective } from './directives/app-if.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AppIfDirective, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  // ── Resolver loading indicator ─────────────────────────────────────────────
  // True while the router is resolving (fetching data before activating route)
  isResolving = signal(false);

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isResolving.set(true);
      } else if (
        event instanceof NavigationEnd    ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isResolving.set(false);
      }
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HighlightDirective } from '../../directives/highlight.directive';
import { AppIfDirective }     from '../../directives/app-if.directive';
import { DiscountedPricePipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [
    FormsModule, RouterLink, NgClass, NgStyle,
    HighlightDirective, AppIfDirective, DiscountedPricePipe,
  ],
  templateUrl: './product-add-edit.component.html',
  styleUrl:    './product-add-edit.component.css',
})
export class ProductAddEditComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private productService = inject(ProductService);

  isEditMode   = false;
  productId: number | null = null;
  saving       = signal(false);
  saveSuccess  = signal(false);
  showPreview  = signal(false);

  // ── Form model ─────────────────────────────────────────────────────────────
  formData: Omit<Product, 'id'> = {
    name:        '',
    price:       0,
    description: '',
    image:       '',
    discount:    0,
    category:    '',
    rating:      0,
  };

  // ── Categories for the select ──────────────────────────────────────────────
  readonly categories = [
    "men's clothing",
    "women's clothing",
    "electronics",
    "jewelery",
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode  = true;
      this.productId   = Number(id);
      // Data already resolved — pull from route data
      const resolved: Product = this.route.snapshot.data['product'];
      if (resolved) {
        this.formData = {
          name:        resolved.name,
          price:       resolved.price,
          description: resolved.description,
          image:       resolved.image,
          discount:    resolved.discount,
          category:    resolved.category ?? '',
          rating:      resolved.rating   ?? 0,
        };
      }
    }
  }

  get previewPrice(): number {
    return +(this.formData.price * (1 - this.formData.discount / 100)).toFixed(2);
  }

  togglePreview(): void {
    this.showPreview.update(v => !v);
  }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.price) return;
    this.saving.set(true);

    // Simulate async save (real project would call HTTP)
    setTimeout(() => {
      if (this.isEditMode && this.productId !== null) {
        this.productService.updateProduct(this.productId, this.formData);
      } else {
        this.productService.addProduct(this.formData);
      }
      this.saving.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.router.navigate(['/products']), 1200);
    }, 700);
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}

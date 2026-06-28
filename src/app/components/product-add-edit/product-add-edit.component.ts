import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HighlightDirective }  from '../../directives/highlight.directive';
import { AppIfDirective }      from '../../directives/app-if.directive';
import { DiscountedPricePipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, NgClass, NgStyle,
    HighlightDirective, AppIfDirective, DiscountedPricePipe,
  ],
  templateUrl: './product-add-edit.component.html',
  styleUrl:    './product-add-edit.component.css',
})
export class ProductAddEditComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private productService = inject(ProductService);
  private fb             = inject(FormBuilder);

  isEditMode  = false;
  productId: number | null = null;
  saving      = signal(false);
  saveSuccess = signal(false);
  showPreview = signal(false);

  readonly categories = [
    "men's clothing",
    "women's clothing",
    "electronics",
    "jewelery",
  ];

  // ── Reactive form ──────────────────────────────────────────────────────────
  form: FormGroup = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(3)]],
    category:    [''],
    price:       [null, [Validators.required, Validators.min(0.01)]],
    discount:    [0,    [Validators.min(0), Validators.max(100)]],
    image:       ['',   [Validators.pattern('https?://.+')]],
    description: [''],
    rating:      [0],
  });

  // ── Convenience field getters ──────────────────────────────────────────────
  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  // ── Computed preview values from live form values ──────────────────────────
  get previewValues() { return this.form.getRawValue(); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId  = Number(id);
      const resolved: Product = this.route.snapshot.data['product'];
      if (resolved) {
        this.form.patchValue({
          name:        resolved.name,
          category:    resolved.category ?? '',
          price:       resolved.price,
          discount:    resolved.discount,
          image:       resolved.image,
          description: resolved.description,
          rating:      resolved.rating ?? 0,
        });
      }
    }
  }

  togglePreview(): void { this.showPreview.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const data = this.form.getRawValue() as Omit<Product, 'id'>;

    setTimeout(() => {
      if (this.isEditMode && this.productId !== null) {
        this.productService.updateProduct(this.productId, data);
      } else {
        this.productService.addProduct(data);
      }
      this.saving.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.router.navigate(['/products']), 1200);
    }, 700);
  }

  onCancel(): void { this.router.navigate(['/products']); }

  // Helper used in template to check touched + invalid
  isInvalid(field: string): boolean {
    const c = this.f[field];
    return !!(c.invalid && (c.dirty || c.touched));
  }
}

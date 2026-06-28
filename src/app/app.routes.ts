import { Routes } from '@angular/router';
import { ProductListComponent }    from './components/product-list/product-list.component';
import { ProductDetailComponent }  from './components/product-detail/product-detail.component';
import { ProductAddEditComponent } from './components/product-add-edit/product-add-edit.component';
import { ShoppingCartComponent }   from './components/shopping-cart/shopping-cart.component';
import { productListResolver }     from './resolvers/product-list.resolver';
import { productDetailResolver }   from './resolvers/product-detail.resolver';

export const routes: Routes = [
  // ── Product list — resolver fetches all products before activating ─────────
  {
    path: 'products',
    component: ProductListComponent,
    resolve: { products: productListResolver },
    title: 'Products',
  },

  // ── Add new product ───────────────────────────────────────────────────────
  {
    path: 'product/new',
    component: ProductAddEditComponent,
    title: 'Add Product',
  },

  // ── Product detail — resolver fetches single product before activating ─────
  {
    path: 'product/:id',
    component: ProductDetailComponent,
    resolve: { product: productDetailResolver },
    title: 'Product Details',
  },

  // ── Edit product — resolver prefetches the product to fill the form ────────
  {
    path: 'product/:id/edit',
    component: ProductAddEditComponent,
    resolve: { product: productDetailResolver },
    title: 'Edit Product',
  },

  // ── Cart ──────────────────────────────────────────────────────────────────
  {
    path: 'cart',
    component: ShoppingCartComponent,
    title: 'Shopping Cart',
  },

  // ── Default & wildcard ────────────────────────────────────────────────────
  { path: '',   redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];

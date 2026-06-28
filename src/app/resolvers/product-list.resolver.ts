import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

export const productListResolver: ResolveFn<Product[]> = () => {
  const svc = inject(ProductService);
  return svc.getAll().pipe(
    map((raw: any[]) =>
      raw.map(item => ({
        id:          item.id,
        name:        item.title,
        price:       +item.price,
        description: item.description,
        image:       item.image,
        discount:    ({ 1:10, 3:15, 5:20, 7:5, 9:25, 11:10, 13:30, 15:8 } as Record<number,number>)[item.id] ?? 0,
        category:    item.category,
        rating:      item.rating?.rate ?? 0,
      }))
    )
  );
};

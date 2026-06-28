import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

export const productDetailResolver: ResolveFn<Product> = (route) => {
  const svc    = inject(ProductService);
  const router = inject(Router);
  const id     = Number(route.paramMap.get('id'));

  return svc.getById(id).pipe(
    map((item: any) => ({
      id:          item.id,
      name:        item.title,
      price:       +item.price,
      description: item.description,
      image:       item.image,
      discount:    ({ 1:10, 3:15, 5:20, 7:5, 9:25, 11:10, 13:30, 15:8 } as Record<number,number>)[item.id] ?? 0,
      category:    item.category,
      rating:      item.rating?.rate ?? 0,
    })),
    catchError(() => {
      router.navigate(['/']);
      return EMPTY;
    })
  );
};

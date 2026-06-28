import { Pipe, PipeTransform } from '@angular/core';

/**
 * discountedPrice pipe
 * {{ price | discountedPrice: discount }}
 * Returns the final price after applying a percentage discount.
 */
@Pipe({ name: 'discountedPrice', standalone: true })
export class DiscountedPricePipe implements PipeTransform {
  transform(price: number, discount: number = 0): number {
    if (!discount || discount <= 0) return price;
    return parseFloat((price - (price * discount) / 100).toFixed(2));
  }
}

/**
 * truncate pipe
 * {{ text | truncate: 80 }}
 * Cuts a string to `limit` characters and appends '…'.
 */
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 80, trail: string = '…'): string {
    if (!value) return '';
    return value.length > limit ? value.slice(0, limit) + trail : value;
  }
}

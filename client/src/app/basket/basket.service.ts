import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { map} from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private privVar: IBasket|null = null;
  private basketSourse = new BehaviorSubject<IBasket|null>(this.privVar);
  basket$ = this.basketSourse.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals|null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id : string){
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSourse.next(basket);
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket){
    this.http.post<IBasket>(this.baseUrl + 'basket',basket).subscribe((response: IBasket) => {
      this.basketSourse.next(response);
      this.calculateTotals();
    });
  }

  getCurrentBasketValue(){
    return this.basketSourse.value;
  }

  addItemToBasket(item: IProduct, quantity=1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item,quantity);
    const basket = this.getCurrentBasketValue()??this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const founditemIndex = basket?.items.findIndex(x => x.id===item.id);
    basket!.items[founditemIndex!].quantity++;
    this.setBasket(basket!);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const founditemIndex = basket?.items.findIndex(x => x.id===item.id);
     if(basket?.items[founditemIndex!].quantity! > 1) {
      basket!.items[founditemIndex!].quantity--;
      this.setBasket(basket!);
     } else {
      this.removeItemFromBasket(item);
     }
    
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket?.items.some(x => x.id === item.id)){
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSourse.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
      
    });
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket?.items.reduce((a,b) => (b.price * b.quantity) + a,0);
    const total = shipping + subtotal!;
    this.basketTotalSource.next({shipping, subtotal, total});

  }

  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }
  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id',basket.id);
    return basket;
    
  }
  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }
}

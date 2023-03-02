import { v4 as uuid } from 'uuid'

export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export interface IBasket {
    id: string;
    items: IBasketItem[];
}

export class Basket implements IBasket {
    id = uuid();
    items: IBasketItem[] = [];

}

export interface IBasketTotals {
    shipping: number,
    subtotal: number|undefined,
    total: number
}
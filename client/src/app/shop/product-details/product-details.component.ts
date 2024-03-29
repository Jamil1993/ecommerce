import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct | undefined;
  quantity: number = 1;

  constructor(private shopService: ShopService, 
              private activeRoute: ActivatedRoute,
              private bcService: BreadcrumbService,
              private basketService: BasketService) { 
      this.bcService.set('@productDetails', ' ');
     }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product!,this.quantity);
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }  

  loadProduct()
  {
    this.shopService.getProduct(+this.activeRoute.snapshot.paramMap.get('id')!).subscribe(response =>
      {
        this.product = response;
        this.bcService.set('@productDetails', this.product.name);
      }, error =>{
        console.log(error);
      })
  }

}

import {Injectable} from "@angular/core";
import {OrderDetailsService} from "./OrderDetailsService";


@Injectable()
export class PaginationService{
  totalPages: number = 1;
  pageNo: number = 1;
  elementsOnPage: number = 16;

  constructor(private odServ: OrderDetailsService) {
  }

  //potential change
  onChangeQuantity(value:number){
    this.elementsOnPage = value;
    this.totalPages = Math.ceil(this.odServ.dishes.length / this.elementsOnPage);
    //console.log(this.totalPages);
  }

  adaptTotalPages(lengthAfterFilters: number){
    this.totalPages = Math.ceil(lengthAfterFilters / this.elementsOnPage);
    //console.log(this.totalPages);
  }

}

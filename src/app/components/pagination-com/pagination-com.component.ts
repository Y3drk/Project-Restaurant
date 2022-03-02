import { Component, OnInit } from '@angular/core';
import {PaginationService} from "../../services/PaginationService";

@Component({
  selector: 'app-pagination-com',
  templateUrl: './pagination-com.component.html',
  styleUrls: ['./pagination-com.component.css']
})
export class PaginationComComponent implements OnInit {

  constructor(public pagServ: PaginationService) { }

  ngOnInit(): void {
  }
  onPageChange(pageNo:number){
  }

  onQuantityChange(value: number){
    this.pagServ.onChangeQuantity(value);
  }
}

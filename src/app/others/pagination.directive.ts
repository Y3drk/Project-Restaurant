import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {PaginationService} from "../services/PaginationService";

@Directive({
  selector: '[appPagination]',
  exportAs: 'pagination'
})
export class PaginationDirective implements AfterViewInit{
  @Input() totalPages:number = 1;
  pageNo:number = 1;
  @Output() onChangeEventEmitter = new EventEmitter();

  constructor(private renderer: Renderer2, private el : ElementRef, private pagService: PaginationService) {
    this.pagService.totalPages = this.totalPages;
  }

  ngAfterViewInit() {
    this.onFirst();
  }


  onNext(){
    this.setPage(Math.min(this.totalPages, this.pageNo+1));
  }

  onPrevious(){
    this.setPage(Math.max(1,this.pageNo - 1));
  }

  onFirst(){
    this.setPage(1);
  }

  onLast(){
    this.setPage(this.totalPages);
  }

  setPage(paramPageNo){
    this.pageNo = paramPageNo;
    this.renderer.setProperty(this.el.nativeElement,"value",this.pageNo)
    this.onChangeEventEmitter.emit(paramPageNo);
    this.pagService.pageNo = paramPageNo;
  }

  getNoOfPages(){
    return this.pagService.totalPages;
  }

  checkIfLast(){
    return this.pageNo === this.pagService.totalPages;
  }

  checkIfFirst(){
    return this.pagService.pageNo === 1;
  }
}

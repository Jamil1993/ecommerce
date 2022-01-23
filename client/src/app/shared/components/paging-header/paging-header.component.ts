import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit {
@Input() pageNumber: number | undefined;
@Input() pageSize: number | undefined;
@Input() totalCount: number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

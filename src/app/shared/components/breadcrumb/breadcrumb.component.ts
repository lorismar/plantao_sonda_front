import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() paginaAnterior: string = '';
  @Input() paginaAtual: string = '';
  @Input() proximaPagina: string = '';
  constructor() {}
  ngOnInit(): void {}
}

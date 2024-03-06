import { Component, OnInit } from '@angular/core';
import {
  faCircleHalfStroke,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotate,
  faUniversalAccess,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-acessibilidade',
  templateUrl: './acessibilidade.component.html',
  styleUrls: ['./acessibilidade.component.scss'],
})
export class AcessibilidadeComponent implements OnInit {
  constructor() {}
  font_size = 16;
  ngOnInit(): void {}

  setFontSize(idd: string) {
    //calc font size
    if (idd === 'a+') {
      this.font_size += 1;
    } else if (idd === 'a-') {
      this.font_size -= 1;
    } else {
      this.font_size = 16;
    }

    //set font size
    let htmlRoot: HTMLElement = <HTMLElement>(
      document.getElementsByTagName('html')[0]
    );
    if (htmlRoot != null) {
      htmlRoot.style.fontSize = `${this.font_size}px`;
    }
  }

  contraste() {
    document.querySelector('body')?.classList.toggle('hight-contrast');
  }

  protected readonly faRotate = faRotate;
  protected readonly faMagnifyingGlassMinus = faMagnifyingGlassMinus;
  protected readonly faMagnifyingGlassPlus = faMagnifyingGlassPlus;
  protected readonly faCircleHalfStroke = faCircleHalfStroke;
  protected readonly faUniversalAccess = faUniversalAccess;
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { HomeLayoutComponent } from "../layout/home-layout/home-layout.component";
import { AuthPopupComponent } from "../../../shared/ui/auth-popup/auth-popup.component";
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectActiveAuthForm, selectShownAuthPopup } from '../state/home.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [HomeLayoutComponent, AuthPopupComponent , AsyncPipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  shownAuthPopup$ !: Observable<boolean>;
  private store = inject(Store);
  

  ngOnInit(): void {
    this.shownAuthPopup$ = this.store.pipe(select(selectShownAuthPopup));
  }
}

import { Component, OnInit } from '@angular/core';
import { RootAppStore } from './types';
import { StoreService } from './store/store.service';
import { createStoreValue } from './store/value';
import { appRootEffect } from './store/effects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular RxStore example counter';
  store: RootAppStore;
  n: number;

  a = Array;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.n = 1;
    this.store = createStoreValue();
    this.storeService.init(this.store, appRootEffect);
  }

  addCounter(): void {
    this.n++;
  }

  removeCounter(): void {
    this.n--;
  }

}

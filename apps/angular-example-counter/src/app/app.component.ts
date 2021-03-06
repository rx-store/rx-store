import { Component, OnInit } from '@angular/core';
import { AppStoreValue } from './types';
import { StoreManagerService } from './store/store-manager.service';
import { createStoreValue } from './store/value';
import { appRootEffect } from './store/effects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Angular RxStore example counter';
  store!: AppStoreValue;
  n!: number;

  a = Array;

  constructor(private storeService: StoreManagerService) {}

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

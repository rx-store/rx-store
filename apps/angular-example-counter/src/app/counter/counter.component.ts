import { Component, Input } from '@angular/core';
import { RootAppStore } from '../types';
import { StoreManagerService } from '../store/store-manager.service';
import { scanSum } from '../store/operators/scan-sum';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  localCount$ = this.storeManager.store.counterChange$.pipe(scanSum());
  constructor(public readonly storeManager: StoreManagerService) {
  }

}

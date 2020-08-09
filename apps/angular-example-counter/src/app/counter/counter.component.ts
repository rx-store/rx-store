import { Component, Input } from '@angular/core';
import { RootAppStore } from '../types';
import { StoreService } from '../store/store.service';
import { scanSum } from '../store/operators/scan-sum';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  localCount$ = this.store.store.counterChange$.pipe(scanSum());
  constructor(public readonly store: StoreService) {
  }

}

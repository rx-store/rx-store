import { Component } from '@angular/core';
import { CounterStoreService } from './counter-store.service';
import { RootRxStore } from '../root-rx-store';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  viewProviders: [CounterStoreService],
})
export class CounterComponent {
  constructor(
    public readonly rootStore: RootRxStore,
    public readonly counterStore: CounterStoreService
  ) {}
}

import { Component, Input } from '@angular/core';
import { RootAppStore } from '../types';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {

  @Input() store: RootAppStore;

}

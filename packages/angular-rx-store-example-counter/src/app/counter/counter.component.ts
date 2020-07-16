import { Component, Input } from '@angular/core';
import { RootAppStore } from '../types';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {

  @Input() store: RootAppStore;

}

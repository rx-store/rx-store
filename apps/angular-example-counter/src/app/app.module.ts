import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';
import { RxStoreModule } from '@rx-store/angular-rx-store';
import { RootRxStore } from './root-rx-store';
import { CommonModule } from '@angular/common';
import { RootRxEffects } from './root-rx-effects';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RxStoreModule.forRoot({
      rootStoreClass: RootRxStore,
      rootEffectsClass: RootRxEffects,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

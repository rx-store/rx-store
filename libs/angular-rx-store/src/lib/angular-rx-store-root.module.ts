import { Inject, NgModule, Optional, Type } from '@angular/core';
import { ROOT_RX_EFFECTS, ROOT_RX_STORE } from './tokens';

@NgModule({})
export class RxStoreRootModule {
  constructor(
    @Inject(ROOT_RX_STORE) private rootStore: Type<unknown>,
    @Optional() @Inject(ROOT_RX_EFFECTS) private rootEffects: Type<unknown>
  ) {
    console.log('the root store is: ', this.rootStore);
    console.log('the root effect is: ', this.rootEffects);
  }
}

import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { RxStoreRootModule } from './angular-rx-store-root.module';
import { ROOT_RX_EFFECTS, ROOT_RX_STORE } from './tokens';

export interface RxStoreConfig {
  rootStoreClass: Type<unknown>;
  rootEffectsClass?: Type<unknown>;
}

@NgModule({})
export class RxStoreModule {
  static forRoot(config: RxStoreConfig): ModuleWithProviders {
    return {
      ngModule: RxStoreRootModule,
      providers: [
        {
          provide: ROOT_RX_STORE,
          useClass: config.rootStoreClass,
        },
        config.rootEffectsClass
          ? {
              provide: ROOT_RX_EFFECTS,
              useClass: config.rootEffectsClass,
            }
          : [],
      ],
    };
  }
}

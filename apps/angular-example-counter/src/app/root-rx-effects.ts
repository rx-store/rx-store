import { Injectable, OnDestroy } from '@angular/core';
import { createEffect} from '@rx-store/angular-rx-store';
import { RootRxStore } from './root-rx-store';
import { filter, finalize, scan, startWith, tap } from 'rxjs/operators';
import { createEffectManager } from '../../../../libs/angular-rx-store/src/lib/effect-manager';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RootRxEffects implements OnDestroy {
  destroyed$ = new Subject<void>();
  constructor(private readonly rootStore: RootRxStore) {
    const complete$ = new Subject<any>();

    const effectManager1 = createEffectManager(this.destroyed$);

    effectManager1.createEffect(
      () =>
        this.rootStore.counterChange$.pipe(
          scan((acc, val) => acc + val, 0),
          startWith(0),
        ),
      () => this.rootStore.count$
    )

    effectManager1.createEffect(
      () =>
        this.rootStore.count$.pipe(
          filter(r => r === 5)
        ),
      () => complete$
    )


    const effectManager2 = createEffectManager(complete$);

    effectManager2.createEffect(
      () =>
        this.rootStore.counterChange$.pipe(
          scan((acc, val) => acc + val + 2, 0),
          startWith(0),
          finalize(() => console.log('complete!'))
        ),
      () => this.rootStore.count$
    )


  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

}

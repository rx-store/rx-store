import { Subject } from 'rxjs';

/**
 * In Rx Store you can have one or many stores.
 *
 * Each store contains a value object, where you define
 * various subjects [streams that act as event busses]
 */
export interface RxStoreValue {
  [k: string]: Subject<any>;
}

/** A function that will unsubscribe a effect */
export type RxEffectCleanupFn = () => void;

/** A function that will subscribe to an effect */
export type RxStoreEffect<T> = (storeValue: T) => RxEffectCleanupFn;

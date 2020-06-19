import React, { createContext, useEffect } from 'react';
import {Observable, Subject} from 'rxjs'
import {filter, delay} from 'rxjs/operators'
import ReactDOM from 'react-dom';
import App from './App';

interface RxStoreSubjects {
  count: Subject<number>
}

interface RxStoreObservables {
  evenCount: Observable<number>;
  oddCount: Observable<number>;
}

type RxStoreContextValue = RxStoreSubjects & RxStoreObservables

const rxStoreSubjects: RxStoreSubjects = {
  count: new Subject()
}

const rxStoreObservables: RxStoreObservables = {
  evenCount: rxStoreSubjects.count.asObservable().pipe(filter(x => x % 2 === 0)),
  oddCount: rxStoreSubjects.count.asObservable().pipe(filter(x => x % 2 !== 0))
}

const rxStoreContextValue:RxStoreContextValue={
  ...rxStoreObservables,...rxStoreSubjects
}

export const rxStoreContext = createContext<RxStoreContextValue>(rxStoreContextValue)

const rootEffect = (value:RxStoreContextValue) => {
  const subscription = value.count.pipe(
    delay(1000)
  ).subscribe(count => console.log({count}))
  return () => subscription.unsubscribe()
}

const RxStoreProvider: React.FC<{value: RxStoreContextValue}> = ({children, value}) => {
  useEffect(rootEffect(value), [value])

  return <rxStoreContext.Provider value={value}>{children}</rxStoreContext.Provider>
}

ReactDOM.render(
  <React.StrictMode>
    <RxStoreProvider value={rxStoreContextValue}>
      <App />
    </RxStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


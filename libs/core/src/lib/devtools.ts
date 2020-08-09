import { Subject, ReplaySubject } from 'rxjs';

declare global {
  interface Window {
    __rxStoreLinks: Subject<{
      from: { type: 'subject' | 'effect'; name: string };
      to: { type: 'subject' | 'effect'; name: string };
    }>;
    __rxStoreEffects: Subject<{
      name: string;
      event: 'spawn' | 'teardown';
    }>;
    __rxStoreSubjects: Subject<{
      name: string;
    }>;
    __rxStoreValues: Subject<{
      from: { type: 'subject' | 'effect'; name: string };
      to: { type: 'subject' | 'effect'; name: string };
      value: any;
    }>;
  }
}

export function ensureDevtools() {
  if (!window.__rxStoreValues) {
    window.__rxStoreValues = new Subject<any>();
  }
  if (!window.__rxStoreLinks) {
    window.__rxStoreLinks = new ReplaySubject<any>();
  }
  if (!window.__rxStoreEffects) {
    window.__rxStoreEffects = new ReplaySubject<any>();
  }
  if (!window.__rxStoreSubjects) {
    window.__rxStoreSubjects = new ReplaySubject<any>();
  }
}

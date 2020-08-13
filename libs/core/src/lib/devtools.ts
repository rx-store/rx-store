import { Subject, ReplaySubject } from 'rxjs';

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

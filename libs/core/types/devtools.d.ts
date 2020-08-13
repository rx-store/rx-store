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

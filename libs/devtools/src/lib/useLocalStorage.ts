import React from 'react';

const getItem = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '');
  } catch {
    return undefined;
  }
};

export default function useLocalStorage(key: string, defaultValue: unknown) {
  const [value, setValue] = React.useState(() => {
    const val = getItem(key);
    if (typeof val === 'undefined' || val === null) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
    return val;
  });

  const setter = React.useCallback(
    (updater) => {
      setValue((old: unknown) => {
        let newVal = updater;
        if (typeof updater == 'function') {
          newVal = updater(old);
        }
        localStorage.setItem(key, JSON.stringify(newVal));
        return newVal;
      });
    },
    [key]
  );

  return [value, setter];
}

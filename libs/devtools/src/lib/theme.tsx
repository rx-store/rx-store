import React from 'react';

const ThemeContext = React.createContext<any>(null);

export function ThemeProvider({ theme, ...rest }: any) {
  return <ThemeContext.Provider value={theme} {...rest} />;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}

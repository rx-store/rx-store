import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Manager, devTools$ } from './app/Manager';
import { Devtools } from '@rx-store/devtools';

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `rx store` Provider with the context value & root effect */}
    <Manager>
      <>
        <App />
        <Devtools panelProps={{ observable: devTools$ }} />
      </>
    </Manager>
  </React.StrictMode>,
  document.getElementById('root')
);

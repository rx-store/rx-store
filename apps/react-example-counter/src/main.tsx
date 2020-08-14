import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Manager } from './app/Manager';
import { Devtools } from '@rx-store/devtools';

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react` Provider with the context value & root effect */}
    <Manager>
      <>
        <App />
        <Devtools />
      </>
    </Manager>
  </React.StrictMode>,
  document.getElementById('root')
);

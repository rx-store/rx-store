import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Manager } from './app/Manager';
import { Visual } from './app/Visual';

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Manager>
      <>
        <App />
        <Visual />
      </>
    </Manager>
  </React.StrictMode>,
  document.getElementById('root')
);

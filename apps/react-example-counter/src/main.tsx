import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Manager } from './app/Manager';
import { Visualizer } from '@rx-store/visualizer';

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Manager>
      <>
        <App />
        <Visualizer />
      </>
    </Manager>
  </React.StrictMode>,
  document.getElementById('root')
);

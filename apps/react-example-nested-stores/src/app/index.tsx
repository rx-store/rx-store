import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Manager } from './Manager';

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `rx store` Provider with the context value & root effect */}
    <Manager>
      <App />
    </Manager>
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import { ConfigProvider, theme } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'antd/dist/reset.css';
import './polyfill';
import App from './App';
import './index.css';

// https://github.com/GoogleChromeLabs/jsbi/issues/30

// (BigInt.prototype as any).toJSON = function () {
//   return this.toString();
// };

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

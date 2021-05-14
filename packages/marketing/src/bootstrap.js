import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Mount function of the app
const mount = (el) => {
  ReactDOM.render(<App />, el);
};

// In isolation call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document
    .getElementById('_marketing-dev-root');
  if (devRoot) {
    mount(devRoot);
  }
}

// Running through container, export mount function.
// Let container decide when to call mount.
export {
  mount
};

import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory, createBrowserHistory } from 'history';
import App from './App';

// Mount function of the app
const mount = (el, { onNavigate, defaultHistory, initialPath } ) => {
  // When running in isolation(NOT thru container) use defaultHistory else memoryHistory
  // Memory hsitory always initializes with path '/' irrespective of the browser URL.
  const history = defaultHistory
    ||
    createMemoryHistory({
      initialEntries: [initialPath]
    });
  // history.listen called whenever a navigation occurs
  onNavigate && history.listen(onNavigate);
  ReactDOM.render(<App history={ history } />, el);

  return {
    onParentNavigate(location) {
      const { pathname: nextPathname } = location; // being navigated in Container App
      console.log('path being navigated in Container app', nextPathname);

      // Current pathname !== path being navigated in Container app
      // Update the history to new nextPathname
      if (history.location.pathname !== nextPathname) {
        history.push(nextPathname);
      }
    }
  };
};

// In isolation call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document
    .getElementById('_marketing-dev-root');
  if (devRoot) {
    mount(devRoot, {
      defaultHistory: createBrowserHistory()
     }); // When running in isolation/dev mode we can use BrowserHistory
  }
}

// Running through container, export mount function.
// Let container decide when to call mount.
// Here we will use memoryHistory.
// Container will use browserHistory and all connected subapps will use
// memory history. This is because only one history object will have access to
// browser address bar and hence no conflict.
// We will sync paths between container and connected apps.
export {
  mount
};

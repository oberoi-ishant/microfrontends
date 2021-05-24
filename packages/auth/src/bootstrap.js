import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory, createBrowserHistory } from 'history';
import App from './App';

// Mount function of the app
const mount = (el, { onNavigate, defaultHistory, initialPath, onSignIn } ) => {
  // When running in isolation(NOT thru container) use defaultHistory else memoryHistory
  // Memory history always initializes with path '/' irrespective of the browser URL.
  // Hence we set the initialPath for memoryHistory to start it from that path.

  // Once we configure Auth app with container app, when we navigate to route
  // /auth/signin or auth/signup we will see blank page. This is because
  // Auth uses memoryhistory which always starts from '/'. In auth app we do
  // not have a route configured for /, hence it is blank. It is only after
  // we click on login/signup a second time the route /auth/singup is registered
  // and we see contents from auth app.
  // So to fix this will set the initial path to whatever path is sent by container app.

  // This issue is also present in Maketing app but we do not see it as it has a route for
  // '/' configured. It shows the contents. But techincally issue is there.
  // We should fix it with intialPath as done here.
  const history = defaultHistory
    ||
    createMemoryHistory({
      initialEntries: [initialPath]
    });
  // history.listen called whenever a navigation occurs
  onNavigate && history.listen(onNavigate);
  ReactDOM.render(<App history={ history } onSignIn={ onSignIn } />, el);

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
    .getElementById('_auth-dev-root');
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

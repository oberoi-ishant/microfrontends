import { createApp } from 'vue';
import Dashboard from './components/Dashboard.vue';

// Mount function of the app
const mount = (el) => {
  const app = createApp(Dashboard);
  app.mount(el); // Vue mount function
};

// In isolation call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document
    .getElementById('_dashboard-dev-root');
  if (devRoot) {
    mount(devRoot); // When running in isolation/dev mode we can use BrowserHistory
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

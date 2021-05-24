import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Progress from './components/Progress';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

// Now all PRODUCTION classnames will start from `co`. No class name collisions
const generateClassName = createGenerateClassName({
  productionPrefix: 'co'
});

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const history = createBrowserHistory();
/**
 * We have switched from BrowserRouter to Router -> BrowserHistory because
 * in react-router-dom it is tough to access history object from the component that creates
 * BrowserRouter. Hence we create Router and then create BrowserHistory from it and use it
 * in this same component. It has nothing to do with microfrontends specifically.
 *
 * So just create generic Router and ask for copy of BrowserHistory object.
 */

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    /** If user is signed in and goes to /dashboard allow */
    if (isSignedIn) {
      history.push('/dashboard');
    }
    /**
     * If signedout,and then try to access /dashboard redirect to '/' using
     * Redirect component like below.
     * We will not push else case here like { else { history.push('/') } }
     * This will make sure every time user comes to app we force him to go to
     * / route if he is signedout.
     * Initially when the app loads user will be signed out.
     * hence use Redirect component.
     * We need to check only this route not all routes. he can access say some
     * other route like /pricing even when he is signed out.
    */
  }, [isSignedIn]);

  return (
    <Router history={ history }>
      <StylesProvider generateClassName={ generateClassName }>
        <div>
          <Header isSignedIn={ isSignedIn } onSignOut={ () => setIsSignedIn(false) } />
          <Suspense fallback={ <Progress /> }>
            <Switch>
              <Route path="/auth/" >
                <AuthLazy onSignIn={ () => setIsSignedIn(true) } />
              </Route>
              <Route path="/dashboard">
                { !isSignedIn && <Redirect to="/" /> }
                <DashboardLazy />
              </Route>
              <Route path="/" component={ MarketingLazy } />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};

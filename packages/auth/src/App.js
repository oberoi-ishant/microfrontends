import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

import Signin from './components/Signin';
import Signup from './components/Signup';

const generateClassName = createGenerateClassName({
  productionPrefix: 'au'
});
// Now all PRODUCTION classnames will start from `au`.

export default ({ history, onSignIn }) => {
  return (
    <div>
      <StylesProvider generateClassName={ generateClassName }>
        <Router history={ history }>
          <Switch>
            { /** REMEMBER: WHEN YOU RELOAD THE BROWSER OR PASTE A URL DIRECTLY AND LOAD

              Here we are trying to load nested urls. So if you
              directly paste localhost:8082/auth/signin in browser you will see error
              like http://localhost:8082/auth/main.js and http://localhost:8082/auth/remoteEntry.js not found 404.

              With webpack html plugin script tag will be like
              <script src="main.js"></script>
              <script src="remoteEntry.js"></script>
              (FYI: A url in src attribute in script tag like /main.js means that
              "/" is the root from domain. So it will start from its domain
              http:locahost:8081/<main.js>. Absolute url. We cannot use /main in our
              marketing app. Coz when we load it through container, /main will be relative
              to container apps domain http:locahost:8080/<main.js> and we will end up having WRONG file. We might load container apps main.js as opposed to marketing apps main.js)

              So here, with just filenames in src and NO path like /main.js or /public/main.js
              webpack tries to load these files in src in script tag with
              rule: <domain>+<path> in browser.
              Here since we do not have a forward slash at the end of
              localhost:8082/auth/signin, path is considered as "localhost:8082/auth/".
              So webpack tries to load script tags with path localhost:8082/auth/main.js and
              localhost:8082/auth/remoteEntry.js
              To solve this we need to add publicPath property to the the webpack.dev.js
              publicPath: 'http://localhost:8082/' (with forward slash at the end).
              Now after adding this public path script files in index.html will be loaded relative to this publicPath url like http://localhost:8082/remoteEntry.js and http://localhost:8082/main.js. So publicPath is the key.


              We only have this issue with nested paths like here auth/signin.
              In marketing app we did not set Public path and did not face issue because
              all paths were straightforward not nested. like /pricing

              So when we directly PASTED or RELOADED url localhost:8081/pricing in browser, it worked. Coz script tags are like
              <script src="main.js"></script>
              <script src="remoteEntry.js"></script>
              Just file names, not path.
              Here url in browser is localhost:8082/pricing
              Since there is no forward slash after pricing, so path rule is
              <domain>+<path>=localhost:8081+/
              Now relative to this webpack will try to load both the remoteEntry/main.js.
              like http://localhost:8081/remoteEntry.js and http://localhost:8082/main.js which works fine.
              To be on a safer side we can still go ahead and add a publicPath to marketing
              app webpack.dev.js like publicPath: 'http://localhost:8081/' to be sure.
            */ }
            <Route path="/auth/signin">
              <Signin onSignIn={ onSignIn } />
            </Route>
            <Route path="/auth/signup">
              <Signup onSignIn={ onSignIn } />
            </Route>
          </Switch>
        </Router>
      </StylesProvider>
    </div>
  );
};

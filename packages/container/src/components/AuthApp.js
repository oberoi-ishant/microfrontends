import { mount } from 'auth/AuthApp';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default ({ onSignIn }) => {
  const ref = useRef(null);
  // This is the history object used in container.
  // It is the copy of the BrowserHistory
  const history = useHistory();

  useEffect(()=> {
    const { onParentNavigate } = mount(ref.current, {
      // Set intial pathname for memory history object in auth app
      // to start from.
      initialPath: history.location.pathname,
      onNavigate: (location) => {
        const { pathname: nextPathname } = location; // path in Marketing app
        console.log('path being navigated in Marketing app', nextPathname);

        const { pathname } = history.location; // path in container app
        // Update the browserhistory path with the pathname
        // that marketing app is trying to load.
        // Hence sync both history objects when we click a
        // marketing app link.
        if (pathname !== nextPathname) {
          // else we might get in a loop,
          // both history objects telling each other
          // i updated, you update.
          history.push(nextPathname);
        }
      },
      onSignIn // Passing the onSignIn function to auth app
    });
    // history.listen is called every time new route is invoked.
    // This time when container route changes, we setup a listener on the
    // history object (browerhistory) and call the onParentNavigate to notify
    // marketing app about the change in route.
    history.listen(onParentNavigate);
  }, []);

  return (
    <div ref={ ref } />
  );
};
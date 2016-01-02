import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute} from 'react-router';

import Main from './Main';

import PhotoStore from '../stores/photoStore';
import SplashScreen from './views/SplashScreen';
import HtmlBookViewer from './views/HtmlBookViewer';
import ImageBookViewer from './views/ImageBookViewer';
import Wizard from './views/Wizard';


// Render the main component into the dom
ReactDOM.render((
  // Render the main component into the dom
  <Router history={PhotoStore.history}>
    <Route path="/" component={Main}>
      <IndexRoute component={SplashScreen} />

      <Route path="htmlBook" component={HtmlBookViewer} />
      <Route path="book" component={ImageBookViewer} />
      <Route path="wizard" component={Wizard}>

        {/* add some nested routes where we want the UI to nest */}
        {/* render the stats page when at `/inbox` */}
        {/* <IndexRoute component={InboxStats}/> */}
        {/* render the message component at /inbox/messages/123 */}
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));

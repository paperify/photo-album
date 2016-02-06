import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute} from 'react-router';

import Main from './Main';

import PhotoStore from '../stores/photoStore';
import SplashScreen from './views/SplashScreen';
import HtmlBookViewer from './views/SwipeBookViewer';
import Wizard from './views/Wizard';
import SimpleViewer from './views/SimpleViewer';


// Render the main component into the dom
ReactDOM.render((
  // Render the main component into the dom
  <Router history={PhotoStore.history}>
    <Route path="/" component={Main}>
      <IndexRoute component={SplashScreen} />

      <Route path="htmlBook" component={HtmlBookViewer} />
      <Route path="wizard" component={Wizard}/>
      <Route path="viewer/:id" component={SimpleViewer}/>
    </Route>
  </Router>
), document.getElementById('app'));

require('normalize.css');
require('styles/App.css');
require('styles/react-input-range.css');
require('styles/prog-tracker.css');

import React from 'react';
import { Router, Route, Link } from 'react-router'
import PhotoStore from '../stores/photoStore';

// Then we delete a bunch of code from App and
// add some <Link> elements...
export default class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {currentLocation: '/'}
  }
  componentDidMount(){
    // Listen for changes to the current location. The
    // listener is called once immediately.
    var me = this;
    let unlisten = PhotoStore.history.listen(location => {
      console.log(location.pathname);
      me.setState({currentLocation:location.pathname});
    })
  }
  render() {

    return (
      <div>

        {/*
         next we replace `<Child>` with `this.props.children`
         the router will figure out the children for us
         */}
        {this.props.children}
      </div>
    )
  }
}

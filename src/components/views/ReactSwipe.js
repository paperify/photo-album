import React from 'react';
import ReactDOM from 'react-dom';
var objectAssign = require('object-assign');
var Swipe = require('swipe-js-iso');

const styles = {
  container: {
    overflow: 'hidden',
    visibility: 'hidden',
    position: 'relative'
  },

  wrapper: {
    overflow: 'hidden',
    position: 'relative'
  },

  child: {
    float: 'left',
    width: '50%',
    position: 'relative',
    transitionProperty: 'transform',
    overflow:'hidden'
  }
};

export default class ReactSwipe extends React.Component {
  constructor(props) {
    super(props);
    this.ratio = 1.38
  }

  handleResize() {
    var root = ReactDOM.findDOMNode(this);
    var size = this.resize(root);
    this.swipe = Swipe(root, objectAssign({}, this.props));
    //$(bookNode).turn('size', size.width, size.height);
  }

  resize(el) {
    // reset the width and height to the css defaults
    //el.style.width = '';
    //el.style.height = '';

    //var width = el.clientWidth,
    //  height = Math.round(width / this.ratio),
    //  padded = Math.round(document.body.clientHeight * 0.9);
    //
    //// if the height is too big for the window, constrain it
    //if (height > padded) {
    //  height = padded;
    //  width = Math.round(height * this.ratio);
    //}
    var ratio = document.body.clientWidth / (794 *2);
    el.style.zoom = ratio;

    // set the width and height matching the aspect ratio
    //el.style.width = width + 'px';
    //el.style.height = height + 'px';

    return {
      //width: width,
      //height: height
    };
  }


  componentDidMount() {
    var me = this;
    window.addEventListener('resize', this.handleResize.bind(this));
    var root = ReactDOM.findDOMNode(this);
    me.resize(root);
    me.swipe = Swipe(root, objectAssign({}, this.props));
  }

  componentDidUpdate() {
    if (this.props.slideToIndex || this.props.slideToIndex === 0) {
      this.swipe.slide(this.props.slideToIndex);
    }
  }

  componentWillUnmount() {
    this.swipe.kill();
    delete this.swipe;
  }

  shouldComponentUpdate(nextProps) {
    return (
      (this.props.slideToIndex !== nextProps.slideToIndex) ||
      (typeof this.props.shouldUpdate !== 'undefined') && this.props.shouldUpdate(nextProps, this.props)
    );
  }


  render() {

    return React.createElement('div', React.__spread({}, {style: styles.container}, this.props),
      React.createElement('div', {style: styles.wrapper},
        React.Children.map(this.props.children, function (child) {
          return React.cloneElement(child, {
            ref: child.props.ref,
            key: child.props.key,
            style: child.props.style ? objectAssign(child.props.style, styles.child) : styles.child
          });
        })
      )
    );
  }
}

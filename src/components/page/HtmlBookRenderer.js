import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import GraphicUtil from '../utils/graphicUtil'
import HtmlPagesRenderer from './HtmlPagesRenderer';

export default class HtmlBookRenderer extends React.Component{
  componentDidMount () {
    var pageOptions = this.props.pageOptions;
    $( ReactDOM.findDOMNode(this)).turn({gradients: false, acceleration: true, autoCenter:true, width: pageOptions.width * 2, height:  pageOptions.height });
  }
  render () {
    var pageOptions = this.props.pageOptions;

    var bookStyle = {width: pageOptions.width * 2, height:  pageOptions.height, position:'relative'};
    console.log(bookStyle);
    var cloneProps = _.extend(this.props,{style:bookStyle});

    return React.createElement(HtmlPagesRenderer, cloneProps);
  }
};

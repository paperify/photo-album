import React from 'react';
import ReactDOM from 'react-dom';
import flux from 'fluxify';
import Loader from 'react-loader';

import Brand from '../utils/brand';
import PhotoStore from '../../stores/photoStore';

export class ImageBook extends React.Component {
  constructor(props) {
    super(props);
    this.ratio = 1.38
  }

  handleResize() {
    var bookNode = ReactDOM.findDOMNode(this.refs.book);
    var size = this.resize(bookNode);
    $(bookNode).turn('size', size.width, size.height);
  }

  resize(el) {
    // reset the width and height to the css defaults
    el.style.width = '';
    el.style.height = '';

    var width = el.clientWidth,
      height = Math.round(width / this.ratio),
      padded = Math.round(document.body.clientHeight * 0.9);

    // if the height is too big for the window, constrain it
    if (height > padded) {
      height = padded;
      width = Math.round(height * this.ratio);
    }

    // set the width and height matching the aspect ratio
    el.style.width = width + 'px';
    el.style.height = height + 'px';

    return {
      width: width,
      height: height
    };
  }

  plugins(el) {
    // run the plugin
    $(el).turn({
      gradients: true,
      acceleration: true
    });
    // hide the body overflow
    document.body.className = 'hide-overflow';
  }

  componentDidMount() {
    var me = this;

    window.addEventListener('resize', this.handleResize.bind(this));
    document.body.style['background-color'] = 'gray';
    document.body.style['overflow'] = 'hidden';
    var bookNode = ReactDOM.findDOMNode(me.refs.book);
    me.resize(bookNode);
    me.plugins(bookNode);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.body.style['background-color'] = 'transparent';
    document.body.style['overflow'] = 'initial';
  }

  render() {
    var t = {
      display: 'table',
      width: '100%',
      height: '100%'
    }

    var tc = {
      display: 'table-cell',
      verticalAlign: 'middle',
      textAlign: 'center',
      position: 'relative'
    }

    var rel = {
      position: 'relative'
    }

    /* book */

    var book = {
      margin: '0 auto',
      width: '90%',
      height: '90%',
      //-webkit-touch-callout: none;
      //-webkit-user-select: none;
      //-khtml-user-select: none;
      //-moz-user-select: none;
      //-ms-user-select: none;
      //user-select: none;
    };
    //
    //.book .page {
    //    height: 100%;
    //  }
    //
    //.book .page img {
    //    max-width: 100%;
    //    height: 100%;
    //  }
    return (<div style={t}>
      <div style={tc}>
        <div ref="book" style={book} className="book">
          {this.props.pages.map(function (item, i) {
            return <div key={'page_' + i} className="page"><img src={item.url +"?t=" + new Date().getTime() } alt=""/>
            </div>
          })}
        </div>
      </div>
    </div>)
  }
}
export default class ImageBookViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAlbum: PhotoStore.selectedAlbum,
      wizardData: PhotoStore.wizardData,
      pages: [],
      loaded: false
    };

  }

  componentDidMount() {

    console.log(this.state.wizardData);
    flux.doAction('generatePages', this.state.selectedAlbum, this.state.wizardData, "png");
    var me = this;
    PhotoStore.on('change:pages', function (value) {
      me.setState({
        pages: value,
        loaded: true
      });
    });

  }


  render() {
    var centerStyle = {
      verticalAlign:'middle',
      textAlign:'center',
      width:'100%',
      height:'100%'
  }

    return (<div>
        <header>
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <ul className="nav navbar-nav">
                <li>
                  <Brand />
                </li>
              </ul>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <a href="#/wizard"><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                  </li>
                  <li>
                    <a onClick={()=>{flux.doAction('generateAlbum',undefined,undefined,"pdf")}}><span
                      className="glyphicon glyphicon-print" aria-hidden="true"></span></a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <div style={{paddingTop:70}}>
          {!this.state.loaded?<div style={centerStyle}>Please, wait. We are just generating photo album for you.</div>:null}
          <Loader loaded={this.state.loaded}>
            <ImageBook pages={this.state.pages}/>
          </Loader>
        </div>
      </div>
    )
  }
};

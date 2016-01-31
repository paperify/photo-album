import React from 'react';
import ReactDOM from 'react-dom';

import Binder from 'react-binding';
import flux from 'fluxify';
import HtmlPagesRenderer from '../renderer/HtmlPagesRenderer';
import PhotoStore from '../../stores/photoStore';
import Brand from '../utils/brand';
import Widgets from '../page/WidgetFactory';
import {toData} from '../utils/repeatTemplate';
import wizardStyles from '../utils/wizardStyles';
import Slider from './ReactSwipe';

//import Slider from 'react-slick';


class HtmlBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      schema: PhotoStore.schema,
      wizardData: PhotoStore.wizardData
    };
    this.ratio = 1.38
  }

  componentDidMount() {
    var me = this;
   // window.addEventListener('resize', this.handleResize.bind(this));
    PhotoStore.on('change:schema', function (value) {
      me.setState({
        schema: value
      });
    });

    //var bookNode = ReactDOM.findDOMNode(me.refs.book);
    //me.resize(bookNode);

  }
  handleResize() {
    var bookNode = ReactDOM.findDOMNode(this.refs.book);
    var size = this.resize(bookNode);
    //$(bookNode).turn('size', size.width, size.height);
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
    //el.style.zoom = (document.body.clientWidth ) / (2 * 794);

    // set the width and height matching the aspect ratio
    el.style.width = width + 'px';
    el.style.height = height + 'px';

    return {
      width: width,
      height: height
    };
  }
  render() {
    var schema = this.state.schema;
    if (schema === undefined) return <div>Loading...</div>;

    schema = _.cloneDeep(this.state.schema);

    //apply wizard styles to schema
    wizardStyles(schema,this.state.wizardData && this.state.wizardData.styles);

    var data = toData(schema,this.state.wizardData.photos);
    var dataContext = Binder.bindToState({state:{data:data}},'data');
    var pageOptions = this.state.wizardData && this.state.wizardData.pageOptions;

    return (<div ref="book" style={{paddingBottom:10,paddingLeft:10,paddingRight:10}}>
        <HtmlPagesRenderer pagesRoot={Slider} widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={pageOptions}/>
    </div>)
  }
};

export default class HtmlBookViewer extends React.Component {
  render() {
    return <div>
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
                  <a href="#/book"><span className="glyphicon glyphicon-share" aria-hidden="true"></span></a>
                </li>
                <li>
                  <a onClick={()=>{flux.doAction('generateAlbum',"pdf")}} ><span className="glyphicon glyphicon-print" aria-hidden="true"></span></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div style={{paddingTop:70}}>
        <HtmlBook/>
      </div>
    </div>
  }
}

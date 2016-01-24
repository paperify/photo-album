import React from 'react';
import Binder from 'react-binding';
import flux from 'fluxify';
import {ImageGallery} from '../layout/ImageGallery';
import HtmlBookRenderer from '../page/HtmlBookRenderer';
import PhotoStore from '../../stores/photoStore';
import Brand from '../utils/brand';
import Widgets from '../page/WidgetFactory';
import repeatTemplate from '../utils/repeatTemplate';
import convertToHash from '../utils/convertToHash';
import wizardStyles from '../utils/wizardStyles';

class HtmlBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      schema: PhotoStore.schema,
      wizardData: PhotoStore.wizardData
    };
  }

  componentDidMount() {
    var me = this;
    PhotoStore.on('change:schema', function (value) {
      me.setState({
        schema: value
      });
    });

  }

  render() {
    var schema = this.state.schema;
    if (schema === undefined) return <div>Loading...</div>;

    schema = _.cloneDeep(this.state.schema);

    //apply wizard styles to schema

    wizardStyles(schema,this.state.wizardData && this.state.wizardData.styles);

    var dataContext = Binder.bindToState(this,'schema','data');

    var pageOptions = this.state.wizardData && this.state.wizardData.pageOptions;

    return (<div style={{paddingBottom:10,paddingLeft:10,paddingRight:10}}>
      <HtmlBookRenderer widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={pageOptions}/>
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
                  <a onClick={()=>{flux.doAction('generateAlbum',undefined,undefined,"pdf")}} ><span className="glyphicon glyphicon-print" aria-hidden="true"></span></a>
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

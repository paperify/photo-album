import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import flux from 'fluxify';
import Binder from 'react-binding';
import HtmlPagesRenderer from 'react-html-pages-renderer';
import PhotoStore from '../../stores/photoStore';
import Brand from '../utils/brand';
import Widgets from '../page/WidgetFactory';

class HtmlBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var me = this;
    $.ajax({
      type: "GET",
      url: PhotoStore.dataServiceUrl + "/docs/" + this.props.params.id,
      dataType: 'json',
      success: function (data) {
        me.setState({
          schema: JSON.parse(data.schemaTemplate),
          data:data.data || {},
          pageOptions:data.customData.pageOptions || {}
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert("failed");
      }
    })

  }
  render() {
    var schema = this.state.schema;
    if (schema === undefined) return <div>Loading...</div>;
    var dataContext = Binder.bindToState(this,'data');

    return (<div style={{paddingBottom:10,paddingLeft:10,paddingRight:10}}>
        <HtmlPagesRenderer  widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} doublePage="true"/>
    </div>)
  }
};

export default class HtmlBookViewer extends React.Component {
  render() {
    return <div>
      {<header>
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
                  <a onClick={()=>{flux.doAction('generateAlbum',"pdf")}} ><span className="glyphicon glyphicon-print" aria-hidden="true"></span></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>}
      <div style={{paddingTop:70}}>
        <HtmlBook params={this.props.params}/>
      </div>
    </div>
  }
}

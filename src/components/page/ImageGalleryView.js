
import React from 'react';
import Binder from 'react-binding';

import Widgets from './WidgetFactory';
import HtmlPagesRenderer from 'react-html-pages-renderer';
import {ImageGallery} from '../layout/ImageGallery';
import templateRepeater from '../utils/repeatTemplate';
import convertToHash from '../utils/convertToHash';
import PhotoStore from '../../stores/photoStore';
import wizardStyles from '../utils/wizardStyles';

export default class ImageGalleryView extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      zoomFactor: 0.2
    };
  }

  render(){
    if (this.props.schema === undefined) return (<div>Loading...</div>);

    var schema = _.cloneDeep(this.props.schema);


    //apply wizard styles to schema
     wizardStyles(schema, this.props.wizardData && this.props.wizardData.styles);


    var style = {boxSizing: 'border-box', position: 'fixed', bottom: 0, right: 0, margin: 20, zIndex: 1000};
    var buttonStyle = {
      width: 55,
      height: 55,
      background: '#265a88',
      padding: 17,
      borderRadius: '100',
      color: 'white',
      textAlign: 'center',
      margin: 10
    };


    return (
      <div>
        <div style={style}>
          <div style={buttonStyle} onClick={()=> {this.setState({zoomFactor: this.state.zoomFactor / 0.9})}}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
          </div>
          <div style={buttonStyle} onClick={()=> {this.setState({zoomFactor: this.state.zoomFactor * 0.9})}}>
            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
          </div>
        </div>
        <div style={{zoom:this.state.zoomFactor}}>
          <HtmlPagesRenderer style={{display:'flex',flexWrap:'wrap'}} widgets={Widgets} schema={schema} dataContext={this.props.dataContext}
                             pageOptions={this.props.pageOptions}/>
        </div>
      </div>);
  }
};

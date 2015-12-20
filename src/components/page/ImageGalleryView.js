
import React from 'react';
import HtmlPagesRenderer from './HtmlPagesRenderer';
import {ImageGallery} from '../layout/ImageGallery';
import BindToMixin from 'react-binding';
import ImageBox from '../widgets/ImageBox';
import HtmlBox from '../widgets/HtmlBox';

var Widgets = {
  'Core.ImageBox':ImageBox,
  'Core.HtmlBox':HtmlBox
};

export default class ImageGalleryView extends React.Component
{
  constructor(props){
    super(props);
    this.state = {zoomFactor: 1};
  }

  render(){
    if (this.props.photos === undefined) return (<div>Loading...</div>);

    var gallery = new ImageGallery("ImageGallery", this.props.photos, this.props.template, this.props.pageOptions);
    var schema = gallery.generate();
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
          <HtmlPagesRenderer style={{display:'flex',flexWrap:'wrap'}} widgets={Widgets} schema={schema} data={{}}
                             pageOptions={this.props.pageOptions}/>
        </div>
      </div>);
  }
};

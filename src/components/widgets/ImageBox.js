import React from 'react';

export default class ImageBox extends React.Component{
  render() {
    var style = {};

    //border
    var border = this.props.border || {};
    if (border.width) style.borderWidth = border.width;
    if (border.radius) style.borderRadius = border.radius;
    if (border.color) style.borderColor = border.color;
    if (border.style) style.borderStyle = border.style;

    //size
    if (this.props.height) style.height = this.props.height;
    if (this.props.width) style.width = this.props.width;

    if (this.props.objectFit) style.objectFit = this.props.objectFit || 'fill';
    if (this.props.clipPath) {
      style.clipPath = this.props.clipPath;
      style.WebkitClipPath = this.props.clipPath;
    }

    var titleStyle = {
      color:'white',
      position:'relative',
      margin:5,
      fontWeight:'bold'
    };
    return (
      <div>
        {(this.props.titlePosition && this.props.titlePosition === 'top')?<span style={_.extend(titleStyle,{top:20})}>{this.props.title}</span>:null}
        <img src={this.props.url} style={style} />
        {(this.props.titlePosition && this.props.titlePosition === 'bottom')?<span style={_.extend(titleStyle,{top:-20})}>{this.props.title}</span>:null}
      </div>
    )
  }
}

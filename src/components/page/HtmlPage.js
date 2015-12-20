import React from 'react';
import _ from 'lodash';
import GraphicPrimitive from '../utils/graphicUtil.js';

export default class HtmlPage extends React.Component
{
    render() {
        var options = this.props.pageOptions;

        var pageSize =  GraphicPrimitive.DefaultPageSize;
        if (options !== undefined && options.height && options.width) {
            pageSize = [options.width, options.height];
        }
        //TODO: implement other sizes
        //else {
        //	paper.format = options.format || 'A4'
        //	paper.orientation = options.orientation || 'portrait'
        //}

        var defaultMargin = GraphicPrimitive.DefaultMargin;

        var margins = [defaultMargin, defaultMargin, defaultMargin, defaultMargin];


        if (options !== undefined && options.margin !== undefined) {
            margins = [options.margin.top || defaultMargin, options.margin.right || defaultMargin, options.margin.bottom || defaultMargin, options.margin.left || defaultMargin];
        }
        //console.log(JSON.stringify(margins,null,2));

        //convert points to pixel
        pageSize = [pageSize[0], pageSize[1]];
        margins = [margins[0],margins[1],margins[2],margins[3]];

        //console.log(JSON.stringify(pageSize,null,2));

        //if (this.props.errorFlag) classNames += ' errorFlag';
        var pageInnerStyle = {
            overflow: 'visible',
            width: pageSize[0] - (margins[0] + margins[2]),
            height: pageSize[1] - (margins[1] + margins[3]),
            position: 'relative',
            backgroundColor: 'transparent'
        };
        var pageStyle = {
            width: pageSize[0],
            height: pageSize[1],
            paddingTop: margins[0],
            paddingRight: margins[1],
            paddingBottom: margins[2],
            paddingLeft: margins[3],
            border: (options && options.border) || 'gray 1px solid',
            backgroundColor: '#ffffff',
        };
        //console.log("InnerStyle: " + JSON.stringify(pageInnerStyle,null,2));
        //console.log("PageStyle: " +  JSON.stringify(pageStyle,null,2));

        var bgStyle = _.clone(pageStyle);
        var bg = this.props.background;
        if (!!bg.color) bgStyle.backgroundColor = bg.color;
        if (!!bg.image) bgStyle.backgroundImage = 'url(' + bg.image + ')';
        if (!!bg.position) bgStyle.backgroundPosition = bg.position;
        if (!!bg.repeat) bgStyle.backgroundRepeat = bg.repeat;
         if (!!bg.size) bgStyle.backgroundSize = bg.size;
        if (!!bg.attachment) bgStyle.backgroundAttachment = bg.attachment;

        var filter = bg.filter || {};
        var cssFilter = "";
        if (!!filter.blur) cssFilter += ' blur(' +  filter.blur +  'px)';
        if (!!filter.brightness) cssFilter += ' brightness(' +  filter.brightness +  '%)';
        if (!!filter.contrast) cssFilter += ' contrast(' +  filter.contrast +  '%)';
        if (!!filter.grayscale) cssFilter += ' grayscale(' +  filter.grayscale +  '%)';
        if (!!filter.hueRotate) cssFilter += ' hue-rotate(' +  filter.hueRotate +  'deg)';
        if (!!filter.invert) cssFilter += ' invert(' +  filter.invert +  '%)';
        if (!!filter.opacity) cssFilter += ' opacity(' +  filter.opacity +  '%)';
        if (!!filter.saturate) cssFilter += ' saturate(' +  filter.saturate +  '%)';
        if (!!filter.sepia) cssFilter += ' sepia(' +  filter.sepia +  '%)';

        bgStyle.WebkitFilter = cssFilter;
        bgStyle.filter = cssFilter;
        bgStyle.position = 'absolute';


      //var imgStyle = {};
      //imgStyle.height = pageStyle.height;
      //imgStyle.zIndex = this.props.position % 2 !== 0?1:2;
      //imgStyle.width = pageStyle.width * 2;
      //if (this.props.position % 2 !== 0) {
      //  imgStyle.marginLeft = -pageStyle.width;
      //}
      //imgStyle.objectFit = 'cover';

       bgStyle.backgroundSize = (pageStyle.width * 2) + "px " + (pageStyle.height) + "px";
       bgStyle.backgroundPosition = this.props.position % 2 !==1?'0% 0%':'100% 0%';
        return (
            <div id={'PAGE_' + this.props.pageNumber}>
              {/*<div style={{position:'absolute',width:pageStyle.width,height:pageStyle.height}}><img src={bg.image} style={imgStyle}></img></div>*/}
                <div style={bgStyle} />
                <div style={pageStyle}>
                    <div style={pageInnerStyle}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
};

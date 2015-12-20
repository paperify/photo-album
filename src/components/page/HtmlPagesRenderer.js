import React from 'react';

import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetStyleRenderer.js';

import GraphicPrimitive from '../utils/graphicUtil.js';
import transformToPages from '../utils/transformToPages';


export default class HtmlPagesRenderer extends React.Component
{
	render () {
		var pageOptions =this.props.pageOptions || {};
		var pageHeight = pageOptions.height || GraphicPrimitive.DefaultPageSize[1];
		var pageMargin = pageOptions.margin || {};
		if (pageMargin.top !== undefined) pageHeight -=pageMargin.top;
		if (pageMargin.bottom !== undefined) pageHeight -=pageMargin.bottom;

		var pages = this.props.pages;
		if (pages === undefined) pages = transformToPages(this.props.schema,GraphicPrimitive.pointToPixel(pageHeight));
		var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
		var customStyles = ctx['styles'] || {};

		var pageBackground = (this.props.schema.props && this.props.schema.props.background) || {};
    var items = (this.props.schema.props && this.props.schema.props.items) || [];
    var normalizeBackgrounds = _.map(items,function(item){return item.background}).concat(_.map(_.range(0,pages.length - items.length),function(){return pageBackground}));

		return (
			<div id="section-to-print" style={this.props.style}>
				{pages.map(function (page, i) {
          var back = normalizeBackgrounds[i];
          var imgStyle = {}
					return (<HtmlPage key={'page' + i} position={i} pageNumber={page.pageNumber} widgets={this.props.widgets} background={back} pageOptions={this.props.pageOptions}>
						{page.boxes.map(function (node, j) {
							var elName = node.element.elementName;
							var widget = <WidgetRenderer key={'page' + i + '_' + j} widget={this.props.widgets[elName]} widgetProps={node.element.props}
														 customStyle={customStyles[elName]} />;
							return (
								<div key={'item' + j} style={ node.style}>
									<div id={node.element.name}>{widget}</div>
								</div>
							);
						}, this)}
					</HtmlPage>)
				}, this)}
			</div>
		);
	}
};

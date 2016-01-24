import React from 'react';
import _ from 'lodash';
import Binder from 'react-binding';

export default class WidgetRenderer extends React.Component
{

    render(){
        var box = this.props.node;
        var widget  = this.props.widget;
        if (widget === undefined) {
            return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
        }

		//get default props
		var bindingProps =  _.reduce(box.bindings,function(memo,value,key){
			memo[key] = undefined;
			return memo;
		},{});

		var defaultProps = _.merge(bindingProps,box.props);

		//apply binding
		var props = this.props.dataBinder !== undefined? WidgetRenderer.bindProps(defaultProps,box.bindings,this.props.dataBinder,!!this.props.designer):defaultProps;


        //apply property resolution strategy -> default style -> custom style -> local style
		var customStyle= this.props.customStyle;
		var widgetStyle = {};
        if (customStyle !== undefined) widgetStyle = _.merge(widgetStyle,customStyle);
        props = _.merge(widgetStyle,props);

        return  React.createElement(widget,props,props.content !== undefined ? React.DOM.div({ dangerouslySetInnerHTML: {__html: props.content } }) : null);
    }
};

WidgetRenderer.bindProps =  function(clonedProps,bindings,dataBinder,isDesignMode ){
	var props = clonedProps;//_.cloneDeep(node.props);

	//go through all properties
	for (var propName in props) {
		var prop = props[propName];

		var bindingProps = bindings && bindings[propName];

		//if binding -> replace binding props
		if (bindingProps !== undefined) {

			if (!!bindingProps.path) {
				//apply binding
				var converter;
				if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
					converter = eval(bindingProps.converter.compiled);

					if (typeof converter === 'string' || converter instanceof String){
						var	sharedConverter = dataBinder.customCode && dataBinder.customCode[converter];
						if (sharedConverter === undefined) continue;
						converter = sharedConverter;
					}
				}
				var binding = Binder.bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs);

				if (!isDesignMode && bindingProps.mode === 'TwoWay') {
					//two-way binding
					props.valueLink = binding;
					props[propName] = null;
				}
				else {
					//one-way binding
					//box[propName] = dataBinder.value[prop.Path];
					props[propName] = binding.value;
				}
			}
			else {
				//binding is not correctly set - do not apply binding
				props[propName] = undefined;
			}
		}
	}
	return props;
}

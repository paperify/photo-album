import React from 'react';
import Binder from 'react-binding';
import InputRange from 'react-input-range';
import PageSizes from '../utils/standardPageSizes';
import _ from 'lodash';

const IMAGE_FACTOR = 10;
const PgeSizesList = _.map(PageSizes, function (value, key, index) {
        return {
            key: key,
            width: Math.round((value[0] / 72) * 96, 0),
            height: Math.round((value[1] / 72) * 96, 0),
            value: value
        }
    }
);

export default class PageSizeStep extends React.Component {

    pageSizeSelect(width, height){
        Binder.bindTo(this.props.wizardData, 'pageOptions.width').value = width;
        Binder.bindTo(this.props.wizardData, 'pageOptions.height').value = height;
    }
    render(){

        var pageOptions = this.props.wizardData.value.pageOptions;
        var pageOptionsWidthLink = Binder.bindTo(this.props.wizardData, 'pageOptions.width');
        var pageOptionsHeightLink = Binder.bindTo(this.props.wizardData, 'pageOptions.height');

        return (<div>
            <div>
                <label>Page size:{pageOptions.width} * {pageOptions.height}</label>
                <div className="form-group">
                    <label>Width:</label>
                    <div>
                        <InputRange
                            className="form-control"
                            maxValue={3000}
                            minValue={50}
                            value={pageOptionsWidthLink.value}
                            onChange={(comp, value)=>{pageOptionsWidthLink.value = value}}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Height:</label>
                    <div>
                        <InputRange
                            className="form-control"
                            maxValue={3000}
                            minValue={50}
                            value={pageOptionsHeightLink.value}
                            onChange={(comp, value)=>{pageOptionsHeightLink.value = value}}
                        />
                    </div>
                </div>
                <div className="flex-container">
                    {PgeSizesList.map(function (item, index) {
                        var width = Math.round(item.value[0]/IMAGE_FACTOR);
                        var height = Math.round(item.value[1]/IMAGE_FACTOR);
                        return (
                            <div key={'format' + index} className="flex-item" onClick={this.pageSizeSelect.bind(this,item.width,item.height)}>
                                <div
                                    style={{width:width,height:height,lineHeight:height+ 'px'}}
                                    className="thumb">
                                    <span>{item.key}</span>
                                </div>
                                <div className="footer">{item.width} x {item.height}</div>
                            </div>)

                    }, this)}
                </div>
            </div>
        </div>);
    }
};

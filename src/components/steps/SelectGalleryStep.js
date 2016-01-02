import React from 'react';
import {Binder} from 'react-binding';
import InputRange from 'react-input-range';
import PageSizes from '../utils/standardPageSizes';
import flux from 'fluxify';

export default class SelectImageGalleryStep extends React.Component
{
    changeLayoutProp(prop,propValue){
      Binder.bindTo(Binder.bindTo(this.props.wizardData, 'template.layout.Container'),prop).value = propValue;
    }
    changeProp(propName, propValue){

        Binder.bindTo(this.props.wizardData, propName).value = propValue;
        flux.doAction('changeImageSize',propValue);
    }
    changePageSize(format){
        var pageSize = PageSizes[format];
        if (pageSize === undefined) return;

        Binder.bindTo(this.props.wizardData, 'pageOptions.width').value = Math.round((pageSize[0] / 72) * 96, 0);
        Binder.bindTo(this.props.wizardData, 'pageOptions.height').value = Math.round((pageSize[1] / 72) * 96, 0);
    }

    render(){
        var imagesPerPageLink = Binder.bindTo(this.props.wizardData, 'pageOptions.imagesPerPage');
        var doubleLink = Binder.bindTo(this.props.wizardData, 'pageOptions.double');
        var coverPage = Binder.bindTo(this.props.wizardData, 'pageOptions.useCoverPage');
        var useImageAsBackground = Binder.bindTo(this.props.wizardData, 'pageOptions.useImageAsBackground');
        var pageOptions = this.props.wizardData.value.pageOptions;
        var layout = Binder.bindTo(this.props.wizardData, 'template.layout.Container').value;

      return (<div>
            <div className="form-group">
                <label>Images per page:<b>{imagesPerPageLink.value}</b></label>
                <div>
                    <InputRange
                        className="form-control"
                        maxValue={100}
                        minValue={1}
                        value={imagesPerPageLink.value}
                        onChange={(comp, value)=>{imagesPerPageLink.value = value}}
                    />
                </div>
            </div>
        <div className="form-group">
          <label>Use image as background:<b>{useImageAsBackground.value}</b></label>
          <div>
            <input type="checkbox"
                   checked={useImageAsBackground.value}
                   onChange={(e)=>{useImageAsBackground.value = e.target.checked}}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Double pages:<b>{doubleLink.value}</b></label>
          <div>
            <input type="checkbox"
              checked={doubleLink.value}
              onChange={(e)=>{doubleLink.value = e.target.checked}}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Cover page:<b>{coverPage.value}</b></label>
          <div>
            <input type="checkbox"
                   checked={coverPage.value}
                   onChange={(e)=>{coverPage.value = e.target.checked}}
            />
          </div>
        </div>

            <div className="form-group">
                <label>Image size:<b>{Binder.bindTo(this.props.wizardData, 'imageSize').value}</b></label>
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('imageSize','original')}>original</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('imageSize','mini')}>mini</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('imageSize','small')}>small</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('imageSize','middle')}>middle</button>
                </div>
            </div>

            <div className="form-group">
                <label>Page size:<b>{pageOptions.width} * {pageOptions.height}</b></label>
                <div className="btn-group" role="group" aria-label="...">
                    {
                        [1,2,3,4,5,6,7,8,9,10].map(function(item,index){return  <button key={'pageFormat' + index} type="button" className="btn btn-primary" onClick={()=>this.changePageSize('A' + item)}>A{item}</button>},this)
                    }
                </div>
                <br />
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-primary" onClick={()=>this.changePageSize('FOLIO')}>Folio</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changePageSize('LEGAL')}>Legal</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changePageSize('TABLOID')}>Tabloid</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changePageSize('LETTER')}>Letter</button>
                </div>
            </div>
          <div className="form-group">
            <label>Layout direction:<b>{layout.flexDirection}</b></label>
            <div className="btn-group" role="group" aria-label="...">
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('flexDirection','row')}>row</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('flexDirection','column')}>column</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('flexDirection','row-reverse')}>row-reverse</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('flexDirection','column-reverse')}>column-reverse</button>
            </div>
          </div>
          <div className="form-group">
            <label>Justify content:<b>{layout.justifyContent}</b></label>
            <div className="btn-group" role="group" aria-label="...">
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('justifyContent','flex-start')}>start</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('justifyContent','flex-end')}>end</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('justifyContent','center')}>center</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('justifyContent','space-between')}>space-between</button>
              <button type="button" className="btn btn-primary" onClick={()=>this.changeLayoutProp('justifyContent','space-around')}>space-around</button>
            </div>
          </div>
        </div>);
    }
};

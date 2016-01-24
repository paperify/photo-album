import React from 'react';
import Binder from 'react-binding';
import InputRange from 'react-input-range';
import ResetButton from '../controls/ResetButton';
import ColorPicker from 'react-colors-picker';
import flux from 'fluxify';

const DEFAULT_COLOR = "#ff0a0a";

export default class ImageStep extends React.Component {
  changeProp(prop, propValue) {
    Binder.bindTo(Binder.bindTo(this.props.wizardData, 'styles.image'), prop).value = propValue;
  }
  render() {
    var image = Binder.bindTo(this.props.wizardData, 'styles.image');

    var imageWidth = Binder.bindTo(this.props.wizardData, 'template.image.width');
    var imageHeight = Binder.bindTo(this.props.wizardData, 'template.image.height');

    var borderWidth = Binder.bindTo(image, 'border.width');
    var borderRadius = Binder.bindTo(image, 'border.radius');
    var borderColor = Binder.bindTo(image, 'border.color');
    return (<div>

      <div className="form-group">
        <label>Width:<b>{imageWidth.value}</b></label><ResetButton item={imageWidth}/>

        <div>
          <InputRange
            className="form-control"
            maxValue={1000}
            minValue={0}
            value={imageWidth.value || 0}
            onChange={(comp, value)=>{
              imageWidth.value = value;
              flux.doAction('changeTemplate');
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Height:<b>{imageHeight.value}</b></label><ResetButton item={imageHeight}/>

        <div>
          <InputRange
            className="form-control"
            maxValue={1000}
            minValue={0}
            value={imageHeight.value || 0}
            onChange={(comp, value)=>{
              imageHeight.value = value;
              flux.doAction('changeTemplate');
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>objectFit:<b>{image.value && image.value.objectFit}</b></label>
        <div>
          <div className="btn-group" role="group" aria-label="...">
            <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('objectFit','cover')}>cover
            </button>
            <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('objectFit','fill')}>fill
            </button>
            <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('objectFit','contain')}>
              contain
            </button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Border:</label>
      </div>
        <div className="form-group">
        <label>Width:<b>{borderWidth.value}</b></label><ResetButton item={borderWidth}/>

        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={borderWidth.value  || 0}
            onChange={(comp, value)=>{borderWidth.value = value}}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Radius:<b>{borderRadius.value}</b></label><ResetButton item={borderRadius}/>

        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={borderRadius.value || 0}
            onChange={(comp, value)=>{borderRadius.value = value}}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Color:</label><ResetButton item={borderColor}/>
        <div>
          <ColorPicker animation="slide-up"
                       color={(borderColor.value && borderColor.value.color) || DEFAULT_COLOR}
                       alpha={(borderColor.value && borderColor.value.alpha)}
                       onChange={(value)=>{borderColor.value = value}}/>

        </div>
      </div>

    </div>);
  }
};

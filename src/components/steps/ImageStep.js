import React from 'react';
import {Binder} from 'react-binding';
import InputRange from 'react-input-range';
import ResetButton from '../controls/ResetButton';
import ColorPicker from 'react-color';

const popupPosition = {
  position: 'relative',
  top: '0px',
  left: '0px',
};
export default class ImageStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }
  changeProp(prop, propValue) {
    Binder.bindTo(Binder.bindTo(this.props.wizardData, 'template.image'), prop).value = propValue;
  }

  render() {
    var image = Binder.bindTo(this.props.wizardData, 'template.image').value;

    var imageWidth = Binder.bindTo(this.props.wizardData, 'template.image.width');
    var imageHeight = Binder.bindTo(this.props.wizardData, 'template.image.height');

    var borderWidth = Binder.bindTo(this.props.wizardData, 'template.image.border.width');
    var borderRadius = Binder.bindTo(this.props.wizardData, 'template.image.border.radius');
    var borderColor = Binder.bindTo(this.props.wizardData, 'template.image.border.color');
    return (<div>

      <div className="form-group">
        <label>Width:<b>{imageWidth.value}</b></label><ResetButton item={imageWidth}/>

        <div>
          <InputRange
            className="form-control"
            maxValue={1000}
            minValue={0}
            value={imageWidth.value || 0}
            onChange={(comp, value)=>{imageWidth.value = value}}
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
            onChange={(comp, value)=>{imageHeight.value = value}}
          />
        </div>
      </div>
      <div className="form-group">
        <label>objectFit:<b>{image.objectFit}</b></label>
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
        <div style={{border:'1px solid black',width:100,height:25,backgroundColor:image.border.color}} onClick={this.handleClick}>

        </div>

        <div>
          <ColorPicker positionCSS={popupPosition} display={this.state.displayColorPicker} color={borderColor.value}
                       onChange={(value)=>{borderColor.value = "#" + value.hex}} type="sketch"/>
        </div>
      </div>

    </div>);
  }
};

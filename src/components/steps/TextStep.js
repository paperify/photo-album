import React from 'react';
import Binder from 'react-binding';
import InputRange from 'react-input-range';
import ResetButton from '../controls/ResetButton';
import ColorPicker from 'react-colors-picker';
import flux from 'fluxify';

import SelectValue from '../utils/SelectValue';

const DEFAULT_COLOR = "#ff0a0a";
const FONT_FAMILY_OPTIONS = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Open Sans',
  'Roboto',
  'Lato',
  'Oswald',
  'Slabo',
  'Courgette',
  'Great Vibes',
  'Patrick Hand',
  'Indie Flower',
  'Lobster',
  'Poiret One'
].map(function(item){return {value:item,label:item}});



export default class TextStep extends React.Component {
  render() {
    var font = Binder.bindTo(this.props.wizardData, 'styles.text.font');

    var fontFamily = Binder.bindTo(font, 'fontFamily');
    var fontSize = Binder.bindTo(font, 'fontSize');
    var fontColor = Binder.bindTo(font, 'color');

    var fontBold = Binder.bindTo(font, 'bold');
    var fontItalic = Binder.bindTo(font, 'italic');
    var fontUnderline = Binder.bindTo(font, 'underline');

    return (<div>

      <div className="form-group">
        <label>Font:<b>{fontFamily.value}</b></label><ResetButton item={fontFamily}/>
        <div>
          <SelectValue options={FONT_FAMILY_OPTIONS} value={fontFamily.value}
            onChange={(selectedValue)=>{fontFamily.value = selectedValue}}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Size:<b>{fontSize.value}</b></label><ResetButton item={fontSize}/>

        <div>
          <InputRange
            className="form-control"
            maxValue={50}
            minValue={5}
            value={fontSize.value || 0}
            onChange={(comp, value)=>{fontSize.value = value}}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Font style:</label>
        <div>
          <div className="btn-group" role="group" aria-label="...">
            <button type="button" className="btn btn-primary" onClick={()=>{fontBold.value = !fontBold.value}}>B
            </button>
            <button type="button" className="btn btn-primary" onClick={()=>{fontItalic.value = !fontItalic.value}}>I
            </button>
            <button type="button" className="btn btn-primary" onClick={()=>{fontUnderline.value = !fontUnderline.value}}>_
            </button>
          </div>
        </div>
      </div>


      <div className="form-group">
        <label>Color:</label><ResetButton item={fontColor}/>
        <div>
          <ColorPicker animation="slide-up"
                       color={(fontColor.value && fontColor.value.color) || DEFAULT_COLOR}
                       alpha={(fontColor.value && fontColor.value.alpha)}
                       onChange={(value)=>{fontColor.value = value}}/>

        </div>
      </div>

    </div>);
  }
};

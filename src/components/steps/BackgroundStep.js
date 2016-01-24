import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs,Tab,TabList,TabPanel} from 'react-tabs';
import _ from 'lodash';
import flux from 'fluxify';
import Binder from 'react-binding';
import InputRange from 'react-input-range';
import ColorPicker from 'react-colors-picker';
import ReactGradientColorPicker from 'react-gradient-color-picker';

import SelectValue from '../utils/SelectValue';
import ImageStore from '../../stores/imageStore';
import ResetButton from '../controls/ResetButton';

const DEFAULT_COLOR = "#ff0a0a";
const OPTIONS = [
  {label: 'horizontal', value: 'top'},
  {label: 'vertical', value: 'left'},
  {label: 'diagonal 45%', value: '45deg'},
  {label: 'diagonal -45%', value: '-45deg'},
  {label: 'radial', value: 'center, ellipse cover'}
];
const DEFAULT_STOPS = [
  {
    "offset": 0,
    "color": "#00f"
  },
  {
    "offset": 0.5,
    "color": "#aaa"
  },
  {
    "offset": 1,
    "color": "#f00"
  }];

export default class BackgroundStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedIndex: 0}
  }

  isBackgroundSet() {
    return Binder.bindTo(this.props.wizardData, 'styles.background').value !== undefined;
  }

  getTabStyle(selected) {
    if (selected) return {marginTop: 20};
    return {display: 'none'};
  }

  render() {
    var bgColor = Binder.bindTo(this.props.wizardData, 'styles.background.color');
    var bgGradient = Binder.bindTo(this.props.wizardData, 'styles.background.gradient');

    return (<div>
      {this.isBackgroundSet() ? <span className="pull-right glyphicon glyphicon-remove" aria-hidden="true"
                                      onClick={()=> { Binder.bindTo(this.props.wizardData, 'styles.background').value = undefined}}></span> : null}

      <ul className="nav nav-tabs">
        <li role="presentation" className={this.state.selectedIndex===0?'active':null}
            onClick={()=>{this.setState({selectedIndex :0})}}><a>Images</a></li>
        <li role="presentation" className={this.state.selectedIndex===1?'active':null}
            onClick={()=>{this.setState({selectedIndex :1})}}><a>Colors</a></li>
        <li role="presentation" className={this.state.selectedIndex===2?'active':null}
            onClick={()=>{this.setState({selectedIndex :2})}}><a>Effects</a></li>
      </ul>


      <div style={this.getTabStyle(this.state.selectedIndex===0)}>
        <BackgroundImage background={Binder.bindTo(this.props.wizardData,'styles.background')}
                         backgroundImage={Binder.bindTo(this.props.wizardData,'styles.background.image')}/>
      </div>
      <div style={this.getTabStyle(this.state.selectedIndex===1)}>
        <div className="form-group">
          <label>Color</label><ResetButton item={bgColor}/>
          <div>
            <ColorPicker animation="slide-up"
                         color={(bgColor.value && bgColor.value.color) || DEFAULT_COLOR}
                         alpha={(bgColor.value && bgColor.value.alpha)}
                         onChange={(value)=>{bgColor.value = value}}/>

          </div>
        </div>
      </div>
      <div style={this.getTabStyle(this.state.selectedIndex===1)}>
        <div className="form-group">
          <label>Gradient</label><ResetButton item={bgGradient}/>
          <div>
            <SelectValue options={OPTIONS} value={bgGradient.value && bgGradient.value.orientation}
                         onChange={(selectedValue) => {
                         bgGradient.value = _.extend(_.clone(bgGradient.value) || {}, {orientation: selectedValue});
                         }}/>
            <div>
              <ReactGradientColorPicker width={200} stops={(bgGradient.value && bgGradient.value.stops) || DEFAULT_STOPS} onChange={(stops) => {
              bgGradient.value = _.extend(_.clone(bgGradient.value) || {}, {stops: stops});
            }}/>
            </div>
          </div>
        </div>
      </div>
      <div style={this.getTabStyle(this.state.selectedIndex===2)}>
        <BackgroundEffectsStep filter={Binder.bindTo(this.props.wizardData,'styles.background.filter')}/>
      </div>
    </div>)
  }
}

class BackgroundImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      customImage: false
    };
  }

  //shouldComponentUpdate(nextProps,nextState) {
  //  return this.props.backgroundImage !== nextProps.backgroundImage || this.state.images !== nextState.images || this.state.customImage !== nextState.customImage;
  //}

  componentDidMount() {
    var me = this;
    ImageStore.on('change:images', function (value) {
      me.setState({
        images: value
        //    loaded: true
      });
    });
  }

  changeProp(prop, propValue) {
    Binder.bindTo(this.props.background, prop).value = propValue;
  }

  render() {
    var backgroundImage = this.props.backgroundImage;
    var background = this.props.background.value;
    return <div>
      <div className="form-group">
        <label>Image:</label><ResetButton item={backgroundImage}/>
        <div>
          {!!backgroundImage.value ? <img src={backgroundImage.value} style={{width:100, height:50}}/> : 'None'}

        </div>
      </div>
      <div className="form-group">
        <label>Size:<b>{background.size}</b></label>
        <div className="btn-group" role="group" aria-label="...">
          <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('size','cover')}>cover</button>
          <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('size','contain')}>contain
          </button>
          <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('size','auto')}>auto</button>
        </div>
      </div>
      <div className="form-group">
        <label>Repeat:<b>{background.repeat}</b></label>
        <div className="btn-group" role="group" aria-label="...">
          <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('repeat','repeat')}>repeat
          </button>
          <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('repeat','no-repeat')}>
            no-repeat
          </button>
        </div>
      </div>
      <div className="checkbox">
        <label>
          <input type="checkbox" onChange={(e)=> {this.setState({customImage:e.target.checked})}}/> Custom image
        </label>
      </div>
      {this.state.customImage ? <div className="input-group">
        <input ref="imageUrl" type="text" className="form-control" placeholder="custom image url"/>
            <span className="input-group-btn">
            <button className="btn btn-default" type="button"
                    onBlur={()=>{backgroundImage.value = ReactDOM.findDOMNode(this.refs.imageUrl).value}}>
              Load
            </button>
          </span>
      </div> : null}

      <div className="form-group">
        <div className="input-group">
          <input ref="searchInput" type="text" className="form-control" placeholder="Search for..."/>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button"
                    onClick={(e) => {flux.doAction('search',ReactDOM.findDOMNode(this.refs.searchInput).value)}}>
              Search
            </button>
          </span>
        </div>
      </div>

      <div style={{display:'flex',flexWrap:'wrap'}}>
        {this.state.images.map(function (image, i) {
          return <img key={'image' + i} src={image.thumbnailLink}
                      onClick={()=> {this.props.backgroundImage.value = image.url}}/>
        }, this)}
      </div>
    </div>
  }
}

class BackgroundEffectsStep extends React.Component {
  render() {
    var blur = Binder.bindTo(this.props.filter, 'blur');
    var brightness = Binder.bindTo(this.props.filter, 'brightness');
    var contrast = Binder.bindTo(this.props.filter, 'contrast');
    var grayscale = Binder.bindTo(this.props.filter, 'grayscale');
    var hueRotate = Binder.bindTo(this.props.filter, 'hueRotate');
    var opacity = Binder.bindTo(this.props.filter, 'opacity');
    var saturate = Binder.bindTo(this.props.filter, 'saturate');


    return (<div>

      <div className="form-group">
        <label>Blur</label><ResetButton item={blur}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={blur.value}
            onChange={(comp, value)=> {
      blur.value = value
    }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Brightness</label><ResetButton item={brightness}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={brightness.value}
            onChange={(comp, value)=> {
      brightness.value = value
    }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Contrast</label><ResetButton item={contrast}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={contrast.value}
            onChange={(comp, value)=> {
      contrast.value = value
    }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Grayscale</label><ResetButton item={grayscale}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={grayscale.value}
            onChange={(comp, value)=> {
      grayscale.value = value
    }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Hue</label><ResetButton item={hueRotate}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={hueRotate.value}
            onChange={(comp, value)=> {
      hueRotate.value = value
    }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Opacity</label><ResetButton item={opacity}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={opacity.value}
            onChange={(comp, value)=> {
      opacity.value = value
    }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Saturation</label><ResetButton item={saturate}/>
        <div>
          <InputRange
            className="form-control"
            maxValue={100}
            minValue={0}
            value={saturate.value}
            onChange={(comp, value)=> {
      saturate.value = value
    }}
          />
        </div>
      </div>

    </div>)
  }
}

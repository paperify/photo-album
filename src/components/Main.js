require('normalize.css');
require('styles/App.css');
require('styles/react-input-range.css');
require('styles/prog-tracker.css');

import React from 'react';
import {ImageGallery} from './layout/ImageGallery';
import {Binder} from 'react-binding';
import _ from 'lodash';
import SplitPane from 'react-split-pane';
import flux from 'fluxify';

//steps
import SelectGalleryStep from './steps/SelectGalleryStep';
import PageSizeStep from './steps/PageSizeStep';
import BackgroundStep from './steps/BackgroundStep';
import PageLayoutStep from './steps/PageLayoutStep';
import SummaryStep from './steps/SummaryStep';
import FinishStep from './steps/FinishStep';
import ImageStep from './steps/ImageStep';
import SplashScreenStep from './steps/SplashScreen';
//
import PhotoStore from '../stores/photoStore';
import UserLogin from './login/UserLogin';
import ImageGalleryView from './page/ImageGalleryView';

import WizardData from './utils/wizardData';

let paperifyLogo = require('../images/paperify-logo-48.png');


const stepsLength = 5;

function getNavStates(indx, length) {
  let styles = []
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push('done')
    }
    else if (i === indx) {
      styles.push('doing')
    }
    else {
      styles.push('todo')
    }
  }
  return {current: indx, styles: styles}
}

class AppComponent extends  React.Component
{
  constructor(props){
    super(props);

    this.state = {
      loaded: false,
      wizardData: WizardData.default,
      compState: 0,
      navState: getNavStates(0, stepsLength)
    };
  }
  setNavState(next) {
    this.setState({navState: getNavStates(next,stepsLength)});
    if (next < stepsLength) {
      this.setState({compState: next})
    }
  }

  handleOnClick(evt) {
    if (evt.target.value === stepsLength - 1 &&
      this.state.compState === stepsLength - 1) {
      this.setNavState(stepsLength);
    }
    else {
      this.setNavState(evt.target.value);
    }
  }

  handleKeyDown(evt) {
    if (evt.which === 13) {
      this.setNavState(this.state.compState + 1);
    }
  }

  componentDidMount() {
    var me = this;

    PhotoStore.on('change:privateAlbums', function (value) {
      me.setState({
        albums: value
        //    loaded: true
      });
    });

    PhotoStore.on('change:selectedAlbum', function (value) {

      me.setState({
        selectedAlbum: value
      });
    });
    PhotoStore.on('change:albumChanged', function (value) {
      me.setNavState(1);
    });
  }

  createSchema(){
    var galleryName = !!this.state.selectedAlbum?this.state.selectedAlbum:"ImageGallery";
    var gallery = new ImageGallery(galleryName, this.state.selectedAlbum.photos, this.state.wizardData.template, this.state.wizardData.pageOptions);
    return gallery.generate();

  }
  generatePdf(){
    flux.doAction('generateAlbum',this.state.selectedAlbum,this.state.wizardData,'pdf');
  }
  render() {
    var wizardData = Binder.bindToState(this,'wizardData');
    var steps = [
      {name: 'Select album', component: <SplashScreenStep albums={this.state.albums}  wizardData={wizardData}/>},
      {name: 'Layout', component: <SelectGalleryStep wizardData={wizardData}/>},
      //{name: 'Page size', component: <PageSizeStep wizardData={wizardData}/>},
      {name: 'Background', component: <BackgroundStep wizardData={wizardData}/>},
      //{name: 'Layout', component: <PageLayoutStep wizardData={wizardData}/>},
      {name: 'Image', component: <ImageStep wizardData={wizardData}/>},
      {name: 'Finish', component: <FinishStep wizardData={wizardData} album={this.state.selectedAlbum}/>}
    ];

    return (
      <div>
        <SplitPane split="horizontal" defaultSize={70} minSize="50">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',width:'100%'}}>
            <div style={{marginLeft:20}}>
              <img src={paperifyLogo} alt="PAPERIFY" onClick={this.generatePdf.bind(this)}/>
            </div>
            <div >

              <div onKeyDown={this.handleKeyDown.bind(this)}>
                <ol className="progtrckr">{
                  steps.map((s, i) =>
                    <li value={i} key={i}
                        className={"progtrckr-" + this.state.navState.styles[i]}
                        onClick={this.handleOnClick.bind(this)}>
                      <em>{i + 1}</em>
                      <span>{steps[i].name}</span>
                    </li>
                  )}
                </ol>
              </div>


            </div>
            <div>{!!this.state.selectedAlbum ? this.state.selectedAlbum.name : 'No album selected'}</div>
            <div className="pull-right">
              <UserLogin />
            </div>
          </div>
          {!(this.state.compState === 0 || this.state.compState ===  stepsLength -1)?
            <SplitPane split="vertical" defaultSize={350} minSize="200">
              <div style={{margin:10}}>{steps[this.state.compState].component}</div>
              <div style={{margin:5}}>{this.state.selectedAlbum === undefined ? "Select album first" :<ImageGalleryView pageOptions={this.state.wizardData.pageOptions} template={this.state.wizardData.template} photos={this.state.selectedAlbum.photos} />}</div>
            </SplitPane> :
            steps[this.state.compState].component
          }
        </SplitPane>


      </div>
    );


  }
};

AppComponent.defaultProps = {
};

export default AppComponent;

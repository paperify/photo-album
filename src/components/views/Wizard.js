import React from 'react';
import {ImageGallery} from '../layout/ImageGallery';
import Binder from 'react-binding';
import _ from 'lodash';
//import SplitPane from 'react-split-pane';
import flux from 'fluxify';

//steps
import SelectGalleryStep from '../steps/TemplateStep';
import PageSizeStep from '../steps/PageSizeStep';
import BackgroundStep from '../steps/BackgroundStep';
import PageLayoutStep from '../steps/PageLayoutStep';
import SummaryStep from '../steps/SummaryStep';
import ImageStep from '../steps/ImageStep';
import TextStep from '../steps/TextStep';
import PhotoStep from '../steps/PhotoStep';

//stores
import PhotoStore from '../../stores/photoStore';

import UserLogin from '../login/UserLogin';
import ImageGalleryView from '../page/ImageGalleryView';

import WizardData from '../utils/wizardData';

import Brand from '../utils/brand';

import {toData} from '../utils/repeatTemplate';


const stepsLength = 6;

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

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //selectedAlbum: PhotoStore.selectedAlbum,
      loaded: false,
      wizardData: PhotoStore.wizardData,
      schema: PhotoStore.schema,
      selectedAlbum: PhotoStore.selectedAlbum,
      compState: 0,
      navState: getNavStates(0, stepsLength)
    };
  }

  setNavState(next) {
    this.setState({navState: getNavStates(next, stepsLength)});
    if (next < stepsLength) {
      this.setState({compState: next})
    }
  }

  handleOnClick(i) {
    if (i === stepsLength - 1 &&
      this.state.compState === stepsLength - 1) {
      this.setNavState(stepsLength);
    }
    else {
      this.setNavState(i);
    }
  }

  handleKeyDown(evt) {
    if (evt.which === 13) {
      this.setNavState(this.state.compState + 1);
    }
  }

  generatePdf() {
    flux.doAction('generateAlbum','pdf');
  }

  componentDidMount() {
    var me = this;

    PhotoStore.on('change:schema', function (value) {
      me.setState({
        schema: value
      });
    });

    PhotoStore.on('change:wizardData', function (value) {
      me.setState({
        wizardData: value
      });
    });
  }

  render() {
    if (this.state.schema === undefined) return <div>Loading...</div>;

    var data = toData(this.state.schema, this.state.wizardData.photos);

    var dataContext = Binder.bindToState({state: {data: data}}, 'data');
    var wizardData = Binder.bindToState(this, 'wizardData');

    var steps = [
      {name: 'Layout', component: <SelectGalleryStep wizardData={wizardData}/>},
      {name: 'Photos', component: <PhotoStep wizardData={wizardData}/>},
      //{name: 'Page size', component: <PageSizeStep wizardData={wizardData}/>},
      {name: 'Background', component: <BackgroundStep wizardData={wizardData}/>},
      //{name: 'Layout', component: <PageLayoutStep wizardData={wizardData}/>},
      {name: 'Image', component: <ImageStep wizardData={wizardData}/>},
      {name: 'Text', component: <TextStep wizardData={wizardData}/>},
      {name: 'Finish', component: <SummaryStep wizardData={wizardData} album={this.state.selectedAlbum}/>}
    ];


    return (
      <div className="container-fluid">

          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <ul className="nav navbar-nav">
                <li>
                  <Brand />
                </li>
              </ul>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav nav-wizard" style={{float:'left', marginTop:'6'}}>{
                  steps.map((s, i) =>
                    <li key={i}>
                      <a onClick={this.handleOnClick.bind(this,i)}>{steps[i].name}</a>
                    </li>
                  )}
                </ul>

                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <a href="#/htmlBook"><span className="glyphicon glyphicon-blackboard" aria-hidden="true"></span></a>
                  </li>
                  <li>
                    <a onClick={()=>{flux.doAction('generateAlbum',"pdf")}}><span className="glyphicon glyphicon-print"
                                                                                  aria-hidden="true"></span></a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        <div style={{paddingTop:70}}>
          <div className="row">
            <div className="col-sm-4 col-md-2">{steps[this.state.compState].component}</div>
            <div className="col-sm-8 col-md-10">{this.state.schema === undefined ? "No album selected" :
              <ImageGalleryView schema={this.state.schema} pageOptions={this.state.wizardData.pageOptions}
                                wizardData={this.state.wizardData} dataContext={dataContext}/>}</div>
          </div>
        </div>
      </div>
    );
  }
};

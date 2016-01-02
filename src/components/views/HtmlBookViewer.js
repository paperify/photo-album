import React from 'react';
import flux from 'fluxify';
import {ImageGallery} from '../layout/ImageGallery';
import HtmlBookRenderer from '../page/HtmlBookRenderer';
import ImageBox from '../widgets/ImageBox';
import HtmlBox from '../widgets/HtmlBox';

import PhotoStore from '../../stores/photoStore';
import Brand from '../utils/brand';

var Widgets = {
  'Core.ImageBox': ImageBox,
  'Core.HtmlBox': HtmlBox
};

class HtmlBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAlbum: PhotoStore.selectedAlbum,
      wizardData: PhotoStore.wizardData
    };
  }

  componentDidMount() {
    var me = this;
    PhotoStore.on('change:selectedAlbum', function (value) {
      me.setState({
        selectedAlbum: value
        //    loaded: true
      });
    });
  }

  render() {
    var album = this.state.selectedAlbum;
    var wizardData = this.state.wizardData;
    var galleryName = !!album ? album.name : "ImageGallery";

    var gallery = new ImageGallery(galleryName, album.photos, wizardData.template, wizardData.pageOptions);
    return (<div style={{paddingBottom:10,paddingLeft:10,paddingRight:10}}><HtmlBookRenderer widgets={Widgets}
                                                                                             schema={gallery.generate()}
                                                                                             data={{}}
                                                                                             pageOptions={wizardData.pageOptions}/>
    </div>)
  }
}
;

export default class HtmlBookViewer extends React.Component {
  render() {
    return <div>
      <header>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <ul className="nav navbar-nav">
              <li>
                <Brand />
              </li>
            </ul>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#/wizard"><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                </li>
                <li>
                  <a href="#/book"><span className="glyphicon glyphicon-share" aria-hidden="true"></span></a>
                </li>
                <li>
                  <a onClick={()=>{flux.doAction('generateAlbum',undefined,undefined,"pdf")}} ><span className="glyphicon glyphicon-print" aria-hidden="true"></span></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div style={{paddingTop:70}}>
        <HtmlBook/>
      </div>
    </div>
  }
}

import React from 'react';
import {ImageGallery} from '../layout/ImageGallery';
import HtmlBookRenderer from '../page/HtmlBookRenderer';
import ImageBox from '../widgets/ImageBox';
import HtmlBox from '../widgets/HtmlBox';

var Widgets = {
  'Core.ImageBox':ImageBox,
  'Core.HtmlBox':HtmlBox
};


export default class FinishStep extends React.Component {

  render() {
    var album = this.props.album;
    var wizardData = this.props.wizardData.value;
    var galleryName = !!album ? album : "ImageGallery";

    var gallery = new ImageGallery(galleryName, album.photos, wizardData.template, wizardData.pageOptions);
   return ( <HtmlBookRenderer widgets={Widgets} schema={gallery.generate()} data={{}}
                        pageOptions={wizardData.pageOptions} />)
  }
};

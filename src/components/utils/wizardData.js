import PageSizes from './standardPageSizes';
import GraficUtil from './graphicUtil';

const DEFAULT_FLEX_ITEM:IFlexItem = {
  order: 0,
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'flex-start',
  alignSelf: 'flex-start'
};
const DEFAULT_FLEX_CONTAINER:IFlexContainerTemplate = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'flex-start',
  alignContent: 'stretch'
};

var defaultWizardData = function(imageSize)
{
  var imagesPerPage = 3;
  if (imageSize === 'middle') imagesPerPage = 8;
  if (imageSize === 'small') imagesPerPage = 36;
  if (imageSize === 'mini') imagesPerPage = 58;
  return {
    imageSize: imageSize,
    template: {
      layout: {
        Container: DEFAULT_FLEX_CONTAINER,
        Item: DEFAULT_FLEX_ITEM
      },
      image:{
        border:{
          width:0,
          radius:0,
          color:'#000000',
          style:'solid'
        }
      },
      text:{
        font: {
          fontFamily: 'Arial',
          fontSize: 10,
          color: '#ffffff',
          bold: true,
          italic: true
        }
      }
    },
    pageOptions: {
      width: GraficUtil.pointToPixel(PageSizes.A4[0]),
      height: GraficUtil.pointToPixel(PageSizes.A4[1]),
      imagesPerPage: imagesPerPage,
      background:{
        image:'http://www.designbolts.com/wp-content/uploads/2013/02/Floral-Grey-Seamless-Pattern-For-Website-Background.jpg',
        size:'cover'
      },
    }
  }
};

export default {
  default:defaultWizardData('original'),
  small:defaultWizardData('small'),
  mini:defaultWizardData('mini'),
  middle:defaultWizardData('middle')
};

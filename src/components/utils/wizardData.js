import PageSizes from './standardPageSizes';
import GraficUtil from './graphicUtil';

const DEFAULT_FLEX_ITEM:IFlexItem = {
  order: 0,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 'auto',
  alignSelf: 'flex-start'
};
const DEFAULT_FLEX_CONTAINER:IFlexContainerTemplate = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
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
    templateName:'WordsAndImages',
    template: {
      imagesPerPage: imagesPerPage,
      double:true,
      useImageAsBackground:true,
      useCoverPage:false,
      layout: {
        Container: DEFAULT_FLEX_CONTAINER,
        Item: DEFAULT_FLEX_ITEM
      },
      image:{

      }
    },
    styles:{
      //background:{
      //  image:'https://static.pexels.com/photos/8703/sky-space-moon-outdoors.jpg',
      //  size:'cover'
      //},
      image:{
        border:{
        }
      },
      text:{
        font: {
          color:{color:'#ffffff'}
        }
      }
    },
    pageOptions: {
      width: GraficUtil.pointToPixel(PageSizes.A4[0]),
      height: GraficUtil.pointToPixel(PageSizes.A4[1])
    }
  }
};

export default {
  default:defaultWizardData('original'),
  small:defaultWizardData('small'),
  mini:defaultWizardData('mini'),
  middle:defaultWizardData('middle')
};

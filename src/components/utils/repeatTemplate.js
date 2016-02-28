import _ from 'lodash';
import traverse from 'traverse';
import convertToHash from './convertToHash';

const BINDING_KEY = "images";

const bindTo = function(self, x,index){
  if (!!x && (x ===  BINDING_KEY ||( x.length > 6 && x.substr(0, 6) === BINDING_KEY))) {
    var newPath = `t${index}.${x}`;
    //console.log(newPath);
    self.update(newPath);
  }
}

const findMaxImageIndex = function(page) {
  var indexes = [];
  traverse(page).reduce(function (acc,x) {
    if (this.key === "path" && !!x) {
      var pos = x.indexOf(BINDING_KEY + ".");
      if (pos !== -1) acc.push(parseInt(x.substr(pos).split('.')[1], 10));
    }
    return acc;
  },indexes);
  return _.max(indexes);
}

export function toData(schema,wizardData,useCoverPage){
  var photos = wizardData.photos;
  var defaultData = schema.props && schema.props.defaultData || {};
  var templateImageCount = (defaultData.images && defaultData.images.length) || 0;

  var data = _.omit(defaultData,'images');
  var groupImages = _.chunk(photos, templateImageCount);
  for (var i = 0; i !== groupImages.length; i++) {
    var images = groupImages[i];

    data['t' + i] = {images: convertToHash(images)};
  }
  return _.extend(data,{album:wizardData.album});
}

export function toSchema(schema,photos,useCoverPage) {

  let templatePages = _.cloneDeep(schema.containers);

  schema.containers = [];
  if (useCoverPage) {
    let coverPage = _.cloneDeep(templatePages[0]);
    traverse(coverPage).forEach(function (x) {
      if (this.key === "path") {
        bindTo(this, x, 0);
      }
    });
    schema.containers = [coverPage]
  }

  //templatePages = _.rest(templatePages);
  //var pageCount = schema.containers.length;
  var imageCount = photos.length;
  var templateImageCount = (schema.props.defaultData && schema.props.defaultData.images.length) || 0;
  console.log("ImageCount:" + templateImageCount);


  var groupImages = _.chunk(photos, templateImageCount);
  for (var i = 0; i !== groupImages.length; i++) {
    //var images = groupImages[i];
    //
    //data['t' + i] = {images:convertToHash(images)};

    var pages = _.cloneDeep(templatePages);

    traverse(pages).forEach(function (x) {
        if (this.key === "path") {
          bindTo(this,x,i);
        }
      });

    var lastItem = i === groupImages.length-1;
    _.each(pages,function(page,index){

      //last group
      if (!(lastItem && findMaxImageIndex(page) >=  imageCount))  schema.containers.push(page);
    });
    imageCount -= templateImageCount;
  }


  return schema;
}



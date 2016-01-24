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

export function toData(photos, templateImageCount){
  var data = {};
  var groupImages = _.chunk(photos, templateImageCount);
  for (var i = 0; i !== groupImages.length; i++) {
    var images = groupImages[i];

    data['t' + i] = {images: convertToHash(images)};
  }
  return data;
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

  templatePages = _.rest(templatePages);
  //var pageCount = schema.containers.length;
  //var imageCount = photos.length;
  var templateImageCount = schema.props.defaultData && schema.props.defaultData.images.length;



  var groupImages = _.chunk(photos, templateImageCount);
  for (var i = 0; i !== groupImages.length -1; i++) {
    //var images = groupImages[i];
    //
    //data['t' + i] = {images:convertToHash(images)};

    var pages = _.cloneDeep(templatePages);

    traverse(pages).forEach(function (x) {
        if (this.key === "path") {
          bindTo(this,x,i);
        }
      });

    _.each(pages,function(page,index){
      schema.containers.push(page)
    });
  }


  return schema;
}



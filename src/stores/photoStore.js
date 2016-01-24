import flux from 'fluxify';
import {ImageGallery} from '../components/layout/ImageGallery';
import _ from 'lodash';
import WizardData from '../components/utils/wizardData';
import GraphicUtil from '../components/utils/graphicUtil';
import { createHashHistory } from 'history';
import {toSchema} from '../components/utils/repeatTemplate';

var WordsAndImages = require("json!./templates/Words and images.json");
var WordsAndImages2 = require("json!./templates/Words and images 2.json");

//const history = createHistory();
//console.log(browserHistory);
let history = createHashHistory();
var url = 'http://photo-papermill.rhcloud.com';
//var url = 'http://render-pergamon.rhcloud.com';
//var url = 'http://localhost:8080';

var reloadAlbum = function (url, imageSize, successCallback) {

  $.ajax({
    dataType: 'jsonp',
    url: url,
    data: {
      alt: 'json-in-script'
    },
    jsonpCallback: 'picasaCallback',
    success: function (data) {
      var photos = [];
      var counter = 0;
      $.each(data.feed.entry, function () {

        var newImage;
        if (imageSize === undefined || imageSize === 'original') {
          newImage = this.media$group.media$content[0];
        }
        else {
          var size;
          switch (imageSize) {
            case "small":
              size = 1;
              break;
            case "middle":
              size = 2;
              break;
            default:
              size = 0;
              break;

          }
          newImage = this.media$group.media$thumbnail[size];
        }
        var desc = this.media$group.media$description.$t;
        var title = this.media$group.media$title.$t;
        var thumbnail =  this.media$group.media$thumbnail[1].url;

        if (!!title) newImage =  _.extend(newImage,{id:counter++,description:desc,thumbnailUrl:thumbnail, title:title.substr(0,title.indexOf('.'))});
        photos.push(newImage);

      });
      successCallback(photos);
    },
    error: function () {
      alert("failed");
    }
  })
}
var getSchema = function(templateName, photos, coverPage){
  var template = _.cloneDeep(photoStore.templates[templateName]);
  return toSchema(template,photos,coverPage);
};
var generateSchema = function(photos,wizardData){
  var gallery = new ImageGallery("ImageGallery",photos, wizardData.template, wizardData.pageOptions);
  return gallery.generate();
}

var i=0;
var photoStore = flux.createStore({
  id: 'photoStore',
  initialState: {
    wizardData: WizardData.default,
    history:history,
    templates:{
      WordsAndImages:WordsAndImages,
      WordsAndImages2:WordsAndImages2
    },
    templateName:'WordsAndImages'
  },
  actionCallbacks: {
    userLoaded: function (updater, currentUser) {
      if (currentUser === undefined) {
        updater.set({privateAlbums: undefined,user: undefined});
        return;
      }


      var url = 'https://picasaweb.google.com/data/feed/api/user/' + currentUser.id;
      $.ajax({
        dataType: 'jsonp',
        url: url,
        data: {
          alt: 'json-in-script'
        },
        jsonpCallback: 'picasaCallback',
        success: function (data) {
          var photos = [];
          var albums = [];
          $.each(data.feed.entry, function (item) {
            albums.push({
              name: this.title.$t,
              url: this.link[0].href,
              coverImageUrl: this.media$group.media$content[0].url
            });
            //console.log(item);

          });
          updater.set({privateAlbums: albums, user: currentUser});
          //console.log(albums);
        },
        error: function () {
          alert("failed");
        }
      })
      //console.log(currentUser);

    },

    selectAlbum: function (updater, album) {
      var templateKey = photoStore.templateName;
      var wizardData = photoStore.wizardData;

      reloadAlbum(album.url, 'original', (photos) => {
        wizardData.photos = photos;
        updater.set({
          selectedAlbum: _.extend(_.clone(album), {photos: photos}),
          wizardData: wizardData,
          schema:templateKey === "None"?generateSchema(photos,wizardData): getSchema(templateKey, photos,wizardData.template && wizardData.template.useCoverPage)
        })
      });
    },
    changeTemplate: function (updater,templateKey ) {
      if (templateKey === undefined) templateKey = photoStore.templateName || "None";

      var album = photoStore.selectedAlbum;
      var wizardData = photoStore.wizardData;
      updater.set({
        templateName:templateKey,
        schema: templateKey === "None"?generateSchema(album.photos,wizardData): getSchema(templateKey, album.photos, wizardData.template && wizardData.template.useCoverPage)
      })
    },
    changeImageSize: function (updater, imageSize) {
      var templateKey = photoStore.templateName;
      var wizardData = photoStore.wizardData;
      var album = photoStore.selectedAlbum;

      reloadAlbum(album.url, imageSize, (photos) => {
        updater.set({
          selectedAlbum: _.extend(_.clone(album), {photos: photos}),
          schema:templateKey === "None"?generateSchema(photos,wizardData): getSchema(templateKey, photos,wizardData.template && wizardData.template.useCoverPage)
        })
      });
    },
    generateAlbum(updater,item,wizardData,type){
      if (item === undefined) item = photoStore.selectedAlbum;
      if (wizardData === undefined) wizardData = photoStore.wizardData;
      if (type === undefined) type = "pdf";
      var album = item;

      //var photos = album.photos;
      reloadAlbum(album.url, wizardData.imageSize, (photos) => {

        var imageGallery = new ImageGallery(album.name, photos, wizardData.template, wizardData.pageOptions);
        var contentType = 'image/' + type;
        if (type === "pdf") contentType = 'application/pdf';

        //var name = this.context.router.getCurrentParams().name;

        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", url + '/' + type);

        //xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.responseType = 'arraybuffer';

        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var blob = new Blob([xmlhttp.response], {type: contentType});
            var fileURL = URL.createObjectURL(blob);
            window.open(fileURL);
          }
        };

        var pageOptions = _.extend(_.clone(wizardData.pageOptions),{
          height: GraphicUtil.pixelToPoint(wizardData.pageOptions.height),
          width: GraphicUtil.pixelToPoint(wizardData.pageOptions.width)
        });
        xmlhttp.send(JSON.stringify(_.extend(imageGallery.generate(), {
          pageOptions: pageOptions
        })));
      });
    },
    generatePages(updater,item,wizardData,type){
      if (type === undefined) type = "png";
      var album = item;

      //var photos = album.photos;
      reloadAlbum(album.url, wizardData.imageSize, (photos) => {

        var imageGallery = new ImageGallery(album.name, photos, wizardData.template, wizardData.pageOptions);
        //var contentType = 'image/' + type;
        //if (type === "pdf") contentType = 'application/pdf';

        //var name = this.context.router.getCurrentParams().name;

        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", url + '/' + type);

        //xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var pages = JSON.parse(xmlhttp.response);
            updater.set({pages:pages})
          }
        };

        var pageOptions = _.extend(_.clone(wizardData.pageOptions),{
          height: GraphicUtil.pixelToPoint(wizardData.pageOptions.height),
          width: GraphicUtil.pixelToPoint(wizardData.pageOptions.width)
        });
        xmlhttp.send(JSON.stringify(_.extend(imageGallery.generate(), {
          pageOptions: pageOptions
        })));
      });
    },
    loadTemplate:function(updater){

    }
  }
});
export default photoStore;
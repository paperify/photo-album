import flux from 'fluxify';
import {ImageGallery} from '../components/layout/ImageGallery';
import _ from 'lodash';
import WizardData from '../components/utils/wizardData';
import GraphicUtil from '../components/utils/graphicUtil';
import { createHashHistory } from 'history';
import {toSchema,toData} from '../components/utils/repeatTemplate';
import wizardStyles from '../components/utils/wizardStyles';

//const history = createHistory();
//console.log(browserHistory);
let history = createHashHistory();
//var url = 'http://photo-papermill.rhcloud.com';
//var url = 'http://render-pergamon.rhcloud.com';
var url = 'http://localhost:8080';

var reloadAlbum = function (url, imageSize, successCallback) {
  if (url.indexOf('Orchard') !== -1){reloadOrchardAlbum(url,successCallback)}
  else reloadPicasaAlbum(url,imageSize,successCallback);
}

var reloadPicasaAlbum = function (url, imageSize, successCallback) {

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
var reloadOrchardAlbum = function (url, successCallback) {

  $.ajax({
    type: "GET",
    dataType: 'json',
    url: url,
    success: function (data) {
      var photos = [];
      var counter = 0;
      $.each(data, function (index,item) {

        var url = item.Url;
        var newImage  =  {url:url, width:item.Width, height:item.Height};
        var desc = item.Description;
        var title = item.Title;
        var thumbnail =  url;

        newImage =  _.extend(newImage,{id:counter++,description:desc,thumbnailUrl:thumbnail, title:title});
        photos.push(newImage);

      });
      successCallback(photos);
    },
    error: function (xhr, ajaxOptions, thrownError) {
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
//var dataServiceUrl = "http://localhost:8080";
var dataServiceUrl = url;//'http://photo-papermill.rhcloud.com';

var photoStore = flux.createStore({
  id: 'photoStore',
  initialState: {
    dataServiceUrl: dataServiceUrl,
    wizardData: WizardData.default,
    history:history,
    templates:{
      WordsAndImages:require("json!./templates/Words and images.json"),
      RedAndWhite:require("json!./templates/ReadAndWhite.json"),
      YellowAndBlack: require("json!./templates/YellowAndBlack.json")
    }
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
          $.ajax({
            type: "GET",
            url: dataServiceUrl + "/users?authId=" + currentUser.id,
            dataType: 'json',
            success: function (data) {
              console.log(data);
              var exists = data !== undefined && data.length === 1;
              var myUrl = dataServiceUrl + "/users";
              if (exists) myUrl +="/" + data[0]._id;
              $.ajax({
                type: exists?"PUT":"POST",
                url: myUrl,
                data:  {authId:currentUser.id,name:currentUser.name},
                dataType: 'json',
                success: function (data) {
                  updater.set({owner:data});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                  alert("failed");
                }
              })

            },
            error: function (xhr, ajaxOptions, thrownError) {
              alert("failed");
            }
          })
          //console.log(albums);
        },
        error: function () {
          alert("failed");
        }
      })
      //console.log(currentUser);

    },
    publish:function(updater){
      var state = photoStore.getState();
      var album = state.selectedAlbum;
      var wizardData = state.wizardData;
      var schemaData = toData(state.schema,wizardData);
      var schema = _.cloneDeep(state.schema);

      //apply wizard styles to schema
      wizardStyles(schema,state.wizardData && state.wizardData.styles);
      var owner = state.owner;
      $.ajax({
        type: "POST",
        url: dataServiceUrl + "/docs",
        data:{schemaTemplate:JSON.stringify(schema), data:schemaData, customData:wizardData,name:album.name, owner:owner._id},
        dataType: 'json',
        //contentType: 'application/json',
        success: function (data) {
          updater.set({
            published:{name:data.name,url: 'http://rsamec.github.io/react-html-pages-renderer/#/' + "/book/" + data._id}
          })
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert("failed");
        }
      })
    },
    selectAlbum: function (updater, album, templateName) {
      if (templateName === undefined) templateName = photoStore.templateName || "None";

      var wizardData = _.extend(photoStore.wizardData,{templateName:templateName});
      reloadAlbum(album.url, 'original', (photos) => {
        wizardData.photos = photos;
        wizardData.album = album;
        //wizardData.owner = photoStore.owner;
        wizardData.user =
        updater.set({
          selectedAlbum: _.extend(_.clone(album),{photos:photos}),
          wizardData: wizardData,
          templateName:templateName,
          schema:templateName === "None"?generateSchema(photos,wizardData): getSchema(templateName, photos,wizardData.template && wizardData.template.useCoverPage)
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
    generateAlbum(updater,type){
      if (type === undefined) type = "pdf";
      var wizardData = photoStore.wizardData;
      var schema = _.cloneDeep(photoStore.schema);

      //apply wizard styles to schema
      wizardStyles(schema,wizardData && wizardData.styles);

      var data = toData(schema,wizardData);

      var contentType = 'image/' + type;
      if (type === "pdf") contentType = 'application/pdf';

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

      var pageOptions = _.extend(_.clone(wizardData.pageOptions), {
        height: GraphicUtil.pixelToPoint(wizardData.pageOptions.height),
        width: GraphicUtil.pixelToPoint(wizardData.pageOptions.width)
      });
      xmlhttp.send(JSON.stringify(_.extend(schema, {
        pageOptions: pageOptions,
        data:data
      })));
    },
    generatePages(updater,type){
      if (type === undefined) type = "png";
      var wizardData = photoStore.wizardData;
      var schema = _.cloneDeep(photoStore.schema);

      //apply wizard styles to schema
      wizardStyles(schema, wizardData && wizardData.styles);

      var data = toData(schema,wizardData);

      var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
      xmlhttp.open("POST", url + '/' + type);

      //xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var pages = JSON.parse(xmlhttp.response);
          updater.set({pages: pages})
        }
      };

      var pageOptions = _.extend(_.clone(wizardData.pageOptions), {
        height: GraphicUtil.pixelToPoint(wizardData.pageOptions.height),
        width: GraphicUtil.pixelToPoint(wizardData.pageOptions.width)
      });
      xmlhttp.send(JSON.stringify(_.extend(schema, {
        pageOptions: pageOptions,
        data:data
      })));
    }
  }
});
export default photoStore;

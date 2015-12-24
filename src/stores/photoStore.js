import flux from 'fluxify';
import {ImageGallery} from '../components/layout/ImageGallery';
import _ from 'lodash';
import GraphicUtil from '../components/utils/graphicUtil';
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
        var title = this.media$group.media$description.$t;

        if (!!title) newImage =  _.extend(newImage,{title:title});
        photos.push(newImage);

      });
      successCallback(photos);
    },
    error: function () {
      alert("failed");
    }
  })
}
var i=0;
var photoStore = flux.createStore({

  id: 'formStore',
  initialState: {
    publicAlbums: [],
    privateAlbums: []
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
      reloadAlbum(album.url, 'original', (photos) => {
        updater.set({
          selectedAlbum: _.extend(_.clone(album), {photos: photos}),
          albumChanged:++i
        })
      });
    },
    changeImageSize: function (updater, imageSize) {
      var album = photoStore.selectedAlbum;
      reloadAlbum(album.url, imageSize, (photos) => {
        updater.set({
          selectedAlbum: _.extend(_.clone(album), {photos: photos})
        })
      });
    },
    generateAlbum(updater,item,wizardData,type){
      if (type === undefined) type = "pdf";
      var album = item;

      //var photos = album.photos;
      reloadAlbum(album.url, wizardData.imageSize, (photos) => {

        var imageGallery = new ImageGallery(album.name, photos, wizardData.template, wizardData.pageOptions);
        var contentType = 'image/' + type;
        if (type === "pdf") contentType = 'application/pdf';
        var url = 'http://photo-papermill.rhcloud.com';
        //var url = 'http://render-pergamon.rhcloud.com';
        //var url = 'http://localhost:8080';
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
    }
  }
});
export default photoStore;

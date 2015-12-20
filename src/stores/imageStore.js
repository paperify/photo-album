import flux from 'fluxify';
import _ from 'lodash';

var store = flux.createStore({
  id: 'imageStore',
  initialState: {
    images: []
  },
  actionCallbacks: {
    search: function (updater, searchQuery) {
      var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyD1NLIIueiYHQFwOVpDUt5BHrGQ8YLOam0&cx=013133484689616380753:1ti_xbmcf6k&searchType=image&fileType=jpg,png&q=' + searchQuery;
      $.ajax({
        dataType: 'json',
        url: url,
        //data: {
        //  alt: 'json-in-script'
        //},
        //jsonpCallback: 'picasaCallback',
        success: function (data) {
          var images = [];
          $.each(data.items, function (index,item) {
            images.push(_.extend(item.image,{url:item.link}));
          });
          updater.set({images:images});
        },
        error: function () {
          alert("failed");
        }
      })
    }
  }
});
export default store;

import {indexBy, reduce,chunk,map,clone,extend,cloneDeep,merge,filter,each,omit} from 'lodash';
import FlexLayout, {IFlexContainer} from "./FlexLayout";
import * as computeLayout from 'css-layout';
import {IFlexLayoutTemplate} from "./FlexLayout";
import {GrowingPacker,Packer}  from 'binpacking';

//var GrowingPacker = binpacking.GrowingPacker;
interface IStyle {
    top?:number
    left?:number
    width?:number
    height?:number
}
interface IImage{
    url:string
    width?:number
    height?:number
    description?:string
    title?:string
}

interface INode {
    generate(layout:any):any;
}
interface ISize{
  width?:number;
  height?:number;
}
interface IPageOptions extends  ISize{
}
interface ITemplate{
  imagesPerPage?:number;
  double?:boolean;
  useImageAsBackground?:boolean;
  useCoverPage?:boolean;
  layout:any;
  image:ISize;
}

const IMAGES_PER_PAGE:number = 3;
export class ImageGallery implements INode {

  ImagesPerPage:number;
  ImageBoxes:Array<ImageBox> = [];
  HtmlBoxes:Array<HtmlBox> = [];


  constructor(public name:string, public images:Array<IImage>, public Template:ITemplate, public PageOptions?:IPageOptions) {
    if (this.PageOptions === undefined) this.PageOptions = {};

    this.ImagesPerPage = Template.imagesPerPage || IMAGES_PER_PAGE;
    this.ImageBoxes = images.map(function (image, index) {
      return new ImageBox(image)
    });

  }

  generate() {
    var doublePage = this.Template.double;
    var coverPage = this.Template.useCoverPage;

    var chunkedImages = chunk(this.ImageBoxes, this.ImagesPerPage);

    var pages = [];
    for (var i = 0; i !== chunkedImages.length; i++) {
      var images = chunkedImages[i];
      images = images.sort(function (a, b) {
        return a.Image.description && a.Image.description.length > b.Image.description && b.Image.description.length ? -1 : 1
      });
      if (doublePage) {
        pages.push(new Array(images[0]));
        if (images.length > 1) pages.push(images.slice(1));

      }
      else {
        pages.push(images);
      }
    };


    var lastItem;
    var items = this.Template.useImageAsBackground ? pages.map(function (images, index) {
      //take first image as background
      if (doublePage && index % 2 !== 0) return {background: lastItem};
      lastItem = {image: images[0].Image.url, size:'cover', repeat:'no-repeat'};
      return {background: lastItem}
    }, this) : [];

    if (doublePage) items = map(items,function (item, i) {
        return {
          background: extend(clone(item.background),
            {
              size: i % 2 === 0 ? 'leftHalf' : 'rightHalf'
            }
          )
        }
      },this);


    var schema = {
      name: this.name,
      elementName: "ObjectSchema",
      props: {
        defaultData: {
          images: reduce(this.images, function (map, obj, index) {
            map[index] = obj;
            return map;
          }, {}),
        }
      },
      containers: pages.map(function (images, index) {
        if (doublePage && index % 2 === 0) return new EmptyContainer(`Page ${index}`, images[0].Image.description, items[index] && items[index].background, this.Template, this.PageOptions);
        return new ImageContainer(!this.Template.useImageAsBackground || doublePage ? images : images.slice(1), items[index] && items[index].background, this.Template, this.PageOptions)
      }, this).map(function (item) {
        return item.generate()
      })
    };
    if (coverPage) schema.containers.unshift(new EmptyContainer(this.name, this.name, undefined,this.Template, this.PageOptions).generate());


    return schema;
  }
}


class EmptyContainer{

  constructor(public title:string,public description:string,private background:any, public Template, public PageOptions:any){

  }
  generate() {
    var titleBox = new HtmlBox(this.title);
    var desBox = new HtmlBox(this.description);
    return {
      name: "ImageContainer",
      elementName: "Container",
      style: {
        width:this.PageOptions.width - (50),
        height:this.PageOptions.height - (50)
      },
      props:{
        unbreakable:true,
        background:this.background
      },
      boxes:[titleBox.generate({top:20,left:100,}),
        desBox.generate({top:600,left:100,width:600})
      ]

    }
  }

}
class ImageContainer{
    public FlexContainer:IFlexContainer;
    LayoutTemplate:IFlexLayoutTemplate;

    constructor (private images:Array<ImageBox>,private background:any, public Template, public PageOptions:any)
    {
      this.LayoutTemplate = Template.layout;
      this.FlexContainer = new FlexLayout(this.LayoutTemplate).getContainer(images.length);
    }

    generate() {

      var styles = [];
      if (false) {
        //var packer = new Packer(this.PageOptions.width - 50,this.PageOptions.height - 50);
        var packer = new GrowingPacker(this.PageOptions.width - 50,this.PageOptions.height - 50);
        var blocks = map(this.images,function(item){return {w:item.Image.width, h:item.Image.height}});
        blocks.sort(function(a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); }); // sort inputs for best results
        packer.fit(blocks);
        //console.log(blocks);
        styles = map(blocks,function(block){return {width:block.w, height:block.h, top: block.fit.y, left: block.fit.x}})
      }
      else {
        var input = this.FlexContainer;
        var imageWidth = undefined;
        var imageHeight = undefined;
        var nodeInput = {
          //width:this.PageOptions.width,
          //height:this.PageOptions.height,
          style: {
            width: this.PageOptions.width - 50,
            height: this.PageOptions.height - 50,
            //position:'relative',
            flexDirection: input.flexDirection,
            flexWrap: input.flexWrap,
            justifyContent: input.justifyContent,
            alignItems: input.alignItems,
            alignContent: input.alignContent
          },
          children: map(input.items, function (item, i) {
            var image = this.images[i].Image;
            var newItem:any = {
                //position: 'relative',
              //margin: 5
            };
            if (!!image.width) newItem.width = imageWidth || image.width;
            if (!!image.height) newItem.height = imageHeight || image.height;
            return {style: extend(newItem, item)}

          }, this)
        }


        //console.log(nodeInput);
        computeLayout(nodeInput);

        styles= map(nodeInput.children,function(item){return extend(item.layout,{})});
      }
      //console.log(nodeInput);
      //console.log(JSON.stringify(nodeInput,null,4));
        return {
            name: "ImageContainer",
            elementName: "Container",
            style: {
                width:this.PageOptions.width - (50),
                height:this.PageOptions.height - (50)
            },
            props:{
                unbreakable:true,
                background:this.background
            },
            boxes:this.images.map(function(item:INode,i:number){return item.generate(styles[i])})
        }
    }
}
class HtmlBox implements INode {
  constructor (public content:string){

  }
  generate(style:any){
    return {
      name: "Text",
      elementName: "Core.HtmlContent",
      style: style,
      props: {
        content: this.content,
      }
    }
  }
}

class ImageBox implements INode {
    constructor (public Image:IImage){

    }
    generate(style:any){
        return {
            name: "Image",
            elementName: "Core.SmartImageBox",
            style: style,
            props: {
              url: this.Image.url,
              caption: this.Image.title !== undefined && this.Image.title.length > 10 ? this.Image.title.substr(0, 10) : undefined,
              description: this.Image.description,
              width: this.Image.width,
              height: this.Image.height
              //clipPath:'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)'
            }
        }
    }
}

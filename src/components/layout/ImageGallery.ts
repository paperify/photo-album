import {chunk,map,clone,extend,cloneDeep,merge,filter} from 'lodash';
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
    title?:number
}

interface INode {
    generate(layout:any):any;
}
interface IPageOptions {
    imagesPerPage?:number;
    double:boolean;
    useImageAsBackground:boolean;

    width?:number;
    height?:number;
    background?:any;
}

const IMAGES_PER_PAGE:number = 3;
export class ImageGallery implements INode  {


    ImagesPerPage:number;
    ImageBoxes:Array<ImageBox> = [];
    HtmlBoxes:Array<HtmlBox> = [];


    constructor(public name: string, images:Array<IImage>,public Template:any, public PageOptions?:IPageOptions) {
        if (this.PageOptions === undefined) this.PageOptions = {};

        this.ImagesPerPage = this.PageOptions.imagesPerPage || IMAGES_PER_PAGE;
        this.ImageBoxes = images.map(function(image,index){
            return new ImageBox(image, Template.image)
        });

    }
    generate() {
        var doublePage = this.PageOptions.double;


        var chunkedImages = chunk(this.ImageBoxes,this.ImagesPerPage);

        var pages = [];
        for (var i = 0;i!== chunkedImages.length;i++){
          var images =chunkedImages[i];
          images = images.sort(function(a,b){return  a.Image.title && a.Image.title.length >  b.Image.title && b.Image.title.length?-1:1});
          if (doublePage) {
            pages.push(new Array(images[0]));
            if (images.length > 1) pages.push(images.slice(1));

          }
          else{
            pages.push(images);
          }
        };


        var lastItem;
        var items = this.PageOptions.useImageAsBackground? pages.map(function(images,index){
          //take first image as background
          if (doublePage && index % 2 !== 0) return {background:lastItem};
          lastItem = merge(cloneDeep(this.PageOptions.background),{image:images[0].Image.url});
          return {background:lastItem }
        },this):[];


        return {
            name:this.name,
            elementName:"ObjectSchema",
            props:{
                background:this.PageOptions.background,
                items:items
            },
            containers: pages.map(function(images,index){
                if (doublePage && index % 2 === 0) return new EmptyContainer(`Page ${index}`,images[0].Image.title,this.Template,this.PageOptions);
                return new ImageContainer(!this.PageOptions.useImageAsBackground || doublePage?images:images.slice(1),this.Template,this.PageOptions)
            },this).map(function(item){return item.generate()})
        }
    }
}


class EmptyContainer{

  constructor(public title:string,public description:string, public Template, public PageOptions:any){

  }
  generate() {
    var titleBox = new HtmlBox(this.title,this.Template.text);
    var desBox = new HtmlBox(this.description,this.Template.text);
    return {
      name: "ImageContainer",
      elementName: "Container",
      style: {
        width:this.PageOptions.width - (50),
        height:this.PageOptions.height - (50)
      },
      props:{
        unbreakable:true

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
    ImageTemplate:any;
    TextTemplate:any;

    constructor (private images:Array<ImageBox>, public Template, public PageOptions:any)
    {
      this.LayoutTemplate = Template.layout;
      this.ImageTemplate = Template.image;
      this.TextTemplate = Template.text;


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
        var imageWidth = this.ImageTemplate.width;
        var imageHeight = this.ImageTemplate.height;
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
              margin: 5
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
                unbreakable:true
            },
            boxes:this.images.map(function(item:INode,i:number){return item.generate(styles[i])}).concat(
              this.images.map(function(item,i:number){
                var style = styles[i];
                return new HtmlBox(item.Image.title,this.TextTemplate).generate({zIndex:2,top:style.top + style.height,left:style.left,width:style.width})},this)
            )
        }
    }
}
class HtmlBox implements INode {
  constructor (public description:string, public DefaultProps:any){

  }
  generate(style:any){
    return {
      name: "Text",
      elementName: "Core.HtmlBox",
      style: style,
      props: merge({
        content: this.description,
      },this.DefaultProps)
    }
  }
}

class ImageBox implements INode {
    constructor (public Image:IImage, public DefaultProps:any){

    }
    generate(style:any){
        return {
            name: "Image",
            elementName: "Core.ImageBox",
            style: style,
            props: merge({
                url: this.Image.url,
                border:{
                    width:1,
                    radius:10
                },
                //titlePosition:'bottom',
                //title:this.Image.title,
                width:this.Image.width,
                height:this.Image.height,
                //clipPath:'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)'
            },this.DefaultProps)
        }
    }
}

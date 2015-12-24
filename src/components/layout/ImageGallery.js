var lodash_1 = require('lodash');
var FlexLayout_1 = require("./FlexLayout");
var computeLayout = require('css-layout');
var binpacking_1 = require('binpacking');
var IMAGES_PER_PAGE = 3;
var ImageGallery = (function () {
    function ImageGallery(name, images, Template, PageOptions) {
        this.name = name;
        this.Template = Template;
        this.PageOptions = PageOptions;
        this.ImageBoxes = [];
        this.HtmlBoxes = [];
        if (this.PageOptions === undefined)
            this.PageOptions = {};
        this.ImagesPerPage = this.PageOptions.imagesPerPage || IMAGES_PER_PAGE;
        this.ImageBoxes = images.map(function (image, index) {
            return new ImageBox(image, Template.image);
        });
    }
    ImageGallery.prototype.generate = function () {
        var doublePage = this.PageOptions.double;
        var chunkedImages = lodash_1.chunk(this.ImageBoxes, this.ImagesPerPage);
        var pages = [];
        for (var i = 0; i !== chunkedImages.length; i++) {
            var images = chunkedImages[i];
            images = images.sort(function (a, b) { return a.Image.title && a.Image.title.length > b.Image.title && b.Image.title.length ? -1 : 1; });
            if (doublePage) {
                pages.push(new Array(images[0]));
                if (images.length > 1)
                    pages.push(images.slice(1));
            }
            else {
                pages.push(images);
            }
        }
        ;
        var lastItem;
        var items = this.PageOptions.useImageAsBackground ? pages.map(function (images, index) {
            //take first image as background
            if (doublePage && index % 2 !== 0)
                return { background: lastItem };
            lastItem = lodash_1.merge(lodash_1.cloneDeep(this.PageOptions.background), { image: images[0].Image.url });
            return { background: lastItem };
        }, this) : [];
        var schema = {
            name: this.name,
            elementName: "ObjectSchema",
            props: {
                background: this.PageOptions.background,
                items: items
            },
            containers: pages.map(function (images, index) {
                if (doublePage && index % 2 === 0)
                    return new EmptyContainer("Page " + index, images[0].Image.title, this.Template, this.PageOptions);
                return new ImageContainer(!this.PageOptions.useImageAsBackground || doublePage ? images : images.slice(1), this.Template, this.PageOptions);
            }, this).map(function (item) { return item.generate(); })
        };
        schema.props.items.unshift({ background: {} });
        schema.containers.unshift(new EmptyContainer(name, "description", this.Template, this.PageOptions).generate());
        return schema;
    };
    return ImageGallery;
})();
exports.ImageGallery = ImageGallery;
var EmptyContainer = (function () {
    function EmptyContainer(title, description, Template, PageOptions) {
        this.title = title;
        this.description = description;
        this.Template = Template;
        this.PageOptions = PageOptions;
    }
    EmptyContainer.prototype.generate = function () {
        var titleBox = new HtmlBox(this.title, this.Template.text);
        var desBox = new HtmlBox(this.description, this.Template.text);
        return {
            name: "ImageContainer",
            elementName: "Container",
            style: {
                width: this.PageOptions.width - (50),
                height: this.PageOptions.height - (50)
            },
            props: {
                unbreakable: true
            },
            boxes: [titleBox.generate({ top: 20, left: 100 }),
                desBox.generate({ top: 600, left: 100, width: 600 })
            ]
        };
    };
    return EmptyContainer;
})();
var ImageContainer = (function () {
    function ImageContainer(images, Template, PageOptions) {
        this.images = images;
        this.Template = Template;
        this.PageOptions = PageOptions;
        this.LayoutTemplate = Template.layout;
        this.ImageTemplate = Template.image;
        this.TextTemplate = Template.text;
        this.FlexContainer = new FlexLayout_1["default"](this.LayoutTemplate).getContainer(images.length);
    }
    ImageContainer.prototype.generate = function () {
        var styles = [];
        if (false) {
            //var packer = new Packer(this.PageOptions.width - 50,this.PageOptions.height - 50);
            var packer = new binpacking_1.GrowingPacker(this.PageOptions.width - 50, this.PageOptions.height - 50);
            var blocks = lodash_1.map(this.images, function (item) { return { w: item.Image.width, h: item.Image.height }; });
            blocks.sort(function (a, b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); }); // sort inputs for best results
            packer.fit(blocks);
            //console.log(blocks);
            styles = lodash_1.map(blocks, function (block) { return { width: block.w, height: block.h, top: block.fit.y, left: block.fit.x }; });
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
                children: lodash_1.map(input.items, function (item, i) {
                    var image = this.images[i].Image;
                    var newItem = {
                        //position: 'relative',
                        margin: 5
                    };
                    if (!!image.width)
                        newItem.width = imageWidth || image.width;
                    if (!!image.height)
                        newItem.height = imageHeight || image.height;
                    return { style: lodash_1.extend(newItem, item) };
                }, this)
            };
            //console.log(nodeInput);
            computeLayout(nodeInput);
            styles = lodash_1.map(nodeInput.children, function (item) { return lodash_1.extend(item.layout, {}); });
        }
        //console.log(nodeInput);
        //console.log(JSON.stringify(nodeInput,null,4));
        return {
            name: "ImageContainer",
            elementName: "Container",
            style: {
                width: this.PageOptions.width - (50),
                height: this.PageOptions.height - (50)
            },
            props: {
                unbreakable: true
            },
            boxes: this.images.map(function (item, i) { return item.generate(styles[i]); }).concat(this.images.map(function (item, i) {
                var style = styles[i];
                return new HtmlBox(item.Image.title, this.TextTemplate).generate({ zIndex: 2, top: style.top + style.height, left: style.left, width: style.width });
            }, this))
        };
    };
    return ImageContainer;
})();
var HtmlBox = (function () {
    function HtmlBox(description, DefaultProps) {
        this.description = description;
        this.DefaultProps = DefaultProps;
    }
    HtmlBox.prototype.generate = function (style) {
        return {
            name: "Text",
            elementName: "Core.HtmlBox",
            style: style,
            props: lodash_1.merge({
                content: this.description
            }, this.DefaultProps)
        };
    };
    return HtmlBox;
})();
var ImageBox = (function () {
    function ImageBox(Image, DefaultProps) {
        this.Image = Image;
        this.DefaultProps = DefaultProps;
    }
    ImageBox.prototype.generate = function (style) {
        return {
            name: "Image",
            elementName: "Core.ImageBox",
            style: style,
            props: lodash_1.merge({
                url: this.Image.url,
                border: {
                    width: 1,
                    radius: 10
                },
                //titlePosition:'bottom',
                //title:this.Image.title,
                width: this.Image.width,
                height: this.Image.height
            }, this.DefaultProps)
        };
    };
    return ImageBox;
})();
//# sourceMappingURL=ImageGallery.js.map
var lodash_1 = require('lodash');
var FlexLayout_1 = require("./FlexLayout");
var computeLayout = require('css-layout');
var binpacking_1 = require('binpacking');
var IMAGES_PER_PAGE = 3;
var ImageGallery = (function () {
    function ImageGallery(name, images, Template, PageOptions) {
        this.name = name;
        this.images = images;
        this.Template = Template;
        this.PageOptions = PageOptions;
        this.ImageBoxes = [];
        this.HtmlBoxes = [];
        if (this.PageOptions === undefined)
            this.PageOptions = {};
        this.ImagesPerPage = Template.imagesPerPage || IMAGES_PER_PAGE;
        this.ImageBoxes = images.map(function (image, index) {
            return new ImageBox(image);
        });
    }
    ImageGallery.prototype.generate = function () {
        var doublePage = this.Template.double;
        var coverPage = this.Template.useCoverPage;
        var chunkedImages = lodash_1.chunk(this.ImageBoxes, this.ImagesPerPage);
        var pages = [];
        for (var i = 0; i !== chunkedImages.length; i++) {
            var images = chunkedImages[i];
            images = images.sort(function (a, b) {
                return a.Image.description && a.Image.description.length > b.Image.description && b.Image.description.length ? -1 : 1;
            });
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
        var items = this.Template.useImageAsBackground ? pages.map(function (images, index) {
            //take first image as background
            if (doublePage && index % 2 !== 0)
                return { background: lastItem };
            lastItem = { image: images[0].Image.url, size: 'cover', repeat: 'no-repeat' };
            return { background: lastItem };
        }, this) : [];
        if (doublePage)
            items = lodash_1.map(items, function (item, i) {
                return {
                    background: lodash_1.extend(lodash_1.clone(item.background), {
                        size: i % 2 === 0 ? 'leftHalf' : 'rightHalf'
                    })
                };
            }, this);
        var schema = {
            name: this.name,
            elementName: "ObjectSchema",
            props: {
                defaultData: {
                    images: lodash_1.reduce(this.images, function (map, obj, index) {
                        map[index] = obj;
                        return map;
                    }, {})
                }
            },
            containers: pages.map(function (images, index) {
                if (doublePage && index % 2 === 0)
                    return new EmptyContainer("Page " + index, images[0].Image.description, items[index] && items[index].background, this.Template, this.PageOptions);
                return new ImageContainer(!this.Template.useImageAsBackground || doublePage ? images : images.slice(1), items[index] && items[index].background, this.Template, this.PageOptions);
            }, this).map(function (item) {
                return item.generate();
            })
        };
        if (coverPage)
            schema.containers.unshift(new EmptyContainer(this.name, this.name, undefined, this.Template, this.PageOptions).generate());
        return schema;
    };
    return ImageGallery;
})();
exports.ImageGallery = ImageGallery;
var EmptyContainer = (function () {
    function EmptyContainer(title, description, background, Template, PageOptions) {
        this.title = title;
        this.description = description;
        this.background = background;
        this.Template = Template;
        this.PageOptions = PageOptions;
    }
    EmptyContainer.prototype.generate = function () {
        var titleBox = new HtmlBox(this.title);
        var desBox = new HtmlBox(this.description);
        return {
            name: "ImageContainer",
            elementName: "Container",
            style: {
                width: this.PageOptions.width - (50),
                height: this.PageOptions.height - (50)
            },
            props: {
                unbreakable: true,
                background: this.background
            },
            boxes: [titleBox.generate({ top: 20, left: 100 }),
                desBox.generate({ top: 600, left: 100, width: 600 })
            ]
        };
    };
    return EmptyContainer;
})();
var ImageContainer = (function () {
    function ImageContainer(images, background, Template, PageOptions) {
        this.images = images;
        this.background = background;
        this.Template = Template;
        this.PageOptions = PageOptions;
        this.LayoutTemplate = Template.layout;
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
                children: lodash_1.map(input.items, function (item, i) {
                    var image = this.images[i].Image;
                    var newItem = {};
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
                unbreakable: true,
                background: this.background
            },
            boxes: this.images.map(function (item, i) { return item.generate(styles[i]); })
        };
    };
    return ImageContainer;
})();
var HtmlBox = (function () {
    function HtmlBox(content) {
        this.content = content;
    }
    HtmlBox.prototype.generate = function (style) {
        return {
            name: "Text",
            elementName: "Core.HtmlContent",
            style: style,
            props: {
                content: this.content
            }
        };
    };
    return HtmlBox;
})();
var ImageBox = (function () {
    function ImageBox(Image) {
        this.Image = Image;
    }
    ImageBox.prototype.generate = function (style) {
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
            }
        };
    };
    return ImageBox;
})();
//# sourceMappingURL=ImageGallery.js.map
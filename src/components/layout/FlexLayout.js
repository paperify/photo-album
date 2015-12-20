var lodash_1 = require('lodash');
var flexDirectionEnum;
(function (flexDirectionEnum) {
    flexDirectionEnum[flexDirectionEnum["row"] = 0] = "row";
    flexDirectionEnum[flexDirectionEnum["column"] = 1] = "column";
})(flexDirectionEnum || (flexDirectionEnum = {}));
;
var FlexLayout = (function () {
    function FlexLayout(Template) {
        this.Template = Template;
    }
    FlexLayout.prototype.getItem = function () {
        return lodash_1.clone(this.Template.Item);
    };
    FlexLayout.prototype.getContainer = function (items) {
        return lodash_1.extend({
            items: lodash_1.map(lodash_1.range(0, items), function () {
                return this.getItem();
            }, this)
        }, this.Template.Container);
    };
    return FlexLayout;
})();
exports["default"] = FlexLayout;
//# sourceMappingURL=FlexLayout.js.map
import {map,range,extend,clone} from 'lodash';

enum flexDirectionEnum {row,column};

export interface IFlexLayoutTemplate {
    Container:IFlexContainerTemplate;
    Item:IFlexContainerTemplate;
}
export interface IFlexContainerTemplate {
    flexDirection:  string
    flexWrap:       string,
    justifyContent: string,
    alignItems:     string,
    alignContent:   string,
}

export interface IFlexContainer extends IFlexContainerTemplate {
    items:Array<IFlexItem>
}

export interface IFlexItem {
    order:  number
    flexGrow:    number,
    flexShrink: number,
    flexBasis:     string,
    alignSelf:   string

}

export default class FlexLayout {



    constructor(public Template:IFlexLayoutTemplate) {


    }

    getItem():IFlexItem {
        return clone(this.Template.Item);
    }

    getContainer(items:number):IFlexContainer {
        return extend({
            items: map(range(0, items), function () {
                return this.getItem()
            }, this)
        }, this.Template.Container);
    }
}

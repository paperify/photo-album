import React from 'react';
import Binder from 'react-binding';
import flux from 'fluxify';
import _ from 'lodash';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  up(){
    var photos = this.props.itemSource;
    var items = photos.items;
    var index =  _.findIndex(items,function(item){return  item.value.id===this.state.selected},this);
    if (index === -1) return;
    photos.move(index, index + 1);
    //this.setState({selected:index+1});
  }
  down(){

    var photos = this.props.itemSource;
    var items = photos.items;
    var index = _.findIndex(items,function(item){return  item.value.id===this.state.selected},this);
    if (index === -1) return;
    photos.move(index, index - 1);
    //this.setState({selected:index-1});
  }
  render() {
    var items = this.props.itemSource.items;
    var itemElements = items.map(this.renderItem.bind(this));
    var canDown = items.length > 0? items[0].value.id !== this.state.selected:false;
    var canUp = items.length > 0?items[items.length - 1].value.id !== this.state.selected:false;

    return (
      <div>
        <div style={{position:'fixed',paddingLeft:200,zIndex:10, background:'#ffffff'}}>
          <button disabled={!canUp} type="button" className="btn btn-default" aria-label="Left Align"
                  onClick={this.up.bind(this)}>
            <span className="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span>
          </button>
          <button  disabled={!canDown} type="button" className="btn btn-default" aria-label="Left Align"
                  onClick={this.down.bind(this)}>
            <span className="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span>
          </button>
        </div>
        <div style={{paddingTop:40,float:'right'}}>
            {itemElements}
        </div>
      </div>
    );
  }

  renderItem(item, i) {
    return (
      <Item
        key={i}
        item={item}
        selected={this.state.selected === item.value.id}
        onSelect={this.setSelected.bind(this)}
        onRemove={this.remove.bind(this)}
      />
    );
  }

  setSelected(itemID) {
    this.setState({selected: itemID})
  }
  remove(item){
    this.props.itemSource.remove(item);
  }

  //onSelect(itemID) {
  //  var selected = this.state.selected;
  //  selected[itemID] = true;
  //  this.setState({selected: selected});
  //}
  //
  //onDeselect(itemID) {
  //  var selected = this.state.selected;
  //  delete selected[itemID];
  //  this.setState({selected: selected});
  //}
}
class Item extends React.Component {
  onChange(event, itemValue) {
    this.props.onSelect(itemValue.id);
  }

  render() {
    var item = this.props.item;
    var itemValue = item.value;
    var descValue =  _.trunc(itemValue.description, {'length': 50,'separator': ' '});

    var itemStyle = {borderTop: '2px solid gray'};
    if (this.props.selected) itemStyle.backgroundColor = "lightblue";
    return (
      <div style={itemStyle} onClick={(e) => {this.onChange(e,itemValue)}}>
        <table>
          <tbody>
          <tr>
            <td colSpan={2}>
              <div className="input-group">
                <input type="text"className="form-control" valueLink={Binder.bindTo(item,"title")}/>
                <div className="input-group-btn">
                  <button type="button" className="btn btn-default" aria-label="Left Align"
                          onClick={(e) => {this.props.onRemove(item.value)}}>
                    <span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <img src={itemValue.thumbnailUrl} style={{maxWidth:250}}/>
            </td>
            <td style={{verticalAlign:'top'}}>
              {descValue}
            </td>
          </tr>

          </tbody>
        </table>

      </div>
    );
  }
}
export default class PhotoStep extends React.Component {

  render() {
    var photos = Binder.bindArrayTo(this.props.wizardData, 'photos');

    return (<div>
      <List itemSource={photos} />
    </div>);
  }
};

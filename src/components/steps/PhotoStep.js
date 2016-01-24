import React from 'react';
import Binder from 'react-binding';
import flux from 'fluxify';

class List extends React.Component {


  constructor(props) {
    super(props);
    this.state = {selected: {}}
  }

  render() {
    var items = this.props.items.map(this.renderItem.bind(this));
    return (
      <ul>
        {items}
      </ul>
    );
  }

  renderItem(item, i) {
    return (
      <Item
        key={i}
        item={item}
        selected={!!this.state.selected[i]}
        onSelect={this.onSelect.bind(this)}
        onDeselect={this.onDeselect.bind(this)}/>
    );
  }

  onSelect(itemID) {
    var selected = this.state.selected;
    selected[itemID] = true;
    this.setState({selected: selected});
  }

  onDeselect(itemID) {
    var selected = this.state.selected;
    delete selected[itemID];
    this.setState({selected: selected});
  }
}
class Item extends React.Component {
  onChange(event, itemValue) {
    if (event.target.checked) {
      this.props.onSelect(itemValue.id);
    } else {
      this.props.onDeselect(itemValue.id);
    }
  }

  render() {
    var item = this.props.item;
    var itemValue = item.value;
    return (
      <div style={{border:'1px solid gray'}}>
        <table>
          <tbody>
          <tr>
            <td>
              <img src={itemValue.thumbnailUrl}/>
            </td>
            <td>
              <div className="input-group">
                <input type="text" className="form-control" valueLink={Binder.bindTo(item,"title")}/>
                <div className="input-group-btn">
                  <button type="button" className="btn btn-default" aria-label="Left Align"
                          onClick={()=>{photos.remove(item)}}>
                    <span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
              <input type="checkbox" checked={this.props.selected}
                     onChange={(e) => {this.onChange(e,itemValue)}}/>
              <span>{itemValue.description}</span>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    );
  }
}
export default class PhotoStep extends React.Component {
  onChange(event) {
    if (event.target.checked) {
      this.props.onSelect(this.item.id);
    } else {
      this.props.onDeselect(this.item.id);
    }
  }

  render() {
    var photos = Binder.bindArrayTo(this.props.wizardData, 'photos');

    return (<div>
      <div>
        Photos
      </div>
      <div>
        <List items={photos.items}/>
      </div>
    </div>);
  }
};

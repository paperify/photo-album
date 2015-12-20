import React from 'react';

export default class ResetButton extends React.Component {
  render() {
    var item = this.props.item;
    return <div className="pull-right">{item.value !== undefined ?
      <span className="glyphicon glyphicon-remove" aria-hidden="true"
            onClick={()=> {item.value = undefined}}></span> : null}</div>
  }
}

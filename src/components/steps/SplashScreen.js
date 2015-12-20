import React from 'react';
import flux from 'fluxify';
import WizardData from '../utils/wizardData';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

var popularGalleries = [
    {
        name: 'Words and images',
        url: 'https://picasaweb.google.com/data/feed/base/user/108972862430615180924/albumid/5672369010251685233',
        coverImageUrl: 'https://lh3.googleusercontent.com/m6hk6fRyPnO6duji5QTJna2ZEjL3G0Cr6JJ0srLcA24=w334-h222-p-no'
    },
    {
        name: 'Desert Southwest',
        url: 'https://picasaweb.google.com/data/feed/base/user/110466688127241330787/albumid/5708854250983217265',
        coverImageUrl: 'https://lh3.googleusercontent.com/_fXn1aw9KiHYFLHWiVew76-s13iF2ptLEM-Si7bqIpla=w344-h229-p-no'
    },
    {
        name: 'Google+ Cover Photos Gallery',
        url: 'https://picasaweb.google.com/data/feed/base/user/108972862430615180924/albumid/5893839506781107985',
        coverImageUrl: 'https://lh3.googleusercontent.com/060sxhBzanylB29dheLUVfIXBqfRCZxbBWFW7-FyB_QcmcvH-Bk=w317-h210-p-no'
    }

];
const Menu = React.createClass({
    displayName: "Menu",
    handleClick(data) {

        console.log(`Clicked on menu ${data.item} on ${data}`);
        flux.doAction('generateAlbum',data.name,WizardData[data.item],'pdf');
    },
    render() {
        return (
            <ContextMenu identifier="multi">
                <MenuItem onSelect={this.handleClick} data={{item: "default"}}>Original</MenuItem>
                <MenuItem onSelect={this.handleClick} data={{item: "middle"}}>Compact</MenuItem>
              <MenuItem onSelect={this.handleClick} data={{item: "small"}}>Small</MenuItem>
                <MenuItem onSelect={this.handleClick} data={{item: "small"}}>Mini</MenuItem>
            </ContextMenu>
        );
    }
});

const TRUNCATE_TITLE_LENGTH = 20;
class Tile extends React.Component {
    render() {
        var item = this.props.item;

        var title = item.name.length > TRUNCATE_TITLE_LENGTH ? item.name.substring(0, TRUNCATE_TITLE_LENGTH) + "..." : item.name;
        return (
            <div className="thumbnail" style={{margin:4}}>
                <img style={{maxHeight:200,maxWidth:300}} src={item.coverImageUrl} alt={item.name} onClick={() => {this.props.itemClick(item)}}/>
                <div className="caption">
                    <span style={{fontSize:30}} className="pull-right glyphicon glyphicon-th-list" aria-hidden="true"></span>
                    <h4 onClick={() => {this.props.itemClick(item)}}>{title}</h4>
                </div>
            </div>)
    }
}
const TileWithMenu =  ContextMenuLayer("multi", (props) => {
    return {
        name: props.name
    };
})(Tile);

export default class SplashScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showAlbumInput:false
        }
    }
    selectAlbum(item){
        flux.doAction('selectAlbum', item);
    }
    render(){
        var listStyle = {display: 'flex', flexWrap: 'wrap'};
        var noAlbums;
        if (this.props.albums === undefined) {
            noAlbums = "To see your albums, please connect with google account.";
        } else if (this.props.albums.length === 0) {
            noAlbums = "Oh, we have not found any your public albums.";
        }
        else {
            noAlbums = undefined;
        }
        return <div className="container">

            {this.state.showAlbumInput?
            <div style={{marginTop:30}} className="input-group">
                  <span className="input-group-btn">
                   <button className="btn btn-default" type="button">Help</button>
                </span>
                <input type="text" onBlur={(e) => this.selectAlbum({url:e.target.value,name:'Not specified'})} className="form-control" placeholder="Album url..."/>
                <span className="input-group-btn">
                   <button className="btn btn-default" type="button">Go!</button>
                </span>
            </div>:null
            }
            <a style={{margin:20}} className="pull-right" onClick={()=>{this.setState({showAlbumInput:!this.state.showAlbumInput})}}>{this.state.showAlbumInput?'hide album url':'show album url'}</a>
            <h3>Your albums</h3>
            {!!noAlbums ? noAlbums :
                <div style={listStyle}>
                    {
                        this.props.albums.map(function (item, index) {
                            return <TileWithMenu key={item.name + index} name={item} item={item} itemClick={this.selectAlbum}/>
                        }, this)
                    }

                </div>}
            <h3>Featured albums</h3>
            <div style={listStyle}>
                {
                    popularGalleries.map(function (item, index) {
                        return <TileWithMenu key={item.name + index} name={item} item={item} itemClick={this.selectAlbum}/>
                    }, this)
                }
            </div>
          { <Menu wizardData={this.props.wizardData} />}
        </div>

    }
};

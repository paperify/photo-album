import React from 'react';
import flux from 'fluxify';
import {ImageGallery} from '../layout/ImageGallery';

const iconStyle = {fontSize:30,marginLeft:10};
export default class SummaryStep extends React.Component {
  constructor(){
    super();
    this.state = {};
  }
  generate(type) {
    flux.doAction('generateAlbum', this.props.album, this.props.wizardData.value, type);
  }
  componentDidMount(){
    this.generateExport();
  }
  generateExport() {
    var album = this.props.album;
    var wizardData = this.props.wizardData.value;
    var galleryName = !!album ? album.name : "ImageGallery";
    var gallery = new ImageGallery(galleryName, album.photos, wizardData.template, wizardData.pageOptions);

    var exportSchema = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gallery.generate(), null, 2));
    var exportSchemaName = album.name;
    this.setState({
      exportSchema: exportSchema,
      exportSchemaName: exportSchemaName
    })
  }

  render() {
    return (<div>
      <h3>{this.state.exportSchemaName}</h3>
      <div>
        <h4>pdf</h4>
        <a onClick={()=>{this.generate('pdf')}}><span style={iconStyle} className="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>
      </div>
      <div>
        <h4>jpg</h4>
        <a onClick={()=>{this.generate('jpg')}}><span style={iconStyle} className="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>
      </div>
      <div>
        <h4>png</h4>
        <a onClick={()=>{this.generate('png')}}><span style={iconStyle} className="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>
      </div>
      <div>
        <h4>json</h4>
        <a href={this.state.exportSchema} target="new"><span style={iconStyle} className="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>
        <a href={this.state.exportSchema} download={this.state.exportSchemaName + ".json"}><span style={iconStyle}  className="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>
      </div>
      <pre>{JSON.stringify(this.props.wizardData.value,null,2)}</pre>

    </div>)
  }
};

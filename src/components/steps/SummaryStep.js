import React from 'react';
import flux from 'fluxify';

//stores
import PhotoStore from '../../stores/photoStore';


const iconStyle = {fontSize:30,marginLeft:10};
export default class SummaryStep extends React.Component {
  constructor(){
    super();
    this.state = {};
  }
  generate(type) {
    flux.doAction('generateAlbum',type);
  }
  componentDidMount(){
    this.generateJsonFiles();
  }
  generateJsonFiles() {
    var album = this.props.album;

    var exportSchema = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PhotoStore.schema, null, 2));
    var exportSchemaName = album.name;

    var exportWizardData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PhotoStore.wizardData, null, 2));
    var exportWizardDataName = album.name + "_data";

    this.setState({
      exportSchema: exportSchema,
      exportSchemaName: exportSchemaName,
      exportWizardData: exportWizardData,
      exportWizardDataName: exportWizardDataName
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
        <h4>Template</h4>
        <a href={this.state.exportSchema} target="new"><span style={iconStyle} className="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>
        <a href={this.state.exportSchema} download={this.state.exportSchemaName + ".json"}><span style={iconStyle}  className="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>
      </div>
      <div>
        <h4>Data</h4>
        <a href={this.state.exportWizardData} target="new"><span style={iconStyle} className="glyphicon glyphicon-new-window" aria-hidden="true"></span></a>
        <a href={this.state.exportWizardData} download={this.state.exportWizardDataName + ".json"}><span style={iconStyle}  className="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>
      </div>
    </div>)
  }
};

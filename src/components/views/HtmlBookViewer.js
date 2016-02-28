import React from 'react';
import Binder from 'react-binding';
import flux from 'fluxify';
import {ImageGallery} from '../layout/ImageGallery';
import HtmlPagesRenderer from 'react-html-pages-renderer';
import PhotoStore from '../../stores/photoStore';
import Brand from '../utils/brand';
import Widgets from '../page/WidgetFactory';
import {toData} from '../utils/repeatTemplate';
import convertToHash from '../utils/convertToHash';
import wizardStyles from '../utils/wizardStyles';
import Modal from 'react-modal';

class HtmlBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      schema: PhotoStore.schema,
      wizardData: PhotoStore.wizardData
    };
  }

  render() {
    var schema = this.state.schema;
    if (schema === undefined) return <div>Loading...</div>;

    schema = _.cloneDeep(this.state.schema);

    //apply wizard styles to schema

    wizardStyles(schema, this.state.wizardData && this.state.wizardData.styles);

    var data = toData(schema, this.state.wizardData);
    var dataContext = Binder.bindToState({state: {data: data}}, 'data');


    var pageOptions = this.state.wizardData && this.state.wizardData.pageOptions;

    return (<div style={{paddingBottom:10,paddingLeft:10,paddingRight:10}}>
      <HtmlPagesRenderer widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={pageOptions}
                         doublePage="true"/>
    </div>)
  }
}
;

export default class HtmlBookViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalIsOpen: false, published: false};
  }

  openModal() {
    this.setState({modalIsOpen: true, published: false});
    flux.doAction('publish');
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleModalCloseRequest() {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    var me = this;
    PhotoStore.on('change:published', function (value) {
      me.setState({modalIsOpen: true, published: true, publishInfo: value});
    });

  }

  render() {
    var published = this.state.published || false;
    var publishInfo = this.state.publishInfo || {};
    return <div>
      <header>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <ul className="nav navbar-nav">
              <li>
                <Brand />
              </li>
            </ul>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#/wizard"><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
                </li>
                <li>
                  <a onClick={this.openModal.bind(this)}><span className="glyphicon glyphicon-share"
                                                               aria-hidden="true"></span></a>
                </li>
                <li>
                  <a onClick={()=>{flux.doAction('generateAlbum',"pdf")}}><span className="glyphicon glyphicon-print"
                                                                                aria-hidden="true"></span></a>
                </li>
                <li>
                  <a onClick={()=>{flux.doAction('generateAlbum',"jpg")}}><span className="glyphicon glyphicon-eye-open"
                                                                                aria-hidden="true"></span></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div style={{paddingTop:70}}>
        <HtmlBook/>
      </div>
      <Modal
        className="Modal__Bootstrap modal-dialog"
        closeTimeoutMS={150}
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.handleModalCloseRequest.bind(this)}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.handleModalCloseRequest.bind(this)}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Publishing</h4>
          </div>
          <div className="modal-body">
            {published ?<div><h4>{publishInfo.name}</h4><a href={publishInfo.url}>{publishInfo.url}</a></div>:<span>Please, wait, publishing ...</span>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={this.handleModalCloseRequest.bind(this)}>Close
            </button>

          </div>
        </div>
      </Modal>
    </div>
  }
}
HtmlBookViewer.contextTypes = {
  history: React.PropTypes.object
};

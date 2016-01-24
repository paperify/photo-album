import React from 'react';
import Binder from 'react-binding';
import PageSizes from '../utils/standardPageSizes';

export default class PageLayoutStep extends React.Component
{
    changeProp(prop,propValue){
        Binder.bindTo(Binder.bindTo(this.props.wizardData, 'template.layout.Container'),prop).value = propValue;
    }
    render(){
        var layout = Binder.bindTo(this.props.wizardData, 'template.layout.Container').value;
        return (<div>

            <div className="form-group">
                <label>Direction:<b>{layout.flexDirection}</b></label>
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('flexDirection','row')}>row</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('flexDirection','column')}>column</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('flexDirection','row-reverse')}>row-reverse</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('flexDirection','column-reverse')}>column-reverse</button>
                </div>
            </div>
            <div className="form-group">
                <label>justify-content:<b>{layout.justifyContent}</b></label>
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('justifyContent','flex-start')}>start</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('justifyContent','flex-end')}>end</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('justifyContent','center')}>center</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('justifyContent','space-between')}>space-between</button>
                    <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('justifyContent','space-around')}>space-around</button>
                </div>
            </div>
            {/*
             <div className="form-group">
             <label>align-content:<b>{layout.alignContent}</b></label>
             <div className="btn-group" role="group" aria-label="...">
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignContent','stretch')}>stretch</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignContent','flex-start')}>start</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignContent','flex-end')}>end</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignContent','center')}>center</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignContent','space-between')}>space-between</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignContent','space-around')}>space-around</button>
             </div>
             </div>
             <div className="form-group">
             <label>align-items:<b>{layout.alignItems}</b></label>
             <div className="btn-group" role="group" aria-label="...">
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignItems','stretch')}>stretch</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignItems','flex-start')}>start</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignItems','flex-end')}>end</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignItems','center')}>center</button>
             <button type="button" className="btn btn-primary" onClick={()=>this.changeProp('alignItems','space-between')}>baseline</button>
             </div>
             </div>
             */}

        </div>);
    }
};

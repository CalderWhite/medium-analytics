import React, {Component} from "react";
import {SearchBar} from ".";

const $ = require("jquery");

export default class Card extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    /*
    let children = $('#card-' + this.props.name).children();
    let textWidth = $(children[0].getElementsByTagName('p')[0]).width();
    console.log(
    children[0].children[1].children[0].children[1].style.marginLeft = (textWidth-1).toString() + 'px'
    )
    */
  }
  render(){
    return(
      <div id={'card-' + this.props.name} >
        <div className="card-header">
          <p style={{float:'left'}}>{this.props.name}</p>
          <div style={{display:'inline-block', float:'right'}}>
          <button 
            className="no-drag btn btn-light" 
            style={{border:'1px solid grey'}}
            onClick={this.props.onReset}
            >
          Reset
          </button>
          <SearchBar 
            placeHolder="Type one of your story's titles."
            data={this.props.queryData}
            onSelect={this.props.onQuery}
          />
          </div>
        </div>
        <div className="card-block">
          {
            this.props.content
          }
        </div>
      </div>
    )
  }
}
          /*
          <button 
            className="no-drag btn btn-light" 
            style={{border:'1px solid grey'}}
            onClick={this.props.onReset}
            >
          Reset Story Selection
          </button>
          */
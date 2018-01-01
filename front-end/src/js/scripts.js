// 3rd party utils module
import Immutable from 'immutable';
// REACT
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
// Draggable module
import DragSortableList from 'react-drag-sortable'

// import our components
import {Donut,StackedAreaChart, ScaleableLineChart} from "./components";

import tinygradient from "tinygradient";

// import our own firebase library
import firebaseUtils from "./firebaseConnector";

// import our data util library
import {Utils, analyticsFrontendEngine} from "./analyticsFrontendEngine";
// shorten this mouthful a little bit
const dataUtils = analyticsFrontendEngine;

// import our stylesheets we need
import "../css/index.scss"
// get the DOM element that our app is based on
const app = document.getElementById("app");
const APP_NAME = "MEDIUM_ANALYTICS";
// test data
// TODO: Remove this for production
const testSessionId = require("./test_credentials.json")['sessionId'];

class Card extends Component{
  constructor(props){
    super(props);
    
  }
  render(){
    return(
      <div key={this.props.name}>
        <div className="card-header">{this.props.name}</div>
        <div className="card-block">
          {
            this.props.content
          }
        </div>
      </div>
    )
  }
}

export class Grid extends Component {
  constructor () {
    super();
    // initialize state
    this.state = {
      cards: [
        {
          name:'summary',
          content:<Card name='summary' content='Loading...' />,
          classes:['list-item','list-item-3','card','summary-card']
        },
        {
          name:"referrals",
          content:<Card name="Referrals" content="Loading..." />,
          classes:['list-item','list-item-3','card','referrals']
        },
        {
          name:"referralViews",
          content:<Card name="referralViews" content="Loading..." />,
          classes:['list-item','list-item-3','card']
        }
      ],
      data:null,
      disableReorder:false,
    };
    this.setCardState.bind(this)();
    // bind methods
    this.componentDidMount = this.componentDidMount.bind(this);
    this.setCardContent = this.setCardContent.bind(this);
  }
  /**
   * Checks if there is an already existing card order in the window's localStorage, and set the card's state 
   * directly if there is. (i.e. without setState() )
   */
  setCardState(){
    if(window.localStorage[APP_NAME + "_CARD_ORDER"]){
      // maybe a better datastructure could be used here, 
      // but I don't want to convert from the list to a hashmap and then back to a list
      let newCardOrder = [];
      // please note, this algorithm works since the array returned is sorted in ascending order
      JSON.parse(window.localStorage[APP_NAME + "_CARD_ORDER"]).map(({name})=>{
        for(let i = 0;i<this.state.cards.length;i++){
          if(this.state.cards[i].name == name){
            newCardOrder.push(this.state.cards[i]);
          }
        }
      });
      this.state.cards = newCardOrder;
    }
  }
  setCardContent(cardName,content){
    this.setState({
      cards:this.state.cards.map((item)=>{
        if(item.name == cardName){
          item.content = (
            <Card
            name={item.name}
            content={content}
            
            />
          )
        }
        return item;
      })
    })
  }
  
  componentDidMount(){
    // generate charts based on firebase data retrieved 
    firebaseUtils.getData(testSessionId,(data)=>{
      // set the referrals donut
      firebaseUtils.getLatestSnapshot(data,(snapshot)=>{
        // process the data for the donut
        let donutData = dataUtils.cleanseReferralList(dataUtils.formatToDonutData(snapshot.referrers,'name','views'),1)
        // generate colors for our graphs in the medium-analytics green theme
        let colors = tinygradient("#334C1A","#66ff99").rgb(donutData.length).map(({_r,_g,_b})=>{
          return Utils.rgbToHex(Math.floor(_r),Math.floor(_g),Math.floor(_b));
        });
        this.setCardContent(
          "referrals",
          (
            <Donut 
              data={donutData} 
              colors={colors}
              donutKey="referrals"
              height="25%"
            />  
          )
        )
      });
      firebaseUtils.getLatestMonth(data,(snapshots) =>{
        // setup and set the area graph
        let graphData = dataUtils.snapshotsToReferralChart(snapshots,5)
        let names = Object.keys(graphData[0]);
        // remove the date
        names.splice(names.indexOf('name'),1)
        // generate the colors for the graph
        let colors = dataUtils.randomColorSet(names.length);
        var i=0
        this.setCardContent(
          'referralViews',
          (
          <StackedAreaChart
            data={graphData}
            metaData={names.map((item)=>{
              let r =  {dataKey:item,color:colors[i]}
              i++;
              return r;
            })}
            height={370}
            width={'45%'}
          />
          )
        )
        // set up and set the line graph
        let zoomData = dataUtils.charDataToDeltas(dataUtils.snapshotsToLineChart(snapshots));
        let zoomNames = Object.keys(zoomData[0]).map((name)=>{
          let axis = 1;
          if (name == 'claps' || name == 'fans'){
            axis = 2;
          }
          return {
            name:name,
            axis:axis
          }
        })
        zoomNames.splice(zoomNames.indexOf('name'),1);
        this.setCardContent(
          'summary',
          <ScaleableLineChart
          name="summary"
          dataKeys={zoomNames}
          colors={['#8884d8','#82ca9d','red',"orange"]}
          data={zoomData}
          height={400}
          width={'90%'}
          />
        )
      });
    });
  }
  saveCardOrder(cards){
    window.localStorage[APP_NAME + "_CARD_ORDER"] = JSON.stringify(cards.map(({name,rank})=>{
      return {name,rank}
    }))
  }
  render () {
    return (
      <div>
        <DragSortableList
          items={this.state.cards}
          type="grid"
          dropBackTransitionDuration={0.3}
          onSort={this.saveCardOrder}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Grid/>,
  app
);
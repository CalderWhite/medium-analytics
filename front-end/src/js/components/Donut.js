import React, {Component} from "react";

const $ = require("jquery");

// since morris uses outdated jquery, set a window-scope variable to point to our modern jquery.
window.jQuery = $;
// raphael is a dependancy of morris
window.Raphael = require("raphael");
/* global Morris */
// the code that is imported assigned the module to a global variable called "Morris"
// so what we do is require it to include it in our code and refer to it as Moriss since it will ultimately be in the scope
// Pretty ugly, I know. However, there isn't much I could do without messing with Morris' source code.
require("morris.js");

export default class Donut extends Component{
  constructor(props){
    super(props);
    this.state = {
      angle:450,
      angleIncrement: - 6,
      increase:true,
      circle:null,
    };
    let total = 0;
    for(let i=0;i<this.props.data.length;i++){
      total+=this.props.data[i].value;
    };
    this.state.total = total;
    // set relative heights and widths, if they are relative
    if(typeof(props.height) == 'string' && props.height.search('%') > -1){
        window.addEventListener('resize',()=>{
          this.setHeightByPercent(Number(props.height.replace(/\%/g,'')) )
          $('#donut-' + this.props.donutKey)[0].removeChild($('#donut-' + this.props.donutKey)[0].children[0])
          this.generateGraph();
        } );
        // NOTE: it is .innerWidth, not innerHeight. I don't have time to impliment specifying which dimension it is relative to,
        // and for now I only want it to be relative to the width.
        this.state.height = window.innerWidth * (Number(props.height.replace(/\%/g,'')) ) / 100;
    } else{
        this.state.height = props.height;
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.generateGraph = this.generateGraph.bind(this)
    this.updateLoader = this.updateLoader.bind(this);
    this.loadInGraph = this.loadInGraph.bind(this);
    this.setHeightByPercent = this.setHeightByPercent.bind(this);
  }
  setHeightByPercent(percent){
    // NOTE: it is .innerWidth, not innerHeight. I don't have time to impliment specifying which dimension it is relative to,
    // and for now I only want it to be relative to the width.
    this.setState({
        height : window.innerWidth * percent / 100
    });
  }
  componentDidMount(){
    this.generateGraph();
    this.loadInGraph();
  }
  generateGraph(){
    // since morris.js is not designed for react, it appends and element to the DOM.
    // because of this, we also must go through the DOM. I know, pretty ugly.
    new Morris.Donut({
      // ID of the element in which to draw the chart.
      element: 'donut-' + this.props.donutKey,
      // Chart data records -- each entry in this array corresponds to a point on
      // the chart.
      data: this.props.data,
      formatter : (item) =>{
        // *100 so we round to 2 decimal plNaces
        let percent = Math.round(100*100*item/this.state.total)/100;
        return percent.toString() + "% of views";
      },
      colors:this.props.colors
    });
    $('.'+this.props.name+'-donut-chart > svg > g').css('user-select','none')
    $('.'+this.props.name+'-donut-chart > svg > g > g > g > g').css('user-select','none')
  }
  loadInGraph(){
    var parent = $('#donut-' + this.props.donutKey);
    var svg = parent[0].children[0];
    if(window["donut-" + this.props.donutKey] != false){
      // add it in the white circle for the load in effect
      let loader = document.createElement("circle");
      svg.appendChild(loader);
      loader.style.marginLeft="100px";
      loader.outerHTML = `<circle cx="250" cy="`+(this.state.height/2).toString()+`" r="`+(this.state.height/4).toString()+`" fill="none" stroke="#ffffff" stroke-width="`+(this.state.height/2).toString()+`" stroke-dasharray="0,20000" />`;
      // hide the text to fade in later.
      $('#donut-' + this.props.donutKey + ' > svg > text').css('opacity','0');
      parent[0].style.display = "block";
      // now get the width to figure out how much left margin should be applied (whether it be negative or positive)
      svg.style.marginLeft = ( -($(svg).width() - parent.width()) / 2).toString() + "px";
      // run the loading animation
      this.updateLoader();
      window["donut-" + this.props.donutKey] = false;
    } else{
      parent[0].style.display = "block";
      // now get the width to figure out how much left margin should be applied (whether it be negative or positive)
      svg.style.marginLeft = ( -($(svg).width() - parent.width()) / 2).toString() + "px";
    }
  }
  updateLoader(){
    const interval = 30;
    let newAngle = this.state.angle;
    let newIncrement;
    if(this.state.angleIncrement < -50){
      this.setState({
        increase:false
      });
    }
    if(this.state.increase){
      newIncrement = this.state.angleIncrement*1.17;
    } else{
      newIncrement = Math.min(this.state.angleIncrement/1.5,-2);
    }
    this.setState({
      angle:newAngle + newIncrement,
      angleIncrement:newIncrement
    });
    var svg = $('#donut-' + this.props.donutKey + ' > svg')[0];
    svg.children[svg.children.length-1].setAttribute("stroke-dasharray", this.state.angle + ", 20000");
    if (newAngle > 0 && newAngle + newIncrement > 0) {
      setTimeout(this.updateLoader,interval);
    } else{
      svg.removeChild(svg.children[svg.children.length-1]);
      $('#donut-' + this.props.donutKey + ' > svg > text').fadeTo(800,1);
    }
  }
  render(){
    return (
      <div id={"donut-" + this.props.donutKey} className={this.props.name + "-donut-chart"} style={{height: this.state.height,display:"none"}}>
      </div>
    );
  }
}
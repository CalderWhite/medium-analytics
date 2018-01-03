import React, { Component } from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
const $ = require("jquery");

export default class ScaleableLineChart extends Component{
    constructor(props){
        super(props);
        this.state = {}
        // set relative heights and widths, if they are relative
        if(typeof(props.height) == 'string' && props.height.search('%') > -1){
            window.addEventListener('resize',()=>{this.setHeightByPercent(Number(props.height.replace(/\%/g,'')) )} );
            this.state.height = window.innerHeight * (Number(props.height.replace(/\%/g,'')) ) / 100;
        } else{
            this.state.height = props.height;
        }
        if(typeof(props.width) == 'string' && props.width.search('%') > -1){
            window.addEventListener('resize',()=>{this.setWidthByPercent(Number(props.width.replace(/\%/g,'')) )} );
            this.state.width= window.innerWidth * (Number(props.width.replace(/\%/g,'')) ) / 100;
        } else{
            this.state.width = props.width;
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setHeightByPercent = this.setHeightByPercent.bind(this);
        this.setWidthByPercent = this.setWidthByPercent.bind(this);
    }
    setHeightByPercent(percent){
        this.setState({
            height : window.innerHeight * percent / 100
        });
    }
    setWidthByPercent(percent){
        this.setState({
            width : window.innerWidth * percent / 100
        });
    }
    componentDidMount(){
        $('.'+this.props.name+'-zoomable-chart > svg')[0].className.baseVal = "recharts-surface no-drag";
        $('.'+this.props.name+'-zoomable-chart > svg > g').css('user-select','none');
    }
	render () {
      	return (
        	<LineChart width={this.state.width} height={this.state.height} data={this.props.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
                className={this.props.name+"-zoomable-chart"}>
           <XAxis dataKey="name"/>
           <YAxis yAxisId="1" />
           <YAxis yAxisId="2" orientation="right" />
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />
           {
               this.props.dataKeys.map(({name,axis})=>{
                   // really ineffecient, should fix but there's so much else to do
                   let i =this.props.dataKeys.map(({name})=>{return name}).indexOf(name);
                   return (
                   <Line yAxisId="1" type="monotone" dataKey={name} key={name} stroke={this.props.colors[i]} dot={{strokeWidth:1,r:2}} />
                   )
               })
           }
          </LineChart>
        );
  }
}
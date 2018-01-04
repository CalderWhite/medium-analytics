import React, {Component} from "react";
// import third party graphing modules
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";

export default class StackedAreaChart extends Component{
  constructor(props){
    super(props);
    this.state = {};
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
	render () {
  	return (
    	<AreaChart width={this.state.width} height={this.state.height} data={this.props.data}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <XAxis dataKey="snapshotTimestamp"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        {
          this.props.metaData.map(({dataKey,color})=>{
            return <Area type='monotone' dataKey={dataKey} stackId={1} stroke={color} fill={color} key={dataKey} />
          })
        }
      </AreaChart>
    );
  }
}
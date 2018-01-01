import React, { Component } from "react";
import { Label, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from "recharts";
const $ = require("jquery");

export default class StreamingDemo extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
      data:this.props.data,
      left : 'dataMin',
      right : 'dataMax',
      refAreaLeft : '',
      refAreaRight : '',
      top : 'dataMax+1',
      bottom : 'dataMin-1',
      animation : true
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAxisYDomain = this.getAxisYDomain.bind(this);
  }
  getAxisYDomain(from, to, ref, offset) {
  	const refData = this.props.data.slice(from-1, to);
    let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
    refData.forEach( d => {
    	if ( d[ref] > top ) top = d[ref];
      if ( d[ref] < bottom ) bottom = d[ref];
    });
    
    return [ (bottom|0) - offset, (top|0) + offset ]
  };
  
  zoom(){  
  	let { refAreaLeft, refAreaRight, data } = this.state;

		if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
    	this.setState( () => ({
      	refAreaLeft : '',
        refAreaRight : ''
      }) );
    	return;
    }

		// xAxis domain
	  if ( refAreaLeft > refAreaRight ) 
    		[ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

		// yAxis domain
    const [ bottom, top ] = this.getAxisYDomain( refAreaLeft, refAreaRight, this.props.maxKey, 1 );
    
    this.setState( () => ({
      refAreaLeft : '',
      refAreaRight : '',
    	data : data.slice(),
      left : refAreaLeft,
      right : refAreaRight,
      bottom, top
    } ) );
  };

	zoomOut() {
  	const { data } = this.state;
  	this.setState( () => ({
      data : data.slice(),
      refAreaLeft : '',
      refAreaRight : '',
      left : 'dataMin',
      right : 'dataMax',
      top : 'dataMax+1',
      bottom : 'dataMin',
    }) );
  }
  
  componentDidMount(){
    $('.'+this.props.name+'-zoomable-chart > div > svg')[0].className.baseVal = "recharts-surface no-drag"
    $('.'+this.props.name+'-zoomable-chart > div > svg > g').css('user-select','none')
  }
  
  render() {
    const { data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;

    return (
      <div className={this.props.name+"-zoomable-chart"}>
        <a
          href="javascript: void(0);"
          className="btn update"
          onClick={this.zoomOut.bind( this )}
        >
          Zoom Out
        </a>


        <p>Highlight / Zoom - able Line Chart</p>
          <LineChart
            width={800}
            height={400}
            data={data}
            onMouseDown = { (e) => this.setState({refAreaLeft:e.activeLabel}) }
            onMouseMove = { (e) => this.state.refAreaLeft && this.setState({refAreaRight:e.activeLabel}) }
            onMouseUp = { this.zoom.bind( this ) }
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis 
              allowDataOverflow={true}
              dataKey="name"
              domain={[left, right]}
              type="number"
            />
            <YAxis 
              allowDataOverflow={true}
              domain={[bottom, top]}
              type="number"
              yAxisId="1"
             />
            <Tooltip/>
             {
                 this.props.dataKeys.map(({name,axis})=>{
                     // really ineffecient, should fix but there's so much else to do
                     let i =this.props.dataKeys.map(({name})=>{return name}).indexOf(name);
                     return (
                     <Line yAxisId="1" type="monotone" dataKey={name} key={name} stroke={this.props.colors[i]} dot={{strokeWidth:1,r:2}} animationDuration={300} />
                     )
                 })
             }

            {
            	(refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
            
            }
            
          </LineChart> 

      </div>
    );
  }
}

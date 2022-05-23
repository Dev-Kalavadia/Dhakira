import React, {Component} from "react";
import {actions} from "src"
import {ProgressBar} from "react-bootstrap";

/*
props: start, end, getValue, getLabel, results,  delayPlaceInterval
*/

export default class ProgressBarComponent extends Component {
    constructor(props){
        super(props);
        this.state={processed:{}} /*To help rendering twice*/
    }

   getRangeValue=( value, r1=[0,0], r2=[0,100] )=> { 
      return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  componentWillReceiveProps=(props)=>{
    const {results, getValue, getLabel}=this.props;
    results && results.map((item, index)=>{
        this.setProgressBarValue(item, index)
    })  
   } 
  
  setProgressBarValue=(item, index=0)=>{
     /*Currently too many stack error. Make this a forloop
     */
    const {start, end, getValue, getLabel, results,  delayPlaceInterval}=this.props;
    let currentValue=getValue?getValue(item):item.arrival_date.split("-")[0]
    let label=getLabel?getLabel(item):item.arrival_date.split("-")[0]
    const {processed}=this.state;
    if(!processed[currentValue]){//if item not process then delay and get value
      // console.log("setProgressBarValue", index, item)
      processed[currentValue]=1
      let now=this.getRangeValue(currentValue, [start, end])
      // console.log("now", now)
      let waitTime= delayPlaceInterval
      actions.Actions.sleep(waitTime) //wait delay
      .then(()=>{
          this.setState({processed, label, now})
         // this.setProgressBarValue(item, index)
       })
    }
  }

 

  render() {
        const {now=0, label=""}=this.state;
        return <ProgressBar now={now} label={label} />
    }
}
import React, {Component} from "react";

import {
  CircleMarker, 
  Popup,
  Tooltip,
} from 'react-leaflet-universal';


export default class CircleMarkerCustom extends Component {
  constructor(props){
      super(props);
      this.state = {radius : 0, step:1};
  }


timedLoop({currentStep, steps, callback, speed}){
    if(currentStep < steps){
      setTimeout(()=>{
        currentStep++;
        this.timedLoop({currentStep, steps, callback, speed});
        callback && callback()
        
      }, speed);
    }
  }




    // componentDidMount() { 
    //   /*
    //     maxRadius=20, speed=100; increase circle by one every 100 ms
    //   */
    //   const {speed, maxRadius}=this.props;
    //   let steps=20;
    //   let currentStep=0;
    //   let stepsValue=parseInt(maxRadius/steps)||1;

    //   this.timedLoop({
    //     currentStep, 
    //     steps,
    //     speed,
    //     callback:()=>{
    //       let {step}=this.state;
    //         step+=1
    //         let radius=maxRadius*(1-Math.pow(Math.PI,  -1*(step)))
    //         // console.log("radius", radius, maxRadius)
    //          radius<=maxRadius && this.setState({radius});
    //     }
    //   })
    // }

  componentDidMount() { 
      /*
        maxRadius=20, speed=100; increase circle by one every 100 ms
      */
      const {speed, maxRadius}=this.props;
      let steps=20;
      let currentStep=0;
      let stepsValue=parseInt(maxRadius/steps)||1;

      this.timedLoop({
        currentStep, 
        steps,
        speed,
        callback:()=>{
          let {radius}=this.state;
            radius+=stepsValue
            // console.log("radius", radius, maxRadius)
            radius<=maxRadius && this.setState({radius});
        }
      })
    }


    render() {
      const {item,children, tooltip}=this.props;
      const {radius, showTooltip}=this.state;
        return <CircleMarker center={item.latlng} radius={radius}
                      onMouseOver={() => { 
                        this.setState({showTooltip:true})
                        // console.log("showTooltip", showTooltip)
                        
                      }}
                      onMouseOut={() => { 
                        this.setState({showTooltip:false})
                        // console.log("showTooltip", showTooltip)
                      }}
                  >
                    {!!children ?children:<Popup>
                      <p>{item.name}</p>
                      <p>Total Arrivals: {item.arrivalsCount}</p>
                      <p>Total Departures: {item.departuresCount}</p>
                    </Popup>}

                     {showTooltip && <Tooltip permanent open={showTooltip}>
                       {tooltip?tooltip():<div>
                          <p>{item.name}</p>
                          <p>Total Arrivals: {item.arrivalsCount}</p>
                          <p>Total Departures: {item.departuresCount}</p>
                       </div>}
                     </Tooltip>}

      </CircleMarker>
    }
}

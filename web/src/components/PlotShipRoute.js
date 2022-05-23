import React, {Component} from "react";
// import Delayed from "./delayed";
import { Marker, Popup, Polyline, Tooltip } from 'react-leaflet-universal';
import dynamic from "next/dynamic";

import {assets, actions} from "src";

// import {DriftMarker}  from "leaflet-drift-marker" //to only work with front end
const DriftMarker = dynamic(
  () => import('leaflet-drift-marker').then((mod) => mod.DriftMarker),
  { ssr: false }
)


export default class PlotShipRoute extends Component {
    constructor(props){
        super(props);
        const positions=this.props.positions;
        const totalDurationPerPath=5*1000; //10 seconds
        this.shipSpeed=10 //km/ms
        this.state={position:null, /*[lat,lng],*/
            L:null, path:[],
            delayInterval:5,
        }
    }

    updateShipPosition=async({positions, step=0}={})=>{
        /*Updates a position of a ship by getting the next one */
        let position=positions[step];
        let delayInterval=1;
        let {path}=this.state;
        if(position){//get next step
            step+=1;
            path=[...path, position]
            if(step>=1 && position){//compute delay interval again by first finding distance between points
              let distance=actions.routes.distance({
                  start: positions[step-1],
                  end:position,
              })
              delayInterval=parseInt(distance/this.shipSpeed)||1;
              if( isNaN(delayInterval)){//if not a number use the average time interval
                 delayInterval= 1; 
              }
            }
            if (position[0] && position[1]){
                 await actions.Actions.sleep(delayInterval/(step||1));
            }
            // console.log("position", position)
            this._isMounted && this.setState({position, path, delayInterval});

            
            this.updateShipPosition({positions, step, delayInterval})
        }
    }

    componentDidMount() {
        const L=require("leaflet");
        this.setState({L})
        const {positions}=this.props;
        this.updateShipPosition({positions})
        this._isMounted=true;
    }
    componentWillUnmount(){
        this._isMounted=false;
    }


    render() {
        const {positions}=this.props;
        const {position, L, path, delayInterval}=this.state;
        const customMarker = L?.icon({ 
                iconUrl: assets.images.boat.default,
                iconSize:     [20, 20], // size of the icon
                // shadowSize:   [50, 64], // size of the shadow
                // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                // // shadowAnchor: [4, 62],  // the same for the shadow
                // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            })
        return <div>
                <Polyline positions={path} bubblingMouseEvents={true} 
                        onCLick={()=>alert(" HEllo world")}
                />
                {!!customMarker && position && <DriftMarker //Drift
                    // if position changes, marker will drift its way to new position
                    position={position}
                    // time in ms that marker will take to reach its destination
                    duration={0.9*delayInterval}
                    icon={customMarker}
                    >
                </DriftMarker>}
        </div>;
    }
}
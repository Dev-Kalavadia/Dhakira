import React, {Component, createRef} from "react";
import {Core, api, actions} from "src"
import {Map, TileLayer, 
  Marker, CircleMarker, 
  Popup 
} from 'react-leaflet-universal';
// import AntPath from "react-leaflet-ant-path";


const DEFAULT_VIEWPORT = {
  center: [0.00, 0.00],
  zoom: 2,
}

export default class CustomMapComponent extends Core {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      hasLocation: false,
      viewport: DEFAULT_VIEWPORT,
      //delay displays
      delayPlaceInterval:1000, 
      speedRadiusIncrease:1000,
      routes:[],
  };
  this.urls=[{start:`${api.voyage_list}?size=100`, search:"voyage_list_search"}]
  this.mapRef = createRef();
  this.advanceFilters=[
        {
          searchURL:`${api.voyage}?size=100&order_by=code`,
          placeholder:"Voyage Code..",
          suggestionDisplayName:{name:"code", 
            searchName:"code", searchPath:"code"
          }
        },

        {
          searchURL:`${api.voyage}?size=100&order_by=ship__name`,
          placeholder:"Ship Name..",
          suggestionDisplayName:{name:"ship.name", 
            searchName:"ship__name", searchPath:"ship.name"
          }
        },

        {
          searchURL:`${api.voyage}?size=100&order_by=departure_place__name`,
          placeholder:"Departure Place..",
          suggestionDisplayName:{name:"departure_place.name", 
            searchName:"departure_place__name", searchPath:"departure_place.name"
          }
        },

        {
          searchURL:`${api.voyage}?size=100&order_by=arrival_place__name`,
          placeholder:"Arrival Place..",
          suggestionDisplayName:{name:"arrival_place.name", 
            searchName:"arrival_place__name", searchPath:"arrival_place.name"
          }
        },

          {
            searchURL:`${api.voyage}years/?`,
            placeholder:"Arrival Year Start..",
            suggestionDisplayName:{name:"name", 
              searchName:"arrival_date__year__start", searchPath:"value"
            }
          }, 


           {
            searchURL:`${api.voyage}years/?`,
            placeholder:"Arrival Year End..",
            suggestionDisplayName:{name:"name", 
              searchName:"arrival_date__year__end", searchPath:"value"
            }
          }, 
      ]

}

handleClick = () => {
    this.mapRef.current.leafletElement.locate();
}

getRoute=(startPoint, endPoint)=>{
  return actions.routes.getCurve(startPoint, endPoint)
}

calculateRoutes=(voyages)=>{
    /*
      This precalculate routes to avoid heavy computation when rendering
    */
    if(!voyages) return null
    let {routes}=this.state;
    // console.log("initial routes", routes.length)
    voyages.map((v, index)=>{
      if(this.get(v, "arrival_place.geoname") && this.get(v, "departure_place.geoname")){
          let route=this.getRoute(
                        [v.departure_place.geoname.lat,v.departure_place.geoname.lon], 
                        [v.arrival_place.geoname.lat,v.arrival_place.geoname.lon]
                    )
          if(route && route.length>2){
            routes.push(route)
          }
        }
     })
    // console.log("final routes", routes.length)
    this.setState({routes})
  }


handleLocationFound = e => {
  this.setState({
    hasLocation: true,
    latlng: e.latlng
  });
}


//change view ports
onClickMap = (e) => {
  let viewport={
    center: e.latlng,
    zoom:4
  }
  this.onViewportChanged(viewport)
 }


onViewportChanged = (viewport) => {
  if(viewport ==this.state.viewport) {
    /*to avoid infite loop
    */
    return; 
  }
  this.setState({ viewport })
}


body() {
    const {width=1500, height=1200, zoom, center=[0, 0]}=this.state;
    return <div>
      <img 
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8yg3JndemtOrl1LjuRa-GIomAARpNQTf_cg&usqp=CAU"
      style={{alignSelf:"center", alignItems:"center", width:0.6*width, height:0.75*height}}
      />
    </div>


    return (<div>
        {this.renderMapTop?this.renderMapTop():null}
        <Map
          width= {width}
          // height= {height}
          center= {center}
          clip={true}
          // bounds={[center, [width, height]]}
          onClick={this.handleClick}
          setView={true}
          // onLocationfound={this.handleLocationFound}
          ref={this.mapRef}
          // zoom={zoom}
          //view port
          viewport={this.state.viewport}
          onClick={this.onClickMap}
          // onViewportChanged={this.onViewportChanged}
        >
          {this.renderMapComponents && this.renderMapComponents()}
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      
    </div>)
  }
}

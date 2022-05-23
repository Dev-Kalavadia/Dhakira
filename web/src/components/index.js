import React from "react";
import Core from "./Core";
import Delayed from "./delayed";
import Map from "./map";
import PlotShipRoute from "./PlotShipRoute";
import ProgressBar from "./ProgressBar";
import AutoSuggest from "./AutoSuggest";
import dynamic from "next/dynamic";
import CircleMarkerCustom from "./CircleMarkerCustom"

export const Loading=()=>{
  return <div className="loader text-center" key={0}>
           <div className="alert alert-info">Fetching Data...</div>
         </div>
}
export {
  Core, 
  Delayed, 
  Map,
  CircleMarkerCustom,
  PlotShipRoute,
  ProgressBar,
  AutoSuggest,
}
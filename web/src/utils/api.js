// const base_url=;
// import {Actions} from "@actions";
import {DEBUG, base_url} from "./env";
import routes from "./routes";
import {actions} from "src"
// var base_url= "https://shipwreck.hudumabomba.com" //"http://0.0.0.0:8000";


const api=({link, token=null, method="GET", data={}, stringify=true, contentType='application/json', header={'Accept': 'application/json',"Access-Control-Allow-Private-Network": true}}= {})=>{
        header={...{'Content-Type': contentType}, ...header}
        token=token;
        if (token !=null){
          header={...{'Authorization': 'Token '+token}, ...header}
        }
        var headers={}
        if (method=="GET"){
              headers={
                method: "GET",
                headers : header,
              }
        
        }else{
           headers={
                method: method,
                headers : header,
                body: stringify?JSON.stringify(data):data,
              }
          }
      //confirm link
      if (!(link+"").startsWith("http", 0)){
        link=base_url+link
        console.log(link)
      }
      return fetch(link, headers)
              .then((response) => {
                //console.log(response)
                return response.json()
            })
  }

const data={
  base_url,
  api,
  routes,

  ship: base_url+"/api/v1/ship/",
  ship_list: base_url+"/api/v1/ship/",
  ship_list_search:base_url+"/api/v1/ship/?search={search}",
  ship_detail:base_url+"/api/v1/ship/{pk}/",
  
  othershipname: base_url+"/api/v1/othershipname/",
  shiptype: base_url+"/api/v1/shiptype/",
  shipclass: base_url+"/api/v1/shipclass/",
  place: base_url+"/api/v1/place/",
  otherplacename: base_url+"/api/v1/otherplacename/",
  region: base_url+"/api/v1/region/",
  voyage: "/voyages",
  port: base_url+"/api/v1/port/",
  //voyages
  voyage_list:"/voyages",
  // voyage_list_search:base_url+"/voyage/?search={search}",
  // voyage_detail:base_url+"/voyage/{pk}/",
  //places
  place_list:base_url+"/api/v1/place/",
  place_list_search:base_url+"/api/v1/place/?search={search}",
  place_detail:base_url+"/api/v1/place/{pk}/",
  //ports
  port_list:base_url+"/api/v1/port/",
  port_detail:base_url+"/api/v1/port/{pk}/",
  port_list_search:base_url+"/api/v1/port/?search",



  get:(field, params={})=>{//substitue variables in strings
      //console.log('data["field"]', field, data[field], params)
      return actions.Actions.replaceVariablesFromString(data[field], params)
    },
  getSearchURL:(field)=>{
      return `${data[field]}?search={search}`
  },

  getURL:(field, {item={}, type="detail"}={})=>{
      //Return absolute URI
      let link=""
      if(type=="detail"){
          link=`${data[field]}{_id}/`
      }
      if(type=="search"){
          link=`${data[field]}?search={search}`
      }
      return actions.Actions.replaceVariablesFromString(link, item)
  },

};

export default data;

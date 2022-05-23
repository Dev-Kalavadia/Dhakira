import React, {Component} from "react";
import { useState, useCallback } from "react";
import {Core} from "src"
import {api} from "src"
import { Table, Button} from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroller';
import moment from "moment";
import {Loading} from "src/components"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';

export default class Tables extends Core {
	constructor(props) {
		super(props);
		this.state = {
			...this.state,
			loading:true,
			sortBy: "_id",
			sortType: "asc"
		};
		this.urls=[{start:`${api.voyage_list}?skip=0&sortBy=${this.state.sortBy}&sortType=${this.state.sortType}`}]
		//search features
		this.fetchAll=true;
		this.showSearch=false;
		this.searchURL=`${api.voyage}?skip=0&sortBy=${this.state.sortBy}&sortType=${this.state.sortType}`;
		this.placeholder="Search Voyage..";
		// this.renderAdvancedSearch=null;
		this.suggestionDisplayName={name:"ship.name", 
			searchName:"ship__name", searchPath:"ship.name"
		}
		// this.fetchData()	

		this.defaultSorted = [{
			dataField: 'voyagecode',
			order: 'asc',
		}];

		// this.suggestionDisplayNameSubtitle={"type":"list", "list": "productAttributes", "name": "name", "value": "value"}
		this.advanceFilters=[
				{
					searchURL:`${api.place}?size=100&order_by=name`,
					placeholder:"Departure Place..",
					suggestionDisplayName:{
						name:"name", 
						searchName:"departure_place__name", 
						searchPath:"name"
					}
				},

				{
					searchURL:`${api.place}?size=100&order_by=code`,
					placeholder:"Departure Code From..",
					suggestionDisplayName:{
						name:"code", 
						searchName:"departure_place__code__gte", 
						searchPath:"code"
					}
				},
				{
					searchURL:`${api.place}?size=100&order_by=code`,
					placeholder:"Departure Code To..",
					suggestionDisplayName:{
						name:"code", 
						searchName:"departure_place__code__lte", 
						searchPath:"code"
					}
				},

				{
					searchURL:`${api.place}?size=100&order_by=name`,
					placeholder:"Arrival Place..",
					suggestionDisplayName:{
						name:"name", 
						searchName:"arrival_place__name", 
						searchPath:"name"
					}
				},

				{
					searchURL:`${api.place}?size=100&order_by=code`,
					placeholder:"Arrival Place Code From",
					suggestionDisplayName:{
						name:"code", 
						searchName:"arrival_place__code__gte", 
						searchPath:"code"
					}
				},
				{
					searchURL:`${api.place}?size=100&order_by=code`,
					placeholder:"Arrival Place..",
					suggestionDisplayName:{
						name:"code", 
						searchName:"arrival_place__code__lte", 
						searchPath:"code"
					}
				},	
				{
					searchURL:`${api.voyage}?size=100&order_by=code`,
					placeholder:"Voyage Code..",
					suggestionDisplayName:{
						name:"code", 
						searchName:"code", 
						searchPath:"code"
					}
				},

				{
					searchURL:`${api.voyage}?size=100&order_by=ship__name`,
					placeholder:"Ship Name..",
					suggestionDisplayName:{
						name:"ship.name", 
						searchName:"ship__name", 
						searchPath:"ship.name"
					}
				},

			   {
					searchURL:`${api.othershipname}?size=100&order_by=name`,
					placeholder:"Other Ship Names..",
					suggestionDisplayName:{
						name:"name", 
						searchName:"other_names__name", 
						searchPath:"name"
					}
				},

				{
					searchURL:`${api.voyage}?size=100&order_by=ship__code`,
					placeholder:"Ship Code..",
					suggestionDisplayName:{
						name:"ship.code", 
						searchName:"ship__code", 
						searchPath:"ship.code"
					}
				},

			    {
			      searchURL:`${api.voyage}years/?`,
			      placeholder:"Arrival Year Start..",
			      suggestionDisplayName:{
			      	name:"name", 
			        searchName:"arrival_date__year__start", 
			        searchPath:"value"
			      }
			    }, 

			    {
			      searchURL:`${api.voyage}years/?`,
			      placeholder:"Arrival Year End..",
			      suggestionDisplayName:{
			      	name:"name", 
			        searchName:"arrival_date__year__end", 
			        searchPath:"value"
			      }
			    },
			]
	}

	_componentDidMount() {
		// console.log("calling fetch", )
	    this.fetchData()	
	}
	
	renderItemInfo=(item, itemType=null)=>{
		const excludeKeys=["data", "get_absolute_url", "created", 
							"updated", "pk", "verified", "reference", "dimensions",
							"geoname","build", "region",
						  ]
		/*
				    "pk": 12,
		            "code": 1,
		            "name": "amsterdam",
		            "other_names": [],
		            "last_corrected": 130,
		            "dimensions": null,
		            "ship_type": [],
		            "year_in": 1595,
		            "year_out": 1597,
		            "details_end": null,
		            "dasno": 1,
		            "ship_class": null,
		            "info_origine": "gebouwd Ned",
		            "reference_origine": "De Jonge Opkomst I;Blz 202",
		            "last_diverse_info": "100",
		            "das_ton": "260.0",
		            "ord_calculation": null,
		            "last": null,
		            "reference_last": null,
		            "info_text": null,
		            "division": null,
		            "idno_old": 14,
		            "in_use_in": false,
		*/

		const tempDic={
			ship:{
					other_names:"Ship Name others",
					ship_type:"Type",
					ship_class:"Classe RP",
					details_end:"Details End",
					details_origin:"Constructed",
					last_corrected:"Last (corrected)",
					year_in:"Year In",
					year_out:"Year Out",
				},
			place:{
				other_names:"Modern Name"
			}
	}

	const paginationOption = {
		custom: true,
		totalSize: this.toNumber(count||0)
	  };

		const renameDic={dasno:"DASNO", ...tempDic[itemType]||{}}
		let newItem=[]
		Object.keys(item).map(key=>{
		    let value=item[key]
		    if(typeof value==="object" && value){
		        //get a value of a nested object
		        // console.log("value", value, "key", key)
		        if(key==="other_names"){
		        	value=value?.map(name=>name.name)?.join("; ")
		        }else{
		        	value=value.name
		        }
		    }
		    if(!excludeKeys.includes(key)){
		    	let cleanedKey=renameDic[key]||key
		      	newItem.push([cleanedKey.replace(/_/g, (x)=>" "), `${value!=null?value:""}`])  
		    }
		})

		return <Table striped bordered hover>
		          <tbody>
		            {newItem.map((row, index)=><tr key={index}>
		                      <td>{row[0]}</td>
		                      <td>{row[1]}</td>
		                    </tr>
		                )}
		          </tbody>
		        </Table>
	}

	toNumber=(amount)=>{
		return new Intl.NumberFormat().format(amount)
	}

	body=()=>{
		this.columns = [{
            dataField: 'voyagecode',
            text: 'Voyage Code',
            sort: true,
			headerEvents: {
				onClick: (e, column, columnIndex) => {
					this.setState({
						sortBy:'_id',
						sortType:'desc'
					});
					console.log(this.state)
				}
			}
			
        }, {
            dataField: 'shipname',
            text: 'Ship Name',
            sort: true,
        }, {
            dataField: 'shipcode',
            text: 'Ship Code',
            sort: true,
        }, {
            dataField: 'departureplace',
            text: 'Departure Place',
            sort: true,
        }, {
            dataField: 'departurecode',
            text: 'Departure Code',
            sort: true,
        }, {
            dataField: 'departuredate',
            text: 'Departure Date',
            sort: true,
        }, {
            dataField: 'arrivalplace',
            text: 'Arrival Place',
            sort: true,
        }, {
            dataField: 'arrivalcode',
            text: 'Arrival Code',
            sort: true,
        }, {
            dataField: 'arrivaldate',
            text: 'Arrival Date',
            sort: true,
        }];
		const {results, next, count, loading}=this.state;
		const myData = !!results && results.map(i => ({
			voyagecode: i._id,
			shipname: i.shipName,
			shipcode: i.ID,
			departureplace: i.departurePlace,
			departurecode: i.depCode,
			departuredate: i.departureDate?.date+" - "+i.departureDate?.month+" - "+i.departureDate?.year,
			arrivalplace: i.arrivalPlace,
			arrivalcode: i.arrCode,
			arrivaldate: i.arrivalDate?.date+" - "+i.arrivalDate?.month+" - "+i.arrivalDate?.year,
		  }));
		return loading?<Loading />:<div>
		<div className="alert alert-info">
			Total results: {this.toNumber(count||0)}
		</div>

		<InfiniteScroll
			    pageStart={0}
			    loadMore={()=>this.fetchData({link:"next"})}
			    hasMore={!!next?true:false}
			    loader={<Loading />}
			>
			<BootstrapTable 
				//bootstrap4
                keyField="voyagecode"
                data={myData}
                columns={this.columns}
                striped
                hover
                condensed
                defaultSorted={this.defaultSorted} 
            />
		</InfiniteScroll>
		</div>
	}
}

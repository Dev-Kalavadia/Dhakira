import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {Component} from "react";
import { 
  Container, Row, Card, Button, Col, 
  Navbar,Nav,NavDropdown,Form,FormControl, Modal,
  Toast, Image,
  Popover,OverlayTrigger,
} from 'react-bootstrap';

import {TiThListOutline as FiltersIcon  } from "react-icons/ti";
import AutoSuggest from "./AutoSuggest";
import NoSSR from 'react-no-ssr'
import dynamic from "next/dynamic";
import {api, actions, assets} from "src";

import * as qs from 'query-string';


const Session={}
// const Session = dynamic(() => import('bc-react-session').then((mod) => mod.Session))
// console.log("sesssion", Session)

export default class CoreComponent extends Component {
  static async getInitialProps ({query}) {
    // query.slug
    return query
  }

  constructor(props) {
    super(props);
    const {params={}}=this.props; /*query parameters passed to the component */
    this.title="Shipping Database";
    this.resultsField="results";
    this.state = {
      cached:[],
      refreshing:false, 
      tab:0, 
      loading:true, 
      offline:false, 
      basket:{},
      showToast:false,
      isMounted:false, 
      params, 
      ...params,
      showAdvancedSearchModal:false,
    };
    this.urls=[]
    // console.log("params", params)
    this.showSearch=false;
    this.searchURL=null;
    this.setState = this.setState.bind(this)
    this.suggestionDisplayName={}; //path of text field to be display for autosuggest without custom render
    this.NoSSR=false;

  }

  //session
  sessionStart=(payload={})=>{
    Session.start("bizmanager", { 
       payload,
      expiration: 86400000, // (optional) defaults to 1 day
    });
  }

  sessionDestroy=()=>{
    Session.destroy();
  }

  sessionSet=(payload={})=>{
    // pass a new username that will override previous one (if any)
    Session.setPayload(payload);
  }


  get session(){
   // const session = Session.get();
    // const { payload } = Session.get();
    let payload={}
    return payload
    // console.log(session.isValid); // will be true if is not expired or innactive
    // console.log(payload); // anything you have set on the session payload is stored here
  }



 navigate=(name, params)=>{
   window.location=api.routes[name]
 }

 sleep=(ms)=>{
   actions.Actions.sleep(ms)
 }


 deleteItem=({item, callback})=>{
     let {token, results}=this.state;
     let _id=item.pk
     let link=api.getURL(this.itemType, {item:{_id}, type:"detail"})
     api.api({link, token, method:"DELETE"})
     .then(res=>{
       console.log("Delete results", res)
       if(callback) return callback()
     }).catch(error=>{
       console.log("Error deleting item", error)
     }).finally(()=>{
       results=results.filter(obj=>obj!=item)
       console.log('filtered results', results)
       this.setState({results})
     })
 }


 getItem=()=>{
   const {token, _id}=this.state
   if(_id && this.itemType){
     let link=api.getURL(this.itemType, {item:{_id}, type:"detail"})
     api.api({link, token})
     .then(item=>{
       this.setState({item})
     }).catch(error=>{
       console.log("Error fetching item")
     })
   }
 }

 getSearchParams=(str)=>{
   if (!str) return {}
    const regex=/(\?)\w+/;
    const index=str.search(/(\?)\w+/i)
    if(index>-1){
      return qs.parse(str.slice(index))
    }else{
      return qs.parse(str)
    }
  }


 fetchData=({link="start",is_next=null, search=null, page=0, maxPage=null, token=null,  delete_items=false, urls=null, callback=null, subQuery=false,resultsField=null, extraFields=[], /**/}={})=>{
    var is_search=false;
    var {cached, next, tab, offline,  fetchAll=false}=this.state;
    var resultsField=resultsField||this.resultsField;
    //console.log(resultsField);
    search=search||this.state.search;
    token=this.state.token||token;
    is_next=is_next==null?false:is_next;
    urls=urls||this.urls[tab]

    if(callback!=false){//if false it override 
      callback=callback||this.fetchDataCallback
    }

    if(this.fetchAll==false){
      //this override helps to prevent recursive loop when not required
      fetchAll=false
    }

    if(!next && link=="next"){
      return;
    }

    const addExtraSearch=(link)=>{
      if(subQuery) return link
      let {extraSearch}=this.state; //extraSearch={}
      if(extraSearch){
        Object.keys(extraSearch).map(key=>{
          if(!extraSearch[key]){
            delete extraSearch[key]
          }
        })
        extraSearch=qs.stringify(extraSearch, {arrayFormat: 'index'})//foo[0]=1&foo[1]=2&foo[3]=3
        if(link.includes("?")){
          link=`${link}&${extraSearch}`
        }else{
          link=`${link}?${extraSearch}`
        }
      }
      return link
    }

    if(!urls) return;

    if(link=="start"){
      cached=[]
      link=urls?.start;
      link=addExtraSearch(link)
    }
    if(link=="next"){
      link=next
      is_next=true
      if(!next) return;
    }
    if(link=="search"){
      cached=[]
      link= urls?.start //api.getURL(urls.search, {item:{search:search||""}, type:"search"})
      
      if(urls.search_params){
        link=`${link}${urls.search_params}`
      }
      link=addExtraSearch(link)
      is_search=true
    }
    // console.log("link 103", link, "fetchAll", fetchAll)
    // if(!link || cached.includes(link)) return this.setState({loading:false, loadingMore:false});
    // !is_search && cached.push(link) //add to cached to avoid revisiting it. Avoid adding searches
    // this.setState({cached})
     api.api({link, token}) // token
       .then((res)=>{
        console.log(res);
        //console.log(res[resultsField]);
         let results=res[resultsField]||res.docs;
         console.log(results);
         if(is_next){
           results= [...this.state[resultsField]||[], ...results||[]]
         }
         var data={[resultsField]:results,[`${resultsField}_count`]:res.count, loadingMore: false}
         if(!subQuery){
           data={...data,  count:res.count, loading:false, next:res.next, previous:res.previous};
            if(extraFields){
              extraFields.map(field=>{
                data[field]=res[field]
              })
            }
         }else{//if subquery
            data={...data,  [`${resultsField}_count`]:res.count,  [`${resultsField}_next`]:res.next, [`${resultsField}_previous`]:res.previous};
            if(extraFields){
              extraFields.map(field=>{
                data[`${resultsField}_${field}`]=res[field]
              })
            }
         }
         this.setState(data, ()=>{
          // console.log("this.results",resultsField, "fetchAll", fetchAll,  this.state[resultsField].length, "callback", callback)
          callback && callback({...res, is_next, subQuery})

          if(maxPage && page>=maxPage) return; //break if maxpage was downloaded
          page+=1;
          fetchAll && res.next && this.fetchData({link:res.next, is_next:true, page, maxPage, callback, fetchAll, resultsField})
        });
       //console.log(data);
       }).catch(error=>{
         this.setState({loading:false, error})
       })
     }


  get=(obj, path, defaultValue)=>{
    return actions.Actions.getObject(obj, path, defaultValue)
  }

  componentDidMount(){
      // console.log("WINDOW : ", window);
      this.setState({height: window.innerHeight, width:window.innerWidth, isMounted:true});
      this.getItem()
      this.initializeCart()
      this._componentDidMount && this._componentDidMount()
  }

  handleSearch=(event)=>{
    const form = event.target;
 }

 initializeCart=()=>{
   const {basket={}}=this.session;
   this.setState({basket})
 }

 getWaitTime=({step=0, delayInterval=100}={})=>{
   return delayInterval*(1-Math.pow(Math.PI,  -1*(step/delayInterval)))
 }


 reset=(params={}, callback)=>{
   this.setState({fetchAll:false, places:[], next:null, years:[], results:[], voyages:[], routes:[], ...params},
     ()=>{
       callback && callback()
     })
 }


 updateSearch=(search, params={doNotSearch:false}) =>{
  
  let {extraSearch}=this.state;
  if( extraSearch && extraSearch.search){
    delete extraSearch.search
  }

  let parsedSearch=this.getSearchParams(search) //qs.parse(link);
  if(search && search.split("=").length==1){
    parsedSearch = this.getSearchParams(`search=${search}`) //qs.parse(link);
  }

  this.reset({places:[], fetchAll:false, extraSearch:{...extraSearch,...parsedSearch}}, ()=>{
        if(params.doNotSearch==true) return;
        setTimeout(()=>{//wait to make sure that recursive processes are stoped
             this.setState({fetchAll:true}, ()=>{
                this.fetchData({link:"search", search,
                     extraFields:["years", "months"],
                     callback:this.fetchDataCallback,
                   });
                 })
       }, 1000)
     }) //stop any recursive process
 }


  basketCount=()=>{
    const {basket={}}=this.state;
    return Object.keys(basket).length
 }

openCart=()=>{
  window.location=api.routes.cart
}

toast=({title, subtitle, body, showToast})=>{
      showToast=showToast ||this.state.showToast;
      return (<Toast show={showToast} onClose={()=>this.setState({showToast:false})}>
            <Toast.Header>
              {!!title && <strong className="mr-auto">{title}</strong>}
              {!!subtitle && <small>{subtitle}</small>}
            </Toast.Header>
            <Toast.Body>{body}</Toast.Body>
      </Toast>)
}

showAdvancedSearch=(isOpen=true)=>{
  this.setState({showAdvancedSearchModal:isOpen})
}

 renderAdvancedSearch=()=> {
   const {width, height, showAdvancedSearchModal, //extraSearch={},
           showToast=false, toastTitle, toastSubtitle, toastBody,
          }=this.state;
    let {extraSearch={}}=this.state;
   // console.log("extraSearch", extraSearch)
  if(!this.advanceFilters) return null
  return(
      <Modal  show={showAdvancedSearchModal} onHide={()=>this.showAdvancedSearch(false)}
      size="lg"
      // aria-labelledby="contained-modal-title-vcenter"
      centered
      // style={{width:0.9*width}}
      // className="container"
      >
          <Modal.Header closeButton>
            <Modal.Title>
              Advanced Search
              <br/>
              <small style={{fontSize:14}}>Type on the search box and then click on the suggested items</small>
            </Modal.Title>
          </Modal.Header>
        <Modal.Body>
        <Container className="d-flex">
          <Row>
          <Col xs={12}>
           {!!toastBody && <Toast show={showToast} onClose={()=>this.setState({showToast:false, toastTitle:null, toastSubtitle:null, toastBody:null})}>
                <Toast.Header>
                  {!!toastTitle && <strong className="mr-auto">{toastTitle}</strong>}
                  {!!toastSubtitle && <small>{toastSubtitle}</small>}
                </Toast.Header>
                <Toast.Body><div className="alert alert-warning">{toastBody}</div></Toast.Body>
          </Toast>}
          </Col>
          {this.advanceFilters.map((filter, index)=>{
            const {placeholder, suggestionDisplayName, suggestionDisplayNameSubtitle, searchURL}=filter
            return <Col xs={12} md={4} className="pt-2" key={index}>
                  <AutoSuggest 
                       onChange={this.setState.bind(this)}
                       updateSearch={this.updateSearch}
                       searchURL={searchURL}
                       value={extraSearch[suggestionDisplayName.searchName]}
                       placeholder={placeholder}
                       suggestionDisplayName={suggestionDisplayName}
                       suggestionDisplayNameSubtitle={suggestionDisplayNameSubtitle}
                   />
                   </Col>})}
          </Row>
       </Container>

        </Modal.Body>
        <Modal.Footer>
        <Button className="text-center" variant="secondary" onClick={()=>{
              this.advanceFilters.map((filter, index)=>{
                  const {suggestionDisplayName}=filter
                  extraSearch[suggestionDisplayName.searchName]=""
                  this.setState({extraSearch}, this.updateSearch)
              })
              // this.updateSearch()
              // this.showAdvancedSearch(false)
            }
          }>Clear Search</Button>

          <Button className="text-center" variant="primary" onClick={()=>{
              this.updateSearch()
              this.showAdvancedSearch(false)}
          }>Search</Button>
        </Modal.Footer>
      </Modal>
      )
}

toggleModal=()=>{
  const {isModalVisible}=this.state;
  let dataState={isModalVisible:!isModalVisible}
  if(isModalVisible){
    dataState={...dataState,  modalTitle:null, modalBody:null}
  }
  this.setState(dataState)
}

showAlert=(modalTitle, modalBody)=>{
  return this.setState({ modalTitle, modalBody}, this.toggleModal)
}

 renderModal=()=> {
   const {width, height, isModalVisible, 
           showToast=false, toastTitle, toastSubtitle, toastBody,
           modalTitle, modalBody,
          }=this.state;
   let {extraSearch={}}=this.state;

  return(
      <Modal  
      show={isModalVisible} 

      onHide={()=>this.toggleModal()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
          <Modal.Header closeButton>
            <Modal.Title>
             {modalTitle}
            </Modal.Title>
          </Modal.Header>
        <Modal.Body className="show-grid">
        <Container>
          {modalBody}
       </Container>
        </Modal.Body>
      </Modal>
     )
}

navigation=()=>{
    const {searchPlaceholder="Search.."}=this.state;
    return <Navbar bg="light" expand="lg" className="pb-6">
              <Link  href="/">
                <Navbar.Brand>
                  <Nav.Link onClick={()=>this.navigate("dhakira")}>
                    <Image src={assets.images.dhakiraLogo.default} fluid style={{height:60}} />
                  </Nav.Link>
                </Navbar.Brand>
              </Link>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                   <Nav.Link href={api.routes.home}>Introduction</Nav.Link>                  
                  
                  <NavDropdown title="Databases" id="basic-nav-dropdown">
                    <NavDropdown.Item href={api.routes.tables.voyages}>Voyages</NavDropdown.Item>
                    <NavDropdown.Item href={api.routes.tables.ships}>Ships</NavDropdown.Item>
                    <NavDropdown.Item href={api.routes.tables.places}>Places</NavDropdown.Item>                     
                  </NavDropdown>

                  {false && <NavDropdown title="Visualizations" id="basic-nav-dropdown">
                    <NavDropdown.Item href={api.routes.voyages}>Destination Popularity</NavDropdown.Item>
                    <NavDropdown.Item href={api.routes.places}>Voyages per Place</NavDropdown.Item>
                    <NavDropdown.Divider />
                     <NavDropdown.Item href={api.routes.ship}>Ship Tracking</NavDropdown.Item>
                    <NavDropdown.Item href={api.routes.routes}>Ships Routes</NavDropdown.Item>
                    {/*<NavDropdown.Item href={api.routes.ports}>Ports</NavDropdown.Item>*/}
                  </NavDropdown>}
                </Nav>
                  <Form inline onSubmit={this.handleSearch}>
                    {!!this.renderAdvancedSearch && <div onClick={()=>this.showAdvancedSearch(true)}>
                      <FiltersIcon size={"2.1em"} />
                    </div>}

                    {!!this.showSearch && <FormControl type="text" placeholder={searchPlaceholder} name="search" 
                      className="mr-sm-2"
                      value={this.state.search}
                      onChange={(e)=>this.setState({search:e.target.value})}
                     />}

                     {!!this.searchURL && this.hideSearch!==true && <div onClick={()=>this.showAdvancedSearch(true)}> <AutoSuggest 
                       onChange={this.setState}
                       searchURL={this.searchURL}
                       placeholder={this.placeholder}
                       updateSearch={this.updateSearch}
                       suggestionDisplayName={this.suggestionDisplayName}
                       suggestionDisplayNameSubtitle={this.suggestionDisplayNameSubtitle}
                       isQuickSearch={true}
                     /></div>}
                    {(!!this.showSearch) && <Button variant="outline-success" onClick={(e)=>this.updateSearch(this.state.search)}>Search</Button>}
                  </Form>
              </Navbar.Collapse>
            </Navbar>
  }
  
  render(){
      const {showToast=false, toastTitle, toastSubtitle, toastBody, height}=this.state;
      return (
        <div style={{minHeight:0.85*(height||500), paddingLeft:"5%", paddingRight:"5%"}} className="containerFluid" >
          {this.navigation && this.navigation()}
          {!!this.renderAdvancedSearch && this.renderAdvancedSearch()}
          {!!toastBody && <Toast show={showToast} onClose={()=>this.setState({showToast:false, toastTitle:null, toastSubtitle:null, toastBody:null})}>
                <Toast.Header>
                  {!!toastTitle && <strong className="mr-auto">{toastTitle}</strong>}
                  {!!toastSubtitle && <small>{toastSubtitle}</small>}
                </Toast.Header>
                <Toast.Body>{toastBody}</Toast.Body>
          </Toast>}
            {this.NoSSR && <NoSSR onSSR={<div>Loading...</div>}>
              {this.body && this.body()}
              </NoSSR>
            }
            {!this.NoSSR && this.body && this.body()}
            {this.renderModal()}
          </div>
       
      )
    }
}

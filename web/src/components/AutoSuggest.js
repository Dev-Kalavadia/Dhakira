import React, {Component} from "react";
import Autosuggest from 'react-autosuggest';
import {api, actions} from "src";
import _ from "lodash";

export default class AutosuggestComponent extends Component {
  constructor(props) {
    super(props);
    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: this.props.value||"",
      suggestions: [],
      results:[]
    };
    this.setState = this.setState.bind(this)
    this.suggestionDisplayName=this.props.suggestionDisplayName
    //this is usually a list
    this.suggestionDisplayNameSubtitle=this.props.suggestionDisplayNameSubtitle
    // console.log("this.suggestionDisplayNameSubtitle", this.suggestionDisplayNameSubtitle)
  }

 getObject=(item, path)=>{
   if(!path){
     path=this.suggestionDisplayName.name
   }
   let value= actions.Actions.getObject(item, path)
   if(value){
     return `${value}`
   }else{
     return value
   }
 }

componentDidMount() {
  this.fetchData()
}

distinct=(results, path)=>{
     return  _.uniqBy(results, (obj)=> {
              return this.getObject(obj, path);
            });
    }

// Teach Autosuggest how to calculate suggestions for any given input value.
getSuggestions = (value) => {
  const {results}=this.state;
  const {getSuggestions}=this.props;
  //if custome get suggestions is provided return it instead
  if(getSuggestions) return getSuggestions({results, value, updateState:this.setState})
  
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  let suggestions=results?.filter(item =>{
      let value=this.getObject(item)
      // console.log("value", value, "inputValue", inputValue, `${value}`.toLowerCase().includes(inputValue))
      if(!value) return false
      return `${value}`.toLowerCase().includes(inputValue)
    }
  )||[];
  // console.log("suggestions 101", suggestions, "results", results)
  suggestions=this.distinct(suggestions, this.suggestionDisplayName.name)
  // console.log("suggestions 102", suggestions)
  return suggestions
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
getSuggestionValue = suggestion => {
 const {getSuggestionValue}=this.props;
 if(getSuggestionValue) return getSuggestionValue(suggestion)
 return this.getObject(suggestion)
}

onSuggestionClick=({suggestion, value})=>{
  const {updateSearch, isQuickSearch}=this.props;
  const {searchPath, searchName, doNotSearch=true}=this.suggestionDisplayName||{}
  if(updateSearch){
    if(searchPath && searchName){
      updateSearch(`&${searchName}=${this.getObject(suggestion, searchPath)||value}`, {doNotSearch:!isQuickSearch||!this.suggestionDisplayName.isQuickSearch})
    }
  }
  // alert(JSON.stringify(suggestion))
}

debounceUpdateSearch=_.debounce(()=>{
  let {value}=this.state;
  const {updateSearch, isQuickSearch}=this.props;
  const {searchPath, searchName, doNotSearch=true}=this.suggestionDisplayName||{}
  // console.log("debounceUpdateSearch", value)
  updateSearch(`&${searchName}=${value}`, {doNotSearch:!isQuickSearch||!this.suggestionDisplayName.isQuickSearch})
}, 1000)

// Use your imagination to render suggestions.
renderSuggestion = suggestion => {
  const {renderSuggestion}=this.props;
  const subs=this.suggestionDisplayNameSubtitle
  const subsList=this.getObject(suggestion, subs?.list)||[]
  if(renderSuggestion) return renderSuggestion(suggestion)

  return <div onClick={()=>this.onSuggestionClick({suggestion})}>
    {this.getObject(suggestion)}
    {subs && subsList.length>0 && <div style={{fontSize:10, flexDirection:"row", color:"gray"}} >
      {subsList.map(
      	(sub, index)=>{
        let name=this.getObject(sub, subs.name)
        let value=this.getObject(sub, subs.value)
        return <span>{name}{value?`-${value}`:""}{index==subsList.length-1?"":", "}</span>}
        )}
      </div>
    }     
  </div>
}

  fetchData=({search=""}={})=>{
    const {token, searchURL}=this.props;
    if(searchURL){
          const link=`${searchURL}&search=${search}`;
          api.api({link, token})
          .then(res=>{
            this.setState({results:res.results})
            // console.log("this.state.results.length", this.state.results.length)
          }).catch(error=>{
            // console.log("Error fetching search results", error)
          })
      }
  }


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    }, this.debounceUpdateSearch
    );
    //fetch data from URL and update search results
    const {onChange}=this.props;
    this.fetchData({search:newValue})
    
    if(onChange) {
        onChange({
        search: newValue
      })
    }
  }
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  }

  componentDidUpdate=(prevProps)=>{ 
    // console.log("12012", prevProps.value, this.props.value)
    const {value}=this.props;
    if(prevProps.value!==value){
         this.onChange(null, {newValue:value||""})
         // const {updateSearch, isQuickSearch}=this.props;
         // const {searchPath, searchName, doNotSearch=true}=this.suggestionDisplayName||{}
         // updateSearch(`&${searchName}=${value}`, {doNotSearch:!isQuickSearch||!this.suggestionDisplayName.isQuickSearch})
    }
  }

  render() {
    const { value, suggestions} = this.state;
    const { placeholder="Search..." }=this.props;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange
    };
    // console.log("suggestions", suggestions)
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
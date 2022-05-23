import React, {Component} from "react";
import {actions} from "src"

export default class Delayed extends Component {
    constructor(props){
        super(props);
        this.state = {hidden : true};
        this.timer=null;
    }

    componentDidMount(){
        this._isMounted=true
    }

    componentWillUnmount() {
       this._isMounted=false
    }

    componentDidMount=async()=>{
        let {wait=1000}=this.props;
        // const startDate=new Date().getTime()
        // console.log("wait", wait, startDate)
        await actions.Actions.sleep(wait)
        // const endDate=new Date().getTime()
        // console.log("waitDifference", startDate-endDate)
       this.setState({hidden: false});
    }

    render() {
        return this.state.hidden ? '' : this.props.children;
    }
}
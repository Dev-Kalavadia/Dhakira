import React, {Component} from "react";
import Link from "next/link";
import {Core, api} from "src"
import {Card, Button, Container, Jumbotron} from "react-bootstrap"
export default class Home extends Core {
	constructor(props) {
	  super(props);
	  this.state = {};
	  this.renderAdvancedSearch=null;
	}
	body=()=>{
		return <div>
		<Jumbotron>
		  <h1>The shipping Database</h1>
		  <div className="alert alert-info">
			  <p>
			    Explore ship voyages through interactive maps. Click on a place marker to see ships which departed or arrived at that specific place.
			  </p>
			  <p>
			   <a className="btn btn-primary" href={api.routes.places}>Explore</a>
			  </p>
		  </div>
		 <div className="alert alert-info">
			  <p>
			    Explore popularity of places with time. The buble size corresponds to the number of ships at arrived and departed from the place.
			  </p>
			  <p>
			   <a className="btn btn-primary" href={api.routes.voyages}>Explore</a>
			  </p>
		  </div>

		  <div className="alert alert-info">
			  <p>
			    Or simply visualize all the shipping routes at once.
			  </p>
			  <p>
			   <a className="btn btn-primary" href={api.routes.routes}>Explore</a>
			  </p>
		  </div>

		</Jumbotron>
		</div>
	}

}

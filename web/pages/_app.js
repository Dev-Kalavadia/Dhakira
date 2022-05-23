import '../style/index.css'
import React from "react";
import Head from "next/head";
import {api, assets} from "src"


export default class App extends React.Component{
	constructor(props) {
	  super(props);
	  // this.state = {};
	}

  footer(){
    return <footer className="footer container text-center pt-4">
		    <div>
		      <span>Shipping Database{" "}|{" "}</span>
		      <a href={api.routes.dhakira}>
		      	 <span>&copy;2020 Dhakira</span>
		      </a>
		      <a href={api.routes.contact}>
		      	<span>{" "}|{" "}Contact Us</span>
		      </a>
		    </div>
		  </footer>
		
  }


	render(){
		const {Component, pageProps}=this.props;
		// console.log("pageProps", pageProps)
		return <div>
 			<Head>
	            <meta name="viewport" content="width=device-width, initial-scale=1" />
	            <meta charSet="utf-8" />
	            <title>Dhakira|Shipping Database</title>
	            {/* font */}
          		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Space+Mono&display=swap" />
          		<link rel="stylesheet" href="//unpkg.com/leaflet@1.6.0/dist/leaflet.css" />
	            <link rel="icon" href={assets.images.dhakiraLogo.default} />
	          </Head>
			  <Component params={pageProps} />
			  {this.footer()}
		</div>
	}
}




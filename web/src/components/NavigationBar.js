import React from "react"
import {Button,Navbar,Nav,NavDropdown,Form,FormControl,Image} from 'react-bootstrap';
import {api,assets} from "src";
import Link from 'next/link';
import {TiThListOutline as FiltersIcon} from "react-icons/ti";
import AutoSuggest from "./AutoSuggest";

export default function NavigationBar() {
    return <Navbar bg="light" expand="lg" className="pb-6" style={{paddingLeft:"5%", paddingRight:"5%"}}>
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
                </Nav>
              </Navbar.Collapse>
              <label><input class="react-autosuggest__input" placeholder="Search" type="text"/></label>
            </Navbar>
}
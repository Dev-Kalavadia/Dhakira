import React, {useEffect} from "react";
import {useState} from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {Loading} from "src/components"
import BootstrapTable from 'react-bootstrap-table-next';
import {Table,Navbar,Nav,NavDropdown,Image,Button, Row, Col,Container, Modal} from 'react-bootstrap';
import {api,assets} from "src";
import Link from 'next/link';

export default function DataTable() {

    const [count, setCount] = useState(0);
    const [voyagesData, setVoyagesData] = useState([])
    const [voyagesData2, setVoyagesData2] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [sortType, setSortType] = useState("asc")
    const [sortBy, setSortBy] = useState("_id")
    const [hasMore, setHasMore] = useState(false)
    const [show, setShow] = useState(false)
    const [advsearch, setAdvsearch] = useState(false)
    function cellFormatter(cell, row) {
        return ( 
          <a href="#">{cell}</a>
        );
    }
    function headerFormatter(column, colIndex) {
        return (
          <a href="#">{ column.text }</a>
        );
      }
    const columns = [
        {
            dataField: '_id',
            text: 'Voyage Code',
            sort: false,
            formatter: cellFormatter,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('_id');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        },
        {
            dataField: 'shipName',
            text: 'Ship Name',
            sort: false,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('shipName');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        },
        {
            dataField: 'ID',
            text: 'Ship Code',
            sort: false,
            formatter: cellFormatter,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('ID');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        },
        {
            dataField: 'departurePlace',
            text: 'Departure Place',
            sort: false,
            formatter: cellFormatter,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('departurePlace');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        },
        {
            dataField: 'depCode',
            text: 'Departure Code',
            sort: false,
            formatter: cellFormatter,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('depCode');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        },
        {
            dataField: 'departureDate',
            text: 'Departure Date',
            sort: false,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('departureDate');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        },
        {
            dataField: 'arrivalPlace',
            text: 'Arrival Place',
            formatter: cellFormatter,
            headerFormatter: headerFormatter,
            sort: false,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('arrivalPlace');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        }, {
            dataField: 'arrCode',
            text: 'Arrival Code',
            formatter: cellFormatter,
            headerFormatter: headerFormatter,
            sort: false,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('arrCode');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        }, {
            dataField: 'arrivalDate',
            text: 'Arrival Date',
            sort: false,
            headerFormatter: headerFormatter,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('arrivalDate');
                    if (sortType=='asc'){
					    setSortType('desc');
                    }
                    else {
                        setSortType('asc');
                    }
				}
			}
        }
    ]
    const filters=[
        {
            placeholder:"Departure Place...",
        },
        {
            placeholder:"Departure Code From...",
        },
        {
            placeholder:"Departure Code To...",
        },
        {
            placeholder:"Arrival Place...",
        },
        {
            placeholder:"Arrival Place Code From...",
        },
        {
            placeholder:"Arrival Place...",
        },	
        {
            placeholder:"Voyage Code...",
        },
        {
            placeholder:"Ship Name...",
        },
        {
            placeholder:"Other Ship Names...",
        },
        {
            placeholder:"Ship Code...",
        },
        {
        placeholder:"Arrival Year Start...",
        }, 
        {
        placeholder:"Arrival Year End...",
        },
    ]

    useEffect(() => {
        getData()
    }, [sortType, pageNumber, sortBy])

    const loadMore = () => {
        if (pageNumber != Math.floor(count/100)) {
            setPageNumber(pageNumber + 1)
            setHasMore(true)
        }
    }

    const getData = async () => {
        
        setHasMore(false)

        const results = await fetch(`http://localhost:3000/voyages?skip=${pageNumber*100}&sortBy=${sortBy}&sortType=${sortType}`)
        
        const data = await results.json()

        data.docs.forEach((dataPoint, idx) => {
            let tempData = dataPoint

            // if the arrival date exists create display string
            if (dataPoint.arrivalDate.year && dataPoint.arrivalDate.month && dataPoint.arrivalDate.date) {
                tempData.arrivalDate = `${dataPoint.arrivalDate.year}-${dataPoint.arrivalDate.month}-${dataPoint.arrivalDate.date}`
            } else {
                tempData.arrivalDate = "-"
            }

            // if the departure date exists create display string
            if (dataPoint.departureDate.year && dataPoint.departureDate.month && dataPoint.departureDate.date) {
                tempData.departureDate = `${dataPoint.departureDate.year}-${dataPoint.departureDate.month}-${dataPoint.departureDate.date}`
            } else {
                tempData.departureDate = "-"
            }
        })

        const joinedData = voyagesData.concat(data.docs)
        setVoyagesData(joinedData) // issue is here
        setHasMore(Math.floor(data.count/100) != pageNumber)
        setCount(data.count)
        console.log(data);
        console.log(voyagesData);
    }

    const closeadvsearch = () => {
        setAdvsearch(false);
    }

    const closeextrainfo = () => {
        setShow(false);
    }

    const extrainfo = async () =>{
        const results2 = await fetch(`http://localhost:3000/voyages/1`)
        const data2 = await results2.json()
        console.log({data2})
        const a = Object.assign({}, data2);
        // data2.forEach((dataPoint) => {
            //     let tempData2 = dataPoint
            if (a.arrivalDate.year && a.arrivalDate.month && a.arrivalDate.date) {
                a.arrivalDate = `${a.arrivalDate.year}-${a.arrivalDate.month}-${a.arrivalDate.date}`
            } else {
                a.arrivalDate = "-"
            }
            
            if (a.departureDate.year && a.departureDate.month && a.departureDate.date) {
                a.departureDate = `${a.departureDate.year}-${a.departureDate.month}-${a.departureDate.date}`
            } else {
                a.departureDate = "-"
            }
            setVoyagesData2(a);
            console.log({a, voyagesData2});
        // })
        //if (typeof(voyagesData2)!='undefined'){
        setShow(true);
       // }
    }
      
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            extrainfo();
        },
    };

    return <div style={{minHeight: "642.6px", paddingLeft: "2%", paddingRight: "2%"}} class="containerFluid">
    <Navbar bg="light" expand="lg" className="pb-6">
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
        <label onClick={()=>{setAdvsearch(true)}}><input class="react-autosuggest__input" placeholder="Search" type="text" disabled/></label>
    </Navbar>
    <div className="alert alert-info">
        Total results: {Number(count||0)}
    </div>
    <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={<Loading />}
        >
        <BootstrapTable 
            //bootstrap4
            keyField="voyagecode"
            data={voyagesData}
            columns={columns}
            rowEvents={ rowEvents }
            striped
            hover
            condensed
            defaultSorted={[{
                dataField: '_id',
                order: 'asc',
            }]} 
        />
    </InfiniteScroll>
    {/* Extra info */}
    {!!voyagesData2 && <Modal
        show={show} 
        onHide={closeextrainfo}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="show-grid">
            <Container>
                <Table striped bordered hover>
		          <tbody>
		            {Object.keys(voyagesData2).map((key, index)=><tr key={index}>
		                      <td>{key}</td>
		                      <td>{voyagesData2[key]}</td>
		                    </tr>
		                )}
		          </tbody>
		        </Table>
            </Container>
        </Modal.Body>
    </Modal>}
    {/* Filter search */}
    {<Modal show={advsearch} onHide={closeadvsearch} size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title>Advanced Search<br/><small style={{fontSize:14}}>Fill the fields below</small></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container className="d-flex">
          <Row>
          {filters.map((filter, index)=>{
            const {placeholder}=filter
            return <Col xs={12} md={4} className="pt-2" key={index}>
                <label><input style={{outline: "none"}} class="react-autosuggest__input" placeholder={placeholder} type="text"/></label>
                </Col>})}
          </Row>
        </Container>
        </Modal.Body>
        <Modal.Footer>
        <Button className="text-center" variant="secondary" onClick={()=>{
            // clear everything
            }
          }>Clear</Button>
          <Button className="text-center" variant="primary" onClick={()=>{
            // search
             }
          }>Search</Button>
        </Modal.Footer>
      </Modal>}
    </div>
}

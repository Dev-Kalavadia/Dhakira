import React, {useEffect} from "react";
import { useState} from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {Loading} from "src/components"
import BootstrapTable from 'react-bootstrap-table-next';
import Navbar from "src/components/NavigationBar.js";
import {Container, Modal} from 'react-bootstrap';
import { Table} from 'react-bootstrap';

export default function DataTable() {

    const [count, setCount] = useState(0);
    const [placesData, setplacesData] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [sortType, setSortType] = useState("asc")
    const [sortBy, setSortBy] = useState("_id")
    const [hasMore, setHasMore] = useState(false)
    const [show, setShow] = useState(false)
    const columns = [
        {
            dataField: '_id',
            text: 'Place Code',
            sort: false,
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
            dataField: 'placeName',
            text: 'Place Name',
            sort: false,
            headerEvents: {
				onClick: (e, column, columnIndex) => {
                    setSortBy('placeName');
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
            dataField: 'modernName',
            text: 'Modern name',
            sort: false,
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
            dataField: 'region',
            text: 'Region',
            sort: false,
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

        const results = await fetch(`http://localhost:3000/places?skip=${pageNumber*100}&sortBy=${sortBy}&sortType=${sortType}`)
        //const results = await fetch(`http://localhost:3000/places/search?placeName=amsterdam&skip=0`)
        //const results = await fetch(`http://localhost:3000/places?skip=0&arrivalFrom=1595&arrivalTo=1595&date=1`)
        const data = await results.json()

        data.docs.forEach((dataPoint, idx) => {
            let tempData = dataPoint
            if (dataPoint.arrivalDate.year && dataPoint.arrivalDate.month && dataPoint.arrivalDate.date) {
                tempData.arrivalDate = `${dataPoint.arrivalDate.year}-${dataPoint.arrivalDate.month}-${dataPoint.arrivalDate.date}`
            } else {
                tempData.arrivalDate = "-"
            }

            if (dataPoint.departureDate.year && dataPoint.departureDate.month && dataPoint.departureDate.date) {
                tempData.departureDate = `${dataPoint.departureDate.year}-${dataPoint.departureDate.month}-${dataPoint.departureDate.date}`
            } else {
                tempData.departureDate = "-"
            }
        })
        setplacesData(placesData.concat(data.docs)) // issue is here
        setHasMore(Math.floor(data.count/100) != pageNumber)
        setCount(data.count)
        console.log(data);
        console.log(placesData);
    }

    const togglePop = () => {
        setSeen(!seen);
    };

    const extrainfo = async () =>{
        const results2 = await fetch(`http://localhost:3000/places/1`)
        const data2 = await results2.json()
        console.log(data2);
        // data2.forEach((dataPoint) => {
        //     let tempData2 = dataPoint
        //     if (dataPoint.arrivalDate.year && dataPoint.arrivalDate.month && dataPoint.arrivalDate.date) {
        //         tempData2.arrivalDate = `${dataPoint.arrivalDate.year}-${dataPoint.arrivalDate.month}-${dataPoint.arrivalDate.date}`
        //     } else {
        //         tempData2.arrivalDate = "-"
        //     }

        //     if (dataPoint.departureDate.year && dataPoint.departureDate.month && dataPoint.departureDate.date) {
        //         tempData2.departureDate = `${dataPoint.departureDate.year}-${dataPoint.departureDate.month}-${dataPoint.departureDate.date}`
        //     } else {
        //         tempData2.departureDate = "-"
        //     }
        // })
        setShow(true);
        return (<Modal  
            show={show} 
            onHide={setShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="show-grid">
                <Container>
                <Table striped bordered hover>
		          <tbody>
                        <tr>
		                    <td>{data2[0]}</td>
		                    <td>{data2[1]}</td>
		                </tr>
		          </tbody>
		        </Table>
            </Container>
                </Modal.Body>
        </Modal>)
    }

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            extrainfo();
        },
    };

    return <div>
    <Navbar />
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
            data={placesData}
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
    </div>
}

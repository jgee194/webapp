import React from 'react'
import Axios from 'axios';
import { connect } from 'react-redux';
//import Accordian from '../components/Accordian';

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

const useStyles = theme => ({
    table: {
        width: `100%`
    },
});



class EventHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerId: this.props.user.id,
            eventHistory: []
        }
    }

    componentDidMount() {

        Axios.post("https://backend-for-test.herokuapp.com/api/history/event", [this.state.customerId], {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                this.setState({
                    eventHistory: res.data
                })

            })
            .catch(err => {
                console.log(err);

            })


    }

    historyloop(history) {
        return history.map(value => {

            return value.name + " " + value.arrivalTime + value.departureTime + " \n"
        })
    }

    //render startTime in row
    renderArrival = (rowData) => {
        let splitDate = rowData.arrivalTime.split("/");
        let splitYear =  splitDate[2].split(" ");
        let splitTime = splitYear[1].split(":");
        return(
            <div className="row-date">
                <p>{splitYear[0].slice(0, -1)}</p>
                <h2>{splitDate[0] + "/" + splitDate[1]}</h2>
                <p>{splitTime[0] + ":" + splitTime[1] + " " + splitYear[2]}</p>
            </div>
        );
    }

    //render endTime in row
    renderDeparture = (rowData) => {
        let splitDate = rowData.departureTime.split("/");
        let splitYear =  splitDate[2].split(" ");
        let splitTime = splitYear[1].split(":");
        return(
            <div className="row-date">
                <p>{splitYear[0].slice(0, -1)}</p>
                <h2>{splitDate[0] + "/" + splitDate[1]}</h2>
                <p>{splitTime[0] + ":" + splitTime[1] + " " + splitYear[2]}</p>
            </div>
        );
    }

    //render details (parking lot, car number, etc) in row
    renderDetails = (rowData) => {
        return(
            <div>
                <p>{rowData.parkingLotName}</p>
            </div>
        );
    }


    render() {
        return (
            <div className="history-table">
            <MaterialTable
                title="停車"
                columns={[
                    { title: "入場", field: 'arrivalTime', headerStyle: { textAlign: "center" }, render: rowData => this.renderArrival(rowData) },
                    { title: "出場", field: 'departureTime', searchable: false, headerStyle: { textAlign: "center" }, render: rowData => this.renderDeparture(rowData) },
                    { title: "場地", field: 'parkingLotName', headerStyle: { textAlign: "center" }, render: rowData => this.renderDetails(rowData) }
                ]}
                data={
                    this.state.eventHistory.map((row) => {
                        return({
                            arrivalTime: new Date(row.arrivalTime).toLocaleString(), 
                            departureTime: new Date(row.departureTime).toLocaleString(), 
                            parkingLotName: row.parkingLotName 
                        })
                    })
                }        
                options={{
                    sorting: true
                }}
            />
        </div>

        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan
})
export default connect(mapStateToProps)(withStyles(useStyles)(EventHistory));
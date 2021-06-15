import React from 'react'
//import Axios from 'axios';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

const useStyles = theme => ({
    table: {
        minWidth: `100%`,
        width: 1 / 2
    },
});


class PurchaseHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerId: this.props.user.id,
            paymentHistory: [],
        }
    }

    //render startTime in row
    renderStart = (rowData) => {
        let splitDate = rowData.startTime.split("/");
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
    renderEnd = (rowData) => {
        let splitDate = rowData.endTime.split("/");
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
                    title="方案"
                    columns={[
                        { title: "購買", field: 'startTime', headerStyle: { textAlign: "center" }, render: rowData => this.renderStart(rowData) },
                        { title: "截止", field: 'endTime', searchable: false, headerStyle: { textAlign: "center" }, render: rowData => this.renderEnd(rowData) },
                        { title: "其他", field: 'parkingLotName', headerStyle: { textAlign: "center" }, render: rowData => this.renderDetails(rowData) }
                    ]}
                    data={
                        this.props.plan.map((row, index) => {
                            return({
                                startTime: new Date(row.startTime).toLocaleString(), 
                                endTime: new Date(row.endTime).toLocaleString(), 
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
export default connect(mapStateToProps)(withStyles(useStyles)(PurchaseHistory));
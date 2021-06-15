import React from 'react'
import Axios from 'axios';
import { connect } from 'react-redux';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
//import Accordian from '../components/Accordian';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = theme => ({
    table: {
        minWidth: 500,
        width: 1/2
      },
});



class EventHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            customerId : this.props.user.id, 
            eventHistory : []
        }
    }

    componentDidMount() {

        Axios.post("http://localhost:3030/api/history/event", [this.state.customerId], {
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

    historyloop(history){
        return history.map(value => {
        
            return value.name + " " + value.arrivalTime + value.departureTime + " \n"
        })
    }


    render(){
        const { classes } = this.props;
        return(
            <div>
                <PageTitle title="停車紀錄"/>
                <center>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>停車場</TableCell>
                            <TableCell align="right">進場時間</TableCell>
                            <TableCell align="right">離場時間</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.eventHistory?.length < 1 ? "無停車紀錄" : this.state.eventHistory.map((row) => (
                            <TableRow key={row.arrivalTime}>
                            <TableCell component="th" scope="row">
                                {row.parkingLotName}
                            </TableCell>
                            <TableCell align="right">{ new Date(row.arrivalTime).toLocaleString() }</TableCell>
                            <TableCell align="right">{new Date(row.departureTime).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                        
                    </Table>
                </TableContainer>
                </center>
                <Link to = '/purchasehistory'>前往購買紀錄</Link>
            </div>

        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan   
})
export default connect (mapStateToProps) (withStyles(useStyles)(EventHistory));
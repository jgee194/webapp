import React from 'react'
//import Axios from 'axios';
import { connect } from 'react-redux';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';

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


class PurchaseHistory extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            customerId : this.props.user.id, 
            paymentHistory: [],
        }
    }
   
 

    render(){
        const { classes } = this.props;
        return(
            <div>
                <PageTitle title="購買紀錄"/>
                
                <center>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>停車場</TableCell>
                            <TableCell align="right">購買時間</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        { this.props.plan?.length < 1 ? "No History": this.props.plan.map((row, index) => (
                            <TableRow key={row.parkingLotName + index}>
                            <TableCell component="th" scope="row">
                                {row.parkingLotName}
                            </TableCell>
                            <TableCell align="right">{new Date(row.startTime).toLocaleString()}</TableCell>
                           
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </center>
                <Link to = '/eventhistory'>前往停車紀錄</Link>
            </div>

        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan   
})
export default connect (mapStateToProps)(withStyles(useStyles)(PurchaseHistory));
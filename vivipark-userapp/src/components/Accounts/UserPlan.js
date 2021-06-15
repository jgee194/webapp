import React from 'react'
import Axios from 'axios';
import { connect } from 'react-redux';
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

class UserPlan extends React.Component{
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



    render(){
        const { classes } = this.props;
        return(
            <div>

                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>停車場</TableCell>
                            <TableCell align="right">方案使用開始時間</TableCell>
                            <TableCell align="right">方案使用結束時間</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.props.plan?.length < 1  ? "尚未購買方案" : this.props.plan.map((row) => (
                            
                            <TableRow key={row.planId + row.startTime}>
                            <TableCell component="th" scope="row">
                                {row.parkingLotName}
                            </TableCell>
                            <TableCell align="right">{new Date(row.startTime).toLocaleString()}</TableCell>
                            <TableCell align="right">{new Date(row.endTime).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan   
})
export default connect (mapStateToProps) (withStyles(useStyles)(UserPlan));
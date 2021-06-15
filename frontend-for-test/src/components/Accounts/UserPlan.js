import React from 'react'
// import Axios from 'axios';
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
        minWidth: 300, //it were 500 when there r 3 coloums
        width: 1 / 3, // ut were 1/2 when there r 3 col
    },
});

class UserPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerId: this.props.user.id,
            eventHistory: []
        }
    }

    // componentDidMount() {

    //     Axios.post("https://backend-for-test.herokuapp.com/api/history/event", [this.state.customerId], {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     })
    //         .then(res => {
    //             this.setState({
    //                 eventHistory: res.data
    //             })
    //         })
    //         .catch(err => {
    //             console.log(err);

    //         })


    // }
    



    render() {
        const { classes } = this.props;
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table width = "2000px"className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell width = "70px"align="left">停車場</TableCell>
                                {/* <TableCell width = "260px" align="right">方案使用開始時間</TableCell> */}
                                <TableCell width = "1000px"align="center">使用車輛</TableCell>
                                <TableCell width = "100px"align="right">方案結束日</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.plan?.length < 1 ? "尚未購買方案" :  this.props.plan.map((row) => (
                                new Date() <= new Date(row.endTime) ? 
                                <TableRow key={row.planId + row.startTime}>
                                    <TableCell component="th" scope="row">
                                        {row.parkingLotName}
                                    </TableCell>
                                    {/* <TableCell  align="right">{ new Date(row.startTime).toLocaleString()}</TableCell> */}
                                    <TableCell  align="center">{row.carNum}</TableCell>
                                    <TableCell  align="right">{new Date(row.endTime).toLocaleString().split(',')[0]}</TableCell>
                                </TableRow> : ""

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
export default connect(mapStateToProps)(withStyles(useStyles)(UserPlan));
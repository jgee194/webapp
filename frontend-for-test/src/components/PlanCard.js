import React, { useState } from 'react'
import Axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

import { storePlan } from '../actions/planActions';
import LoadSpinner from "./LoadSpinner";
// import Modal from "./Modal";
import './plancard.css';
//import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

function PlanCard(props) {

    const classes = useStyles();

    const [status, setStatus] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [car, setCar] = React.useState("");

    //Modal functions
    const handleChange = (event) => {
        if (event != null) {
            setCar(event.target.value);
        }


    };

    const handleBuy = () => {
        trackPromise(
            Axios.post("https://backend-for-test.herokuapp.com/api/shop/buyPlan", {
                user: props.user,
                car: car,
                plan: props.plan
            })
                .then(res => {

                    console.log(res.data)
                    setStatus(res.data.msg);
                    props.storePlan(res.data.plans);
                    //shows modal based on unique identfier
                    // const modal = document.getElementById("plan-card-" + props.identifier);
                    // modal.style.display = 'flex';
                })
                .catch(err => {
                    console.log(err);
                })
        )
    }

    //exits car modal without action
    const handleCloseExit = () => {
        setOpen(false);
        setStatus("");
        setCar("");
    }

    //exits car modal and opens the door
    const handleCloseSubmit = () => {
        handleBuy();
    }



    return (
        <div className='plan-card-outer'>
            {/* <Modal identifier={"plan-card-" + props.identifier}>{status}</Modal> */}
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>請選擇綁定車號</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-native">車牌</InputLabel>
                            <Select
                                native
                                value={car}
                                onChange={handleChange}
                                input={<Input id="demo-dialog-native" />}
                            >
                                <option aria-label="None" value="" />
                                {props.cars.map((car) => <option key={car} value={car.carId}>{car.carNum}</option>)}
                            </Select>
                            <FormHelperText> {status} </FormHelperText>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button component={Link} to="/account" color="primary">
                        新增其他車輛
                    </Button>

                    <Button onClick={handleCloseExit} color="primary">
                        離開
                    </Button>
                    <Button onClick={handleCloseSubmit} disabled={car === ""} color="primary">
                        購買
                    </Button>
                </DialogActions>
            </Dialog>
            <LoadSpinner />
            <div className="plan-card">
                <h2>停車場: {props.plan.parkingLotName}</h2>
                <h3>停車天數: {props.plan.timeSpan} days</h3>
                <p>地址: {props.plan.location}</p>
                <button className="buy-button" onClick={() => setOpen(true)}>購買</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    sharedCars: state.sharedCars.sharedCars
})

export default connect(mapStateToProps, {storePlan})(PlanCard);

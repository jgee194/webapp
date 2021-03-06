import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';

import { updateUserFromDatabase } from '../../actions/userActions';
//import './AddCars.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from '@material-ui/core/FormControl'


import "@reach/combobox/styles.css";
// import {
//   withStyles,
//   ThemeProvider,
//   createMuiTheme,
// } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));


const UpdatePhone =(props) => {

    const [open, setOpen] = React.useState(true);
    const [phoneNum, setPhoneNum] = useState("");
    const [status, setStatus] = React.useState("");
    const [submitStatus, setSubmitStatus] = React.useState(true);
    const [phoneError, setPhoneError] = React.useState(false);
    const [phoneStatus, setPhoneStatus] = React.useState("");
    const [verification, setVerification] = React.useState(false);
    const [vcodeInput, setVcodeInput] = React.useState("");
    const [vcode, setVcode] = React.useState("");
    const [vcodeGenerated, setVcodeGenerated] = React.useState(false);
    

    const [verificationError, setVerificaitonError] = React.useState(false);
    const [verificationStatus, setVerificationStatus] = React.useState("");

    const handleCloseExit = () => {
        setOpen(false);
        setPhoneStatus ("");
        setPhoneError(false);
    }
    const handlePhoneNum = (event) => {
        setPhoneNum(event.target.value);
    }
    const handleVerificationNum = (event) => {
        setVcodeInput(event.target.value);
    }





    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (phoneNum.length !== 10) {
            setPhoneError(true);
            setPhoneStatus("?????????????????????");

            return;
        }else{
            setVerification (true);
            setSubmitStatus(false);
            Axios.post("https://backend-for-test.herokuapp.com/api/accounts/verification", {
                phone: phoneNum
           
            })
                .then((res) => {
                console.log(typeof res.data.vcode);
                console.log( res.data.vcode);
     
                if (typeof res.data.vcode === "number") {
                    setStatus("??????????????????????????????????????????");
                    setVcode("" + res.data.vcode);
                    setSubmitStatus(false);
                    setVcodeGenerated(true);

                } else {
                    setStatus(res.data);
                    setSubmitStatus(true);
                }

                

                console.log(res);
                })
                .catch((err) => {
                console.log(err);
                setStatus("???????????????");
                setSubmitStatus(true);
                });
        }   
    }
    const handleVcodeSubmit = (event) => {
        console.log(vcode === vcodeInput);
        console.log(vcode);
        console.log( typeof vcode);
        console.log(vcodeInput);
        console.log( typeof vcodeInput);
        if(vcode === vcodeInput){
            
            Axios.post("https://backend-for-test.herokuapp.com/accounts/phoneNum", [props.user.id, phoneNum], {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(res => {
                    console.log(res);
                    setStatus("????????????, ???????????????")
                    props.updateUserFromDatabase(props.user);
                })
                .catch(err => {
                    console.log(err);
        
                    setStatus("server error")
                })   
        }else{
            setVerificaitonError(true);
            setVerificationStatus("???????????????")
            setSubmitStatus(true);
        }

    }
    

    


    const classes = useStyles();


    return (
        <div className='add-cars'>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>??????????????????????????????</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <TextField error={phoneError} id="outlined-basic" helperText={phoneStatus} onChange={handlePhoneNum} label="?????????????????? #" variant="outlined" placeholder="ex: 09xxxxxxxx" />
                            <br/>
                            {verification && <TextField error={verificationError} id="outlined-basic" helperText={verificationStatus} onChange={handleVerificationNum} label="???????????????????????? #" variant="outlined" placeholder="ex: " /> }
                           
                            {status}
                            
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    {vcodeGenerated && <Button onClick={handleVcodeSubmit}  color="primary">
                        ???????????????
                    </Button>}
                    <Button onClick={handleCloseExit} color="primary">
                        ??????
                    </Button>
                    <Button onClick={handleSubmit} disabled = {!(phoneNum !== "" && submitStatus)} color="primary">
                        ??????
                    </Button>
                </DialogActions>
            </Dialog>


            {/* <form onSubmit={handleSubmitPhoneNum} className="form-div-addcars">
                <label htmlFor="cars"></label>
                    ?????????????????? <input id="cars" name="phoneNum" value={phoneNum} placeholder="?????????????????????" onChange={event => setPhoneNum(event.target.value)} required />
                <input type="submit" className="submit-button"></input>
            </form>
            <Modal identifier={"updatePhone"}>{phoneNumStatus}</Modal> */}
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan
})

export default connect(mapStateToProps, { updateUserFromDatabase })(UpdatePhone);
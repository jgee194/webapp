import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Axios from 'axios';
import { connect } from 'react-redux';
import GroupAdd from '@material-ui/icons/GroupAdd';
import "@reach/combobox/styles.css";

import { updateCarFromDatabase } from '../../actions/carActions';

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

const ShareCar = (props) => {

    const [open, setOpen] = React.useState(false);
    const [phone, setPhone] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [error, setError] = React.useState(false);

    //opens modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    //exits car modal without action
    const handleCloseExit = () => {
        setOpen(false);
        setStatus("");
        setError(false);
    }

    //exits car modal and opens the door
    const handleSubmit = () => {
        if (phone === props.user.phone) {
            setError(true);
            setStatus("Cannot share car with yourself!");
            return;
        }
        Axios.post("https://backend-for-test.herokuapp.com/api/accounts/shareCar", {
            car: { carNum: props.carNum, carId: props.carId },
            phone: phone
        })
            .then((res) => {
                console.log(res.data);
                if (res.data.changed === 0 && res.data.affected === 1) {
                    setError(true);
                    setStatus("Already Shared with this user");
                } else if (res.data.changed === 0) {
                    setError(true);
                    setStatus("Invalid Phone #");
                } else {
                    setError(false);
                    setStatus("Successfully Shared Car");
                    props.updateCarFromDatabase(props.user);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleChange = (event) => {
        setPhone(event.target.value);
    }

    const handleClearShare = () => {
        Axios.post("https://backend-for-test.herokuapp.com/api/accounts/clearShareCar", {
            car: { carNum: props.carNum, carId: props.carId }
        })
            .then((res) => {
                console.log(res.data);
                props.updateCarFromDatabase(props.user);
                setOpen(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const classes = useStyles();
    return (
        <div>
            <Button onClick={handleClickOpen}> <GroupAdd />分享此車給其他用戶 </Button>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>分享此車給其他用戶</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <TextField error={error} id="outlined-basic" helperText={status} onChange={handleChange} label="請輸入被分享會員電話 #" variant="outlined" placeholder="ex: 09xxxxxxxx" />
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClearShare} color="primary">
                        清除分享
                </Button>
                    <Button onClick={handleCloseExit} color="primary">
                        退出
                </Button>
                    <Button onClick={handleSubmit} disabled={phone === ""} color="primary">
                        送出
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user.user
})

export default connect(mapStateToProps, { updateCarFromDatabase })(ShareCar);
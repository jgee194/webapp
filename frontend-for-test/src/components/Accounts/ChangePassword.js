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

    const [open, setOpen] = React.useState(true);
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [successStatus, setSuccessStatus] = React.useState("");
    const [error, setError] = React.useState(false);


    //exits car modal without action
    const handleCloseExit = () => {
        setOpen(false);
        setStatus("");
        setError(false);
    }

    //exits car modal and opens the door
    const handleSubmit = () => {
        if (password !== passwordConfirm) {
            setError(true);
            setStatus("確認密碼失敗");
            return;
        }
        

        Axios.post("https://backend-for-test.herokuapp.com/api/accounts/changePassword", {
            password: password,
            phone: props.user.phone
        })
            .then((res) => {
                console.log(res.data);
                const modal = document.getElementById('updatePassword');
                modal.style.display = 'flex';
                // setError(true);
                // setStatus("密碼設置成功");
            
            })
            .catch((err) => {
                console.log(err);
            })
        // setOpen(false);
        setSuccessStatus("密碼設置成功!");
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }
    const handlePasswordConfirm = (event) => {
        setPasswordConfirm(event.target.value);
    }
    const classes = useStyles();
    return (
        <div> 
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>請輸入欲更改密碼</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <TextField error={error} id="outlined-basic" helperText={status} onChange={handlePassword} label="請輸入新密碼 #" variant="outlined" placeholder="ex: 09xxxxxxxx" />
                            <br/>
                            <TextField error={error} id="outlined-basic" helperText={status} onChange={handlePasswordConfirm} label="確認新密碼 #" variant="outlined" placeholder="ex: 09xxxxxxxx" />
                            <br/>
                            {successStatus}
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExit} color="primary">
                        退出
                </Button>
                    <Button onClick={handleSubmit} disabled={password === "" && passwordConfirm === "" } color="primary">
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
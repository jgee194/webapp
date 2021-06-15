import React from 'react';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Axios from 'axios';
import './CurrentParkingCars.css';
import { connect } from 'react-redux';
import { FaCarSide } from "react-icons/fa";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import logo from "../images/logo4.png";

function CurrentParkingCars(props) {
    const [currentCarArr, setCurrentCarArr] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [nocar, setNoCar] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseExit = () => {
        setOpen(false);
    }
    const handleClickNoCar = () => {
        setNoCar(true);
    };
    const handleCloseNoCar = () => {
        setNoCar(false);
    };
    //find customer current parking cars
    const findCurrentCars = async () => {
        let carAr = await Axios.post("https://backend-for-test.herokuapp.com/api/currentCarLocations/findCurrentCars", { user: props.user });
        let carArr = carAr.data;
        let arr = [];
        for (let i = 0; i < carArr.length; i++) {
            arr.push({ carNum: carArr[i].carNum, carId: carArr[i].carId, lat: carArr[i].lat, lng: carArr[i].lng, parkingLotName: carArr[i].parkingLotName });
        }
        setCurrentCarArr(arr);
        return arr;
    }
    return (
        <div>
            <button className="car" onClick={async () => {
                let temp = await findCurrentCars();
                if (temp.length === 0) {
                    handleClickNoCar();
                } else {
                    handleClickOpen();
                }
            }}>
                <DriveEtaIcon color="primary" />

            </button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>目前停車中的車子</DialogTitle>
                <DialogContent>
                    <List >
                        {currentCarArr.map((item) => {
                            const { carNum, carId, lat, lng, parkingLotName } = item;
                            return (
                                <ListItem button key={carId} onClick={() => {
                                    props.panTo({ lat, lng });
                                    handleCloseExit();
                                }}>
                                    {<ListItemIcon><FaCarSide color="primary" /></ListItemIcon>}
                                    <ListItemText primary={carNum} secondary={parkingLotName} />
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
            </Dialog>
            <Dialog disableEscapeKeyDown open={nocar} onClose={handleCloseNoCar} >
                <DialogTitle>沒有停車中的車子!</DialogTitle>
                <DialogContent>趕緊來停車吧(๑•̀ㅂ•́)و✧</DialogContent>
                <img src={logo} alt={logo} width={'240px'} height={'230px'} />
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={handleCloseNoCar} color="primary">
                        了解了!
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.user.user
})

export default connect(mapStateToProps, null)(CurrentParkingCars);
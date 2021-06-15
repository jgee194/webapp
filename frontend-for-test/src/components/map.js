import React, { useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Axios from 'axios';
import { connect } from 'react-redux';
import { storeLocation } from '../actions/locationActions';
import { updateUserFromDatabase } from '../actions/userActions';
import { storeEvent } from '../actions/eventActions';
import { updateCarFromDatabase } from '../actions/carActions';

import LocationInfo from '../pages/LocationInfo';
import NearMeIcon from '@material-ui/icons/NearMe';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { trackPromise } from 'react-promise-tracker';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
// import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import './map.css';
import MapSearch from './MapSearch';
import Locate from './Locate';
import CurrentParkingCars from './CurrentParkingCars';
import { Link } from 'react-router-dom';
import mapStyles from './mapStyles';
import dotSvg from '../images/dot.svg';
import LoadSpinner from './LoadSpinner';


import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
const libraries = ['places'];

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

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Map = (props) => {
    const classes = useStyles();
    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [car, setCar] = React.useState("");
    const [carArr, setCarArr] = React.useState([]);
    const [currentCars, setCurrentCars] = React.useState([]);
    const [exitCar, setExitCar] = React.useState("");
    const [exit, setExit] = React.useState(false);
    const [currCenter, setCurrCenter] = React.useState(null);
    const [option, setOption] = React.useState("擁有車輛");
    const [snackBar, setSnackBar] = React.useState(false);
    const [snackBarText, setSnackBarText] = React.useState("");
    //get parking lots && geolocation
    useEffect(() => {
        getLocations();
        setCurrCenter(props.user.location);
    }, [])

    //loads in Google Maps Api
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyC0bY2ULD2_jy_Y72UyXhFkewjiJIO5A_E",
        libraries
    })

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);
    //snackBar functions
    const handleSnackClick = () => {
        setSnackBar(true);
    };
    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar(false);
    };
    //Modal functions
    const handleChange = (event) => {
        setCar(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    //exits car modal without action
    const handleCloseExit = () => {
        setOpen(false);
    }

    //exits car modal and opens the door
    const handleCloseSubmit = () => {
        setOpen(false);
        openDoor();
    }

    //exit Modal functions
    const handleExitChange = (event) => {
        setExitCar(event.target.value);
    };
    const handleExitOpen = () => {
        setExit(true);
    };
    //exit exit modal without action
    const handleCloseExitModal = () => {
        setExit(false);
    }
    //exit exit modal and opens the door
    const handleExitSubmit = () => {
        setExit(false);
        exitClicked();
    }
    //get all parking lots to show on map
    const getLocations = async () => {
        Axios.get("https://backend-for-test.herokuapp.com/api/locations/getLocations", {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                res.data.forEach((location) => {
                    setMarkers(current => [...current, {
                        id: location.parkingLotId,
                        name: location.parkingLotName,
                        lat: location.lat,
                        lng: location.lng
                    }])
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    const containerStyle = {
        width: '100vw',
        height: '100vh'
    };

    const options = {
        disableDefaultUI: true,
        styles: mapStyles
    };

    const handleSelected = (selected) => {
        setSelected(selected);
        props.storeLocation(selected);
    }

    const panTo = (({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    });

    const haversine_distance = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the Earth in km
        var rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
        var rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon = (lon2 - lon1) * (Math.PI / 180); // Radian difference (longitudes)

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
        return d;
    }


    //disable button if user not in distance (150 m radius)
    const buttonLoad = (markerlat, markerlng) => {
        let doorbtn = document.getElementsByClassName("door-btn")[0];
        let user = props.user;
        let distanceToSelected = haversine_distance(markerlat, markerlng, user.location.lat, user.location.lng) * 1000;
        // let distanceToSelected = haversine_distance(selected.lat, selected.lng, 25.052264, 121.536144) * 1000;
        // let distanceToSelected = haversine_distance(selected.lat, selected.lng, 25.063948, 121.582002) * 1000;
        // let distanceToSelected = haversine_distance(selected.lat, selected.lng, 25.080617, 121.554538) * 1000;
        // if (user.status === "active" || distanceToSelected > 150) {
        //     doorbtn.disabled = true;
        // } else {
        //     doorbtn.disabled = false;
        // }
        if (distanceToSelected > 150) {
            doorbtn.disabled = true;
        } else {
            doorbtn.disabled = false;
        }

    }

    //open door button clicked handler
    const openDoor = () => {
        trackPromise(
            Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/openDoor", {
                user: props.user,
                parkingLot: props.selectedLocation,
                car: car
            })
                .then(async (res) => {
                    await props.storeEvent(res.data.insertId);
                    await props.updateUserFromDatabase(props.user);
                    await props.updateCarFromDatabase(props.user);
                    // .then(() => {
                    props.manageButtons();
                    setSnackBarText("成功入場!");
                    handleSnackClick();

                    // })
                    return;
                })
                .catch(err => {
                    console.log(err)
                })
        );

    }
    //exit door button clicked handler
    const exitClicked = () => {
        trackPromise(
            Axios.post("https://backend-for-test.herokuapp.com/api/currentCarLocations/selectedCurrentCarloaction", {
                user: props.user,
                car: exitCar,
            })
                .then((result) => {
                    console.log(result.data);
                    console.log(result.data[0].parkingLotId);
                    Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/exit", {
                        user: props.user,
                        car: exitCar,
                        parkingLot: result.data[0].parkingLotId,
                    })
                        .then(async (res) => {
                            await props.storeEvent("");
                            await props.updateCarFromDatabase(props.user);
                            await props.updateUserFromDatabase(props.user);
                            // .then(() => {
                            props.manageButtons();
                            setSnackBarText("成功出場!");
                            handleSnackClick();
                            // })
                            return;
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        );

    }
    //find car plans for selected parking lot
    const findCarPlans = async () => {
        let carsWithPlan = await Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/findCarPlans", { selected: selected, user: props.user });
        let carsMapped = carsWithPlan.data.map((car) => {
            return <option key={car.carId} value={car.carId}>{car.carNum}</option>
        })
        let sharedCarsWithPlan = await Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/findSharedCarPlans", { sharedCars: props.sharedCars, selected: selected });
        let sharedCarsMapped = sharedCarsWithPlan.data.map((car) => {
            return <option key={car.carId} value={car.carId}>{car.carNum}</option>
        })
        let finalCarArr = carsMapped.concat(sharedCarsMapped);
        setCarArr(finalCarArr);
        setOption("擁有車輛");
        if (finalCarArr.length === 0) {
            setOption("無有效車牌");
        } else {
            setCar(finalCarArr[0].key);
        }
        return finalCarArr;
    }
    //find current cars
    const findCurrentCars = async () => {
        let currentCars = await Axios.post("https://backend-for-test.herokuapp.com/api/currentCarLocations/findCurrentCars", { selected: selected, user: props.user });
        let carsMapped = currentCars.data.map((car) => {
            return <option key={car.carId} value={car.carId}>{car.carNum}</option>
        })
        setCurrentCars(carsMapped);
        return carsMapped;
    }

    //opens the door when there's only one car w/ active plan
    const handleOneCarOpen = (oneCar) => {
        trackPromise(
            Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/openDoor", {
                user: props.user,
                parkingLot: props.selectedLocation,
                car: oneCar
            })
                .then(async (res) => {
                    await props.storeEvent(res.data.insertId);
                    await props.updateUserFromDatabase(props.user);
                    await props.updateCarFromDatabase(props.user);
                    // .then(() => {
                    props.manageButtons();
                    setSnackBarText("成功入場!");
                    handleSnackClick();

                    // })
                    return;
                })
                .catch(err => {
                    console.log(err)
                })
        );


    }
    //exit the door when there's only one car w/ active plan
    const handleOneCarExit = (oneCar) => {
        trackPromise(
            Axios.post("https://backend-for-test.herokuapp.com/api/currentCarLocations/selectedCurrentCarloaction", {
                user: props.user,
                car: oneCar,
            })
                .then((result) => {
                    Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/exit", {
                        user: props.user,
                        car: oneCar,
                        parkingLot: result.data[0].parkingLotId,
                    })
                        .then(async (res) => {
                            await props.storeEvent("");
                            await props.updateCarFromDatabase(props.user);
                            await props.updateUserFromDatabase(props.user);
                            // .then(() => {
                            props.manageButtons();
                            setSnackBarText("成功出場!");
                            handleSnackClick();
                            // })
                            return;
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        );
    }

    return (
        < div className='map-div' >
            <Snackbar open={snackBar} style={{ height: "100%" }} autoHideDuration={6000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackClose} severity="success">
                    {snackBarText}
                </Alert>
            </Snackbar>
            <button className="exit-button" onClick={async () => {
                let temp = await findCurrentCars();
                if (temp.length === 1) {
                    handleOneCarExit(temp[0].props.value);
                } else {
                    handleExitOpen();
                }
            }}> 出場</button>
            <Dialog disableBackdropClick disableEscapeKeyDown open={exit} onClose={handleCloseExitModal}>
                <DialogTitle>請選擇使用車輛</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-native">擁有車輛</InputLabel>
                            <Select
                                native
                                value={exitCar}
                                onChange={handleExitChange}
                                input={<Input id="demo-dialog-native" />}
                            >
                                <option aria-label="None" value="" />
                                {currentCars}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExitModal} color="primary">
                        取消
                </Button>
                    <Button onClick={handleExitSubmit} disabled={exitCar === ""} color="primary">
                        出場
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>請選擇使用車輛</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-native"  >{option}</InputLabel>
                            <Select
                                native
                                disabled={option === "無有效車牌"}
                                value={car}
                                onChange={handleChange}
                                input={<Input id="demo-dialog-native" />}
                            >
                                {/* <option aria-label="None" value="" /> */}
                                {carArr}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExit} color="primary">
                        取消
                </Button>
                    <Link className="link" to="/shop">
                        <Button color="primary">
                            前往商店
                        </Button>
                    </Link>
                    <Button onClick={handleCloseSubmit} disabled={option === "無有效車牌"} color="primary">
                        入場
                </Button>
                </DialogActions>
            </Dialog>
            <CurrentParkingCars panTo={panTo} />
            <LoadSpinner />
            <MapSearch panTo={panTo} />
            <Locate panTo={panTo} />
            {props.user.location ? <GoogleMap
                mapContainerStyle={containerStyle}
                center={currCenter}
                options={options}
                clickableIcons={false}
                zoom={14}
                onClick={() => { handleSelected(null) }}
                onLoad={onMapLoad}
            >
                {markers.map((marker, index) =>
                    <Marker
                        key={marker.id + index + ""}
                        position={{
                            lat: marker.lat,
                            lng: marker.lng
                        }}
                        onClick={async () => {
                            handleSelected(marker);
                            buttonLoad(marker.lat, marker.lng);
                        }}
                    />
                )}
                <Marker position={props.user.location} icon={dotSvg} clickable={false} />
                {selected &&
                    <div className='bottom-sheet'>
                        <SwipeableBottomSheet bodyStyle={{
                            borderTopLeftRadius: '17px',
                            borderTopRightRadius: '17px'
                        }} topShadow={false} overflowHeight={123.5} shadowTip={false} overlay={false} open={false} >
                            <div id="swipebar"><RemoveIcon /></div>
                            <div className='info-window' style={{ height: '200px' }}  >
                                {/* <div style={{ height: '380px' }} className='info-window'  ></div> */}
                                {/* <div><RemoveIcon /></div> */}
                                <span ><h1> {selected.name} </h1></span>  <IconButton color="primary" href={'http://maps.google.com/maps?f=d&daddr=' + selected.lat + ',' + selected.lng + '&sspn=0.2,0.1&nav=1'}>
                                    <NearMeIcon color="primary" />
                                </IconButton>
                                <br />
                                <button className="door-btn" onClick={async () => {
                                    let doorbtn = document.getElementsByClassName("door-btn")[0];
                                    doorbtn.disabled = true;
                                    let temp = await trackPromise(findCarPlans());
                                    if (temp.length === 1) {
                                        handleOneCarOpen(temp[0].props.value);
                                    } else {
                                        handleClickOpen();
                                    }
                                }}>開起柵欄</button> <span ><button id="opening" disabled>營業中</button></span>
                                {/* <br /> */}
                                {/* <LocationInfo /> */}
                            </div>
                        </SwipeableBottomSheet>
                    </div>
                }
            </GoogleMap> : <h1 className="fetching">獲取位置...</h1>}
            {/* {
                props.user.location ?
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={initLocation}
                        options={options}
                        clickableIcons={false}
                        zoom={14}
                        onClick={() => { handleSelected(null) }}
                        onLoad={onMapLoad}
                    >
                        {markers.map((marker, index) =>
                            <Marker
                                key={marker.id + index + ""}
                                position={{
                                    lat: marker.lat,
                                    lng: marker.lng
                                }}
                                onClick={() => {
                                    handleSelected(marker);
                                }}
                            />
                        )}
                        <Marker position={props.user.location} icon={dotSvg} clickable={false} />
                        {selected && <InfoWindow
                            position={{ lat: selected.lat, lng: selected.lng }}
                            onCloseClick={() => { handleSelected(null) }}
                            onDomReady={() => buttonLoad()}
                        >
                            <div className='info-window'>
                                <h1> {selected.name} </h1>
                                <button className="door-btn" onClick={() => {
                                    handleClickOpen();
                                    findCarPlans();
                                }}>開起柵欄</button>
                                <br />
                                <Link to='/info'>更多資訊</Link>
                            </div>
                        </InfoWindow>}
                    </GoogleMap> : <h1 className="fetching">獲取位置...</h1>
            } */}
        </div >
    )
}

const mapStateToProps = state => ({
    token: state.token.token,
    selectedLocation: state.location.selected,
    user: state.user.user,
    event: state.event.event,
    cars: state.cars.cars,
    sharedCars: state.sharedCars.sharedCars
})

export default connect(mapStateToProps, { storeLocation, updateUserFromDatabase, storeEvent, updateCarFromDatabase })(Map);

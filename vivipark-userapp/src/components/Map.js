import React, { useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Axios from 'axios';
import { connect } from 'react-redux';
import { storeLocation } from '../actions/locationActions';
import { updateUserFromDatabase } from '../actions/userActions';
import { storeEvent } from '../actions/eventActions';
import { updateCarFromDatabase } from '../actions/carActions';

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
import { Link } from 'react-router-dom';
import mapStyles from './mapStyles';
import dotSvg from '../images/dot.svg';
import LoadSpinner from './LoadSpinner';


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

const Map = (props) => {

    const classes = useStyles();

    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [car, setCar] = React.useState("");
    const [carArr, setCarArr] = React.useState([]);

    //get parking lots && geolocation
    useEffect(() => {
        getLocations();
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

    //get all parking lots to show on map
    const getLocations = async () => {
        Axios.get("http://localhost:3030/api/locations/getLocations", {
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
    const buttonLoad = () => {
        let doorbtn = document.getElementsByClassName("door-btn")[0];
        let user = props.user;
        // let distanceToSelected = haversine_distance(selected.lat, selected.lng, user.location.lat, user.location.lng) * 1000;
        let distanceToSelected = haversine_distance(selected.lat, selected.lng, 25.033961, 121.564517) * 1000;
        // let distanceToSelected = haversine_distance(selected.lat, selected.lng, 25.080617, 121.554538) * 1000;
        if (user.status === "active" || distanceToSelected > 150) {
            doorbtn.disabled = true;
        } else {
            doorbtn.disabled = false;
        }
    }

    //open door button clicked handler
    const openDoor = () => {
        trackPromise(
            Axios.post("http://localhost:3030/api/doorActions/openDoor", {
                user: props.user,
                parkingLot: props.selectedLocation,
                car: car
            })
                .then((res) => {
                    props.storeEvent(res.data.insertId);
                    props.updateUserFromDatabase(props.user)
                        .then(() => {
                            props.manageButtons();
                        })
                    props.updateCarFromDatabase(props.user);
                    return;
                })
                .catch(err => {
                    console.log(err)
                })
        );
    }

    //find car plans for selected parking lot
    const findCarPlans = async () => {
        let carsWithPlan = await Axios.post("http://localhost:3030/api/doorActions/findCarPlans", { selected: selected, user: props.user });
        let carsMapped = carsWithPlan.data.map((car) => {
            return <option key={car} value={car.carId}>{car.carNum}</option>
        })
        let sharedCarsWithPlan = await Axios.post("http://localhost:3030/api/doorActions/findSharedCarPlans", { sharedCars: props.sharedCars, selected: selected });
        let sharedCarsMapped = sharedCarsWithPlan.data.map((car) => {
            return <option key={car} value={car.carId}>{car.carNum}</option>
        })
        let finalCarArr = carsMapped.concat(sharedCarsMapped);
        setCarArr(finalCarArr);
    }

    return (
        <div className='map-div'>
            <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCloseExit}>
                <DialogTitle>請選擇使用車輛</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="demo-dialog-native">擁有車輛</InputLabel>
                            <Select
                                native
                                value={car}
                                onChange={handleChange}
                                input={<Input id="demo-dialog-native" />}
                            >
                                <option aria-label="None" value="" />
                                {carArr}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExit} color="primary">
                        取消
                </Button>
                    <Button onClick={handleCloseSubmit} disabled={car === ""} color="primary">
                        入場
                </Button>
                </DialogActions>
            </Dialog>

            <LoadSpinner />
            <MapSearch panTo={panTo} />
            <Locate panTo={panTo} />
            {
                props.user.location ?
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={props.user.location}
                        options={options}
                        clickableIcons={false}
                        zoom={14}
                        onClick={() => { handleSelected(null) }}
                        onLoad={onMapLoad}
                    >
                        {markers.map((marker) =>
                            <Marker
                                key={marker.id}
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
            }
        </div>
    )
}

const mapStateToProps = state => ({
    token: state.token.token,
    selectedLocation: state.location.selected,
    user: state.user.user,
    event: state.event.event,
    sharedCars: state.sharedCars.sharedCars
})

export default connect(mapStateToProps, { storeLocation, updateUserFromDatabase, storeEvent, updateCarFromDatabase })(Map);

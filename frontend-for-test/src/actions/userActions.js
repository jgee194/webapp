import { STORE_USER, REMOVE_USER, UPDATE_USER_FROM_DATABASE, UPDATE_LOCATION } from "./types";
import Axios from 'axios';

export const storeUser = (user) => dispatch => {
    dispatch({
        type: STORE_USER,
        payload: user
    })
}

export const removeUser = () => dispatch => {
    dispatch({
        type: REMOVE_USER,
        payload: null
    })
}

export const updateUserFromDatabase = (user) => dispatch => {
    return new Promise((resolve, reject) => {
        Axios.post("https://backend-for-test.herokuapp.com/api/auth/updated-user", user)
            .then(res => {
                dispatch({
                    type: UPDATE_USER_FROM_DATABASE,
                    payload: res.data
                });
                resolve();
            })
            .catch(err => {
                console.log(err);
            })
    })
}

export const updateLocation = (location) => dispatch => {
    dispatch({
        type: UPDATE_LOCATION,
        payload: {
            lat: location.latitude,
            lng: location.longitude
        }
    })
}
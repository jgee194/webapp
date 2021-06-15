import { STORE_CARS, FIND_SHARED_CARS } from "./types";
import {UPDATE_CAR_FROM_DATABASE} from "./types";
import Axios from 'axios';

export const storeCars = (cars) => dispatch => {
    dispatch({
        type: STORE_CARS, 
        payload: cars
    })
}


export const updateCarFromDatabase = (user) => dispatch => {
    return new Promise((resolve, reject) => {
        Axios.post("http://localhost:3030/api/accounts/updated-car", user)
        .then(res => {
            dispatch({
                type: UPDATE_CAR_FROM_DATABASE, 
                payload: res.data
            });
            resolve();
        })
        .catch(err => {
            console.log(err);
        })
    })
}

//put shared cars into redux state
export const updateSharedCars = (user) => dispatch => {
    Axios.post("http://localhost:3030/api/accounts/update-shared-cars", user)
    .then(res => {
        dispatch({
            type: FIND_SHARED_CARS, 
            payload: res.data
        });
    })
    .catch(err => {
        console.log(err);
    })
}
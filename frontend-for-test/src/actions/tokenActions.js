import { STORE_TOKEN, REMOVE_TOKEN } from "./types";

export const storeToken = (token) => dispatch => {
    dispatch({
        type: STORE_TOKEN, 
        payload: token
    })
}

export const removeToken = () => dispatch => {
    dispatch({
        type: REMOVE_TOKEN, 
        payload: null
    })
}
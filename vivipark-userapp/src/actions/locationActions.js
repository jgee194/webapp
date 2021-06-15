import { STORE_SELECTED_LOCATION } from "./types";

export const storeLocation = (selected) => dispatch => {
    dispatch({
        type: STORE_SELECTED_LOCATION, 
        payload: selected
    })
}
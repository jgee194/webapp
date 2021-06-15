import { STORE_EVENT } from "./types";

export const storeEvent = (eventId) => dispatch => {
    dispatch({
        type: STORE_EVENT, 
        payload: eventId
    })
}
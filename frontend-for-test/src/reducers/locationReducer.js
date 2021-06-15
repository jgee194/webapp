import { STORE_SELECTED_LOCATION } from "../actions/types";

const intialState = {
    selected: ''
}

export default function(state = intialState, action) {
    switch(action.type) {
        case STORE_SELECTED_LOCATION:
            return {
                ...state, 
                selected: action.payload
            }
        default:
            return state;
    }
}
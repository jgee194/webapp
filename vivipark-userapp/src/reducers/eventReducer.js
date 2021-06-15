import { STORE_EVENT } from "../actions/types";

const intialState = {
    event: ''
}

export default function(state = intialState, action) {
    switch(action.type) {
        case STORE_EVENT:
            return {
                ...state, 
                event: action.payload
            }
        default:
            return state;
    }
}
import { STORE_TOKEN, REMOVE_TOKEN } from "../actions/types";

const intialState = {
    token: ''
}

export default function(state = intialState, action) {
    switch(action.type) {
        case STORE_TOKEN:
            return {
                ...state, 
                token: action.payload
            }
        case REMOVE_TOKEN:
            return {
                ...state, 
                token: ''
            }
        default:
            return state;
    }
}
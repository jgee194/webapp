import { STORE_PLAN } from "../actions/types";

const intialState = {
    plan: ''
}

export default function(state = intialState, action) {
    switch(action.type) {
        case STORE_PLAN:
            return {
                ...state, 
                plan: action.payload
            }
        default:
            return state;
    }
}
import { FIND_SHARED_CARS } from "../actions/types";

const intialState = {
    sharedCars: []
}

export default function(state = intialState, action) {
    switch(action.type) {
        case FIND_SHARED_CARS:
            return {
                ...state, 
                sharedCars: action.payload
            }
        default:
            return state;
    }
}
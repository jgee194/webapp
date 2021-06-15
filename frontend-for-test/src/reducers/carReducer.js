import { STORE_CARS, UPDATE_CAR_FROM_DATABASE} from "../actions/types";

const intialState = {
    cars: ''
}

export default function(state = intialState, action) {
    switch(action.type) {
        case STORE_CARS:
            return {
                ...state, 
                cars: action.payload
            }
        case UPDATE_CAR_FROM_DATABASE: 
            return {
                ...state, 
                cars: action.payload //do we change user to cars
            }
        default:
            return state;
    }
}
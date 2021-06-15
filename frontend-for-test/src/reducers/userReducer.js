import { STORE_USER, REMOVE_USER, UPDATE_USER_FROM_DATABASE, UPDATE_LOCATION } from "../actions/types";

const intialState = {
    user: ''
}

export default function(state = intialState, action) {
    switch(action.type) {
        case STORE_USER:
            return {
                ...state, 
                user: {
                    ...state.user, 
                    ...action.payload
                }
            }
        case REMOVE_USER:
            return {
                ...state, 
                user: {
                    location: state.user.location
                }
            }
        case UPDATE_USER_FROM_DATABASE: 
            return {
                ...state, 
                user: {
                    ...state.user, 
                    ...action.payload
                }
            }
        case UPDATE_LOCATION:
            return {
                ...state, 
                user: {
                    ...state.user, 
                    location: action.payload
                }
            }
        default:
            return state;
    }
}
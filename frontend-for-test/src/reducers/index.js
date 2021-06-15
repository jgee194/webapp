import { combineReducers } from 'redux';
import tokenReducer from './tokenReducer';
import locationReducer from './locationReducer';
import userReducer from './userReducer';
import carReducer from './carReducer';
import planReducer from './planReducer';
import eventReducer from './eventReducer';
import sharedCarsReducer from './sharedCarReducer';

export default combineReducers({
    token: tokenReducer, 
    location: locationReducer,
    user: userReducer, 
    cars: carReducer, 
    sharedCars: sharedCarsReducer,
    plan: planReducer, 
    event: eventReducer
})
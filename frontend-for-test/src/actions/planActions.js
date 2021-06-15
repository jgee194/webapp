import { STORE_PLAN } from "./types";

export const storePlan = (plan) => dispatch => {
    dispatch({
        type: STORE_PLAN, 
        payload: plan
    })
}
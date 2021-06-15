import React from 'react'
import Loader from 'react-loader-spinner';
import "./load-spinner.css";
import { usePromiseTracker } from "react-promise-tracker";

export default function LoadSpinner() {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress &&
        <div className="spinner-div">
            <Loader type="TailSpin" color="#EABD63" height={100} width={100} />
        </div>
    )
}

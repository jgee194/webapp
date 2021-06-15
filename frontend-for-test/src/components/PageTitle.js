import React from 'react'
import goBack from "../images/goBack.svg";
import { Link } from "react-router-dom";

import "./page-title.css";

export default function PageTitle(props) {
    return (
        <div>
            <div className="shop-title">
                <Link to="/home">
                    <img src={goBack} alt={goBack} className="arrow-icon"/>
                </Link>
                <h1>{props.title}</h1>
            </div>
            {/* <div className="title-spacer"></div> */}
        </div>
    )
}

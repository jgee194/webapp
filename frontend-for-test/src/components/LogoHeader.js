import React from "react";
import logo from "../images/logo3.png";
import "./logo-header.css";

export default function LogoHeader() {
  return (
    <div className="header-logo">
      <img src={logo} alt={logo} />
    </div>
  );
}

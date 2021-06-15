import React from "react";
import "./modal.css";

export default function Modal(props) {
  //pass in unique identifier to props to identify modal component on DOM
  return (
    <div
      className="outer-modal"
      id={props.identifier}
      onClick={(e) => {
        const modal = document.getElementById(props.identifier);
        if (e.target === modal) {
          modal.style.display = "none";
        }
      }}
    >
      <div className="inner-modal">
        <span
          className="close-btn"
          onClick={(e) => {
            const modal = document.getElementById(props.identifier);
            modal.style.display = "none";
          }}
        >
          &times;
        </span>
        <div>{props.children}</div>
      </div>
    </div>
  );
}

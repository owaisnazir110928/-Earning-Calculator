import React, { useState } from "react";
import logo from "../assets/logo.svg";
import styles from "./Style/Navbar.module.css";
import call from "../assets/call.svg";
import { Link } from "react-router-dom";
function Navbar(props) {
  const [popUp, setPopUp] = useState(false);
  function handleClick() {
    props.onPopUp(true);
  }
  return (
    <div className={styles.container}>
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <div className={styles.callBackContainer}>
        <div className={styles.callBack}>
          <img src={call} alt="call-icon" />
          <span className={styles.text} onClick={handleClick}>
            Request a call back
          </span>
        </div>
        <div className={styles.icon}></div>
      </div>
    </div>
  );
}

export default Navbar;

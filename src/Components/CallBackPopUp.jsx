import React, { useState } from "react";
import styles from "./Style/CallBackPopUp.module.css";
import tick from "../assets/tick.svg";
import { Link } from "react-router-dom";
function CallBackPopUp(props) {
  const [sent, setSent] = useState(false);

  const handlePopupClick = (event) => {
    event.stopPropagation();
  };
  function handleClick() {
    setSent(true);
  }
  function handleRedClick() {
    onClosePopup(false);
  }
  const { onClosePopup } = props;
  return (
    <div className={styles.container} onClick={onClosePopup}>
      {!sent && (
        <div className={styles.popup} onClick={handlePopupClick}>
          <div className={styles.box}>
            <p>Request a call back</p>
            <input placeholder="Enter Name" />
            <input placeholder="Mobile Number" />
            <button onClick={handleClick}>Request a Call Back</button>
          </div>
        </div>
      )}

      {sent && (
        <div className={styles.popup} onClick={handlePopupClick}>
          <img className={styles.tick} src={tick} alt="tick" />
          <h2>Request a call back</h2>
          <p>Our Team will call you shortly in 12-24 hrs</p>
          <p>Can’t you wait for call?</p>
          <Link to="/" className={styles.redButton} onClick={handleRedClick}>
            Check another video
          </Link>
        </div>
      )}
    </div>
  );
}

export default CallBackPopUp;

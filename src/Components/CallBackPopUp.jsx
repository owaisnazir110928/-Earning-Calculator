import React, { useState } from "react";
import styles from "./Style/CallBackPopUp.module.css";
import tick from "../assets/tick.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { CirclesWithBar } from "react-loader-spinner";

function CallBackPopUp(props) {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePopupClick = (event) => {
    event.stopPropagation();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (
      formData.name.trim() === "" ||
      formData.number.trim() === "" ||
      formData.time.trim() === ""
    ) {
      setError("Name, Mobile Number, and Preferred Time are required fields.");
    } else {
      setError("");
      try {
        await axios.post("https://earningcalc.onrender.com/send-email", formData);
        setLoading(false);
        setSent(true);
      } catch (error) {
        console.error(error);
        setError("Failed to send email. Please try again later.");
      }
      setError("");
      setSent(true);
      setLoading(false);
    }
  };

  const handleRedClick = () => {
    onClosePopup(false);
  };

  const { onClosePopup } = props;

  return (
    <div className={styles.container} onClick={onClosePopup}>
      {!sent && !loading && (
        <div className={styles.popup} onClick={handlePopupClick}>
          <form className={styles.box}>
            <h3>Request a call back</h3>
            <input
              name="name"
              type="text"
              required
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="number"
              type="number"
              required
              placeholder="Mobile Number"
              value={formData.number}
              onChange={handleChange}
            />
            <input
              name="time"
              type="time"
              required
              placeholder="Preffered Time"
              value={formData.prefferedTime}
              onChange={handleChange}
            />
            {error && <div className={styles.error}>{error}</div>}
            <button type="button" onClick={handleClick}>
              Request a Call Back
            </button>
          </form>
        </div>
      )}

      {sent && !loading && (
        <div className={styles.popup} onClick={handlePopupClick}>
          <img className={styles.tick} src={tick} alt="tick" />
          <h2>Request a call back</h2>
          <p>Our Team will call you shortly in 12-24 hrs</p>
          <p>Can’t you wait for the call?</p>
          <Link to="/" className={styles.redButton} onClick={handleRedClick}>
            Check another video
          </Link>
        </div>
      )}

      {!sent && loading && (
        <div className={styles.popup}>
          <div className={styles.center}>
            {" "}
            <CirclesWithBar
              height="100"
              width="100"
              color="#4fa94d"
              visible={true}
              outerCircleColor=""
              innerCircleColor=""
              barColor=""
              ariaLabel="circles-with-bar-loading"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CallBackPopUp;

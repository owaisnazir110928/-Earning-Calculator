import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Style/LandingPage.module.css";
import youtube from "../assets/youtube.svg";

function LandingPage(props) {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  function extractVideoId(url) {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  function clickHandler() {
    const videoId = extractVideoId(url);
    if (videoId) {
      navigate(`/earning/${videoId}`);
    } else {
      console.error("Invalid YouTube URL");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Discover your earning potential</div>
      <div className={styles.subHeading}>
        Turn your Youtube expertise into a lucrative income through resource
        sharing
      </div>
      <div className={styles.inputContainer}>
        <div>
          <img className={styles.icon} src={youtube} alt="yt-icon" />
          <input
            type="url"
            placeholder="enter youtube video link"
            className={styles.input}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            className={styles.button}
            type="submit"
            onClick={clickHandler}
          >
            Check Earning
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

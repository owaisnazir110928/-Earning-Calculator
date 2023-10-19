// LoadingComponent.js

import React from "react";
import PropTypes from "prop-types";
import "./Style/loading.module.css";

const Loading = ({ progress }) => {
  return (
    <div className="loading-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

Loading.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default Loading;

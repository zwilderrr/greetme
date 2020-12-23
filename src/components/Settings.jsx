import React, { useState, useEffect } from "react";
import { CHROME_KEYS, SETTINGS } from "../constants";

import "./Settings.css";

export default function Settings({ toggleHide, show }) {
  return (
    <div className="settings-container">
      {SETTINGS.map(k => {
        const className = show[k] ? "selected" : "";
        return (
          <div className={className} onClick={() => toggleHide(k)}>
            {k}
          </div>
        );
      })}
    </div>
  );
}

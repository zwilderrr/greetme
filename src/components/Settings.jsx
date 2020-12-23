import React from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { SETTINGS } from "../constants";

import "./Settings.css";

export default function Settings({ toggleHide, show }) {
  return (
    <div className="settings-container">
      {SETTINGS.map(s => {
        const className = show[s] ? "selected" : "";
        const setting = s === "notes" ? <ChevronLeftIcon /> : s;
        return (
          <div className={className} onClick={() => toggleHide(s)}>
            {setting}
          </div>
        );
      })}
    </div>
  );
}

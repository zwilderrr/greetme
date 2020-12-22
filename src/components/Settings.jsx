import React, { useState, useEffect } from "react";
import { CHROME_KEYS, SETTINGS } from "../constants";

export default function Settings({ toggleHide }) {
  return (
    <>
      {SETTINGS.map(k => {
        return (
          <div>
            <button onClick={() => toggleHide(k)}>toggle {k}</button>
          </div>
        );
      })}
    </>
  );
}

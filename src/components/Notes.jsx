import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../constants";
import "./Notes.css";

export default function Notes() {
  // use the same logic as in the greeting component.
  // wrap the textarea in a form tag that saves on submit

  const [show, setShow] = useState(true);
  return (
    <>
      <button onClick={() => setShow(!show)}>toggle</button>
      <div>text area is open: {show}</div>
      <div className={`notes-container ${show ? "show" : "hide"}`}>
        <div>header</div>
        <textarea>lalala text area</textarea>
      </div>
    </>
  );
}

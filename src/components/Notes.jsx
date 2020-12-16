import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../constants";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import "./Notes.css";

export default function Notes() {
  const [show, setShow] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { notes } = await getChromeStorage(CHROME_KEYS.NOTES);
      notes && setNotes(notes);
    }

    fetchData();
  }, []);

  function handleFormSubmit(e) {
    setChromeStorage(CHROME_KEYS.NOTES, { notes });
  }

  return (
    <>
      <button onClick={() => setShow(!show)}>toggle</button>
      <div>text area is open: {show}</div>
      <div className={`notes-container ${show ? "show" : "hide"}`}>
        <div>header</div>
        <form autoComplete={false} onBlur={handleFormSubmit}>
          <textarea onChange={e => setNotes(e.target.value)} value={notes} />
        </form>
      </div>
    </>
  );
}

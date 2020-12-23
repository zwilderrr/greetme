import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../constants";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import "./Notes.css";

export default function Notes({ showNotes, toggleHide }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { notes } = await getChromeStorage(CHROME_KEYS.NOTES);
      setNotes(notes);
    }

    fetchData();
  }, []);

  function handleFormSubmit(e) {
    e && e.preventDefault();
    setChromeStorage(CHROME_KEYS.NOTES, { notes });
  }

  return (
    <>
      <div className={`notes-container ${showNotes ? "show" : "hide"}`}>
        <div>
          <div>header</div>
          <div onClick={() => toggleHide(CHROME_KEYS.NOTES)}>close</div>
        </div>
        <form
          autoComplete={false}
          // calling handleFormSubmit directly for textual changes
          // (instead of relying on useEffect) to avoid too many
          // consecutive calls to chrome storage
          onBlur={handleFormSubmit}
        >
          <textarea onChange={e => setNotes(e.target.value)} value={notes} />
        </form>
      </div>
    </>
  );
}

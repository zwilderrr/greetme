import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../constants";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import "./Notes.css";

export default function Notes() {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { notes, showNotes } = await getChromeStorage(CHROME_KEYS.NOTES);
      setNotes(notes);
      setShowNotes(showNotes);
    }

    fetchData();
  }, []);

  useEffect(() => {
    handleFormSubmit();
  }, [notes, showNotes]);

  function handleFormSubmit(e) {
    e && e.preventDefault();
    setChromeStorage(CHROME_KEYS.NOTES, { notes, showNotes });
  }

  return (
    <>
      <button onClick={() => setShowNotes(!showNotes)}>toggle</button>
      <div className={`notes-container ${showNotes ? "show" : "hide"}`}>
        <div>header</div>
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

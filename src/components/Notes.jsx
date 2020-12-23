import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { CHROME_KEYS } from "../constants";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import "./Notes.css";

export default function Notes({ showNotes, toggleHide }) {
  const [notes, setNotes] = useState("");
  const [monospace, setMonospace] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { notes, monospace } = await getChromeStorage(CHROME_KEYS.NOTES);
      setNotes(notes);
      setMonospace(monospace);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setChromeStorage(CHROME_KEYS.NOTES, { monospace });
  }, [monospace]);

  function handleFormSubmit(e) {
    e && e.preventDefault();
    setChromeStorage(CHROME_KEYS.NOTES, { notes });
  }

  const monospaceIconClass = "monospace" + (monospace ? " selected" : "");
  const containerClass = "container" + (showNotes ? " show" : " hide");
  const bodyClass = "body" + (monospace ? " monospace" : "");

  return (
    <div className={containerClass}>
      <div className="header">
        <div
          onClick={() => setMonospace(!monospace)}
          className={monospaceIconClass}
        >
          {"</>"}
        </div>
        <div className="title">Notes</div>
        <ChevronRightIcon onClick={() => toggleHide(CHROME_KEYS.NOTES)} />
      </div>
      <form autoComplete={false} onBlur={handleFormSubmit}>
        <textarea
          className={bodyClass}
          onChange={e => setNotes(e.target.value)}
          value={notes}
          maxLength={102000}
        />
      </form>
    </div>
  );
}

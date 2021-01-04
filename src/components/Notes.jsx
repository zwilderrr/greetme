import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { CHROME_KEYS } from "../constants";
import { useSkipFirstRender } from "../hooks";
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

  useSkipFirstRender(() => {
    setChromeStorage(CHROME_KEYS.NOTES, { monospace });
  }, [monospace]);

  function handleFormSubmit(e) {
    e && e.preventDefault();
    setChromeStorage(CHROME_KEYS.NOTES, { notes });
  }

  const monospaceIconCssClass =
    "monospace-icon" + (monospace ? " selected" : "");
  const containerCssClass = "container" + (showNotes ? " show" : " hide-notes");
  const bodyCssClass = "body" + (monospace ? " monospace" : "");

  return (
    <div className={containerCssClass}>
      <div className="header">
        <div
          onClick={() => setMonospace(!monospace)}
          className={monospaceIconCssClass}
        >
          {"</>"}
        </div>
        <div className="title">Notes</div>
        <ChevronRightIcon
          className="chevron"
          onClick={() => toggleHide(CHROME_KEYS.NOTES)}
        />
      </div>
      <form autoComplete={false} onBlur={handleFormSubmit}>
        <textarea
          className={bodyCssClass}
          onChange={e => setNotes(e.target.value)}
          value={notes}
          maxLength={102000}
        />
      </form>
    </div>
  );
}

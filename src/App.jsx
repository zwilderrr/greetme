import React, { useState, useEffect } from "react";
import { getChromeStorage, setChromeStorage } from "./api/chrome-api";
import { SETTINGS } from "./constants";
import ControlBar from "./components/ControlBar";
import Time from "./components/Time";
import Greeting from "./components/Greeting";
import Goals from "./components/Goals";
import Notes from "./components/Notes";

import "./App.css";

// turns 'key' into 'showKey'. ex: goals -> showGoals
const makeShowKey = s => "show" + s.charAt(0).toUpperCase() + s.slice(1);

export default function App() {
  const [show, setShow] = useState({});

  useEffect(() => {
    async function fetchData() {
      const storage = await getChromeStorage(SETTINGS);
      const nextShow = {};
      for (let key of SETTINGS) {
        const showKey = makeShowKey(key);
        nextShow[key] = storage[key][showKey];
      }
      setShow(nextShow);
    }
    fetchData();
  }, []);

  function toggleHide(key) {
    const nextBool = !show[key];
    const showKey = makeShowKey(key);

    setChromeStorage(key, { [showKey]: nextBool });
    setShow(show => ({
      ...show,
      [key]: nextBool,
    }));
  }

  const { time, greeting, goals, notes } = show;

  let layoutTop = 47;
  if (!goals || !greeting) layoutTop += 6;
  if (!time) layoutTop -= 7;
  layoutTop += "vh";

  const goalsTop = !greeting ? "1.5vh" : "";

  return (
    <>
      <ControlBar toggleHide={toggleHide} show={show} />
      <div className="layout" style={{ top: layoutTop }}>
        <div className="layout-time">{time && <Time />}</div>

        <div className="layout-greeting">{greeting && <Greeting />}</div>

        <div className="layout-goals" style={{ top: goalsTop }}>
          {goals && <Goals />}
        </div>
      </div>

      <Notes showNotes={notes} toggleHide={toggleHide} />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { getChromeStorage, setChromeStorage } from "./api/chrome-api";
import { SETTINGS } from "./constants";
import TopBar from "./components/TopBar";
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

  return (
    <>
      <TopBar toggleHide={toggleHide} show={show} />

      <pre>{JSON.stringify(show, undefined, 2)}</pre>

      <div>{time && <Time />}</div>

      <div>{greeting && <Greeting />}</div>

      <div>{goals && <Goals />}</div>

      <Notes showNotes={notes} toggleHide={toggleHide} />
    </>
  );
}

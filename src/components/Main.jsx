// gives setting cb functions that toggle display
import React, { useState, useEffect } from "react";
import { getChromeStorage, setChromeStorage } from "../api/chrome-api";
import { CHROME_KEYS } from "../constants";
import Settings from "./Settings";
import Time from "./Time";
import Greeting from "./Greeting";
import Goals from "./Goals";
import Notes from "./Notes";

// turns 'key' into 'showKey'. ex: goals -> showGoals
const makeShowKey = s => "show" + s.charAt(0).toUpperCase() + s.slice(1);

export default function Main() {
  const [showState, setShowState] = useState({});

  useEffect(() => {
    async function getElementsToDisplay() {
      const storage = await getChromeStorage();
      const nextState = {};
      for (let key of Object.values(CHROME_KEYS)) {
        const showKey = makeShowKey(key);
        if (storage[key][showKey]) {
          nextState[showKey] = storage[key][showKey];
        }
      }
      setShowState(nextState);
    }
    getElementsToDisplay();
  }, []);

  // refactor this to useEffect and set chrome storage after setState
  async function toggleHide(key, show) {
    const showKey = makeShowKey(key);
    await setChromeStorage(key, { [showKey]: show });
    setShowState(s => {
      return { ...s, [showKey]: show };
    });
  }

  const { showTime, showGreeting, showGoals, showNotes } = showState;
  return (
    <>
      <div>
        <Settings toggleHide={toggleHide} showState={showState} />
      </div>

      <div>{showTime && <Time />}</div>

      <div>{showGreeting && <Greeting />}</div>

      <div>{showGoals && <Goals />}</div>

      <Notes showNotes={showNotes} />
    </>
  );
}

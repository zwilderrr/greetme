// gives setting cb functions that toggle display
import React, { useState, useEffect } from "react";
import { getChromeStorage, setChromeStorage } from "../api/chrome-api";
import { CHROME_KEYS, hideableElements } from "../constants";
import Search from "./Search";
import Settings from "./Settings";
import Time from "./Time";
import Greeting from "./Greeting";
import Goals from "./Goals";

const makeShowKey = s => "show" + s.charAt(0).toUpperCase() + s.slice(1);

export default function Content() {
  const [showState, setShowState] = useState({});

  useEffect(() => {
    // async function getElementsToDisplay() {
    //   const storage = await getChromeStorage(hideableElements);
    //   const nextState = { ...hideableElements };
    //   for (let key of hideableElements) {
    //     nextState[key] = storage[key][makeShowKey(key)];
    //   }
    //   console.log("nextState", nextState);
    //   setShowState(nextState);
    // }
    // getElementsToDisplay();
  }, []);

  function toggleHide(key, show) {
    const showKey = makeShowKey(key);
    setChromeStorage(key, { [showKey]: show });
    setShowState(s => {
      return { ...s, [showKey]: show };
    });
  }

  const { showTime, showGreeting, showTasks } = showState;
  return (
    <>
      <div>
        <Search />
      </div>

      <div>
        <Settings toggleHide={toggleHide} />
      </div>

      <div>{showTime && <Time />}</div>

      <div>{true && <Greeting />}</div>

      <div>{showTasks && <Goals />}</div>
    </>
  );
}

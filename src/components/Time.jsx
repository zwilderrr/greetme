import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../constants";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import { useSkipFirstRender } from "../hooks";
import "./Time.css";

let timer;

export default function Time() {
  const [standardTime, setStandardTime] = useState(true);
  const [time, setTime] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { standardTime } = await getChromeStorage(CHROME_KEYS.TIME);
      setStandardTime(standardTime);
      getAndSetTime();
      startClock();
    }
    fetchData();

    return () => clearInterval(timer);
  }, []);

  useSkipFirstRender(() => {
    setChromeStorage(CHROME_KEYS.TIME, { standardTime });
    getAndSetTime();
    startClock();
  }, [standardTime]);

  function startClock() {
    clearInterval(timer);
    timer = setInterval(() => {
      getAndSetTime();
    }, 1000);
  }

  function getAndSetTime() {
    const date = new Date();
    let minutes = date.getMinutes().toString().padStart(2, 0);
    let hours = date.getHours();
    let amPM = hours < 12 ? "am" : "pm";

    if (standardTime && hours > 12) {
      hours -= 12;
    }
    hours = hours.toString();

    if (!standardTime) {
      hours = hours.padStart(2, 0);
    }
    setTime(time => ({
      hours,
      minutes,
      amPM,
      showSeparator: !time.showSeparator,
    }));
  }

  const { hours, minutes, amPM, showSeparator } = time;
  const separatorClass = "separator" + (showSeparator ? " hide" : "");

  return (
    <div onClick={() => setStandardTime(!standardTime)}>
      {hours}
      <span className={separatorClass}>:</span>
      {minutes}
      {standardTime && amPM}
    </div>
  );
}

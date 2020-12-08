import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../constants";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import "./Time.css";

export default function Time() {
  let timer;
  const [standardTime, setStandardTime] = useState(true);
  const [time, setTime] = useState({});

  useEffect(() => {
    async function fetchData() {
      const storage = await getChromeStorage(CHROME_KEYS.GREETING);
      storage && setStandardTime(storage.standardTime);
    }
    fetchData();
    getAndSetTime();
    startClock();

    return () => clearInterval(timer);
  }, []);

  function startClock() {
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
  const separatorClass = showSeparator ? "separator" : "separator hide";
  return (
    <>
      {hours}
      <span className={separatorClass}>:</span>
      {minutes} {standardTime && amPM}
    </>
  );
}

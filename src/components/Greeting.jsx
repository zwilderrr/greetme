import React, { useState, useEffect } from "react";
import { CHROME_KEYS, NESTED_KEY_NAME } from "../constants";
import { setChromeStorage } from "../api/chrome-api";
import { useGetChromeStorage } from "../hooks";
import "./Greeting.css";

export default function Greeting(props) {
  const [name, setName] = useGetChromeStorage(
    CHROME_KEYS.GREETING,
    NESTED_KEY_NAME
  );
  const [editing, setEditing] = useState(false);

  async function handleFormSubmit(e) {
    document.activeElement.blur();
    e.preventDefault();
    setEditing(false);
    setChromeStorage(CHROME_KEYS.GREETING, { name });
  }

  function getGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour > 4 && currentHour < 12) {
      return "Good morning, ";
    } else if (currentHour < 17) {
      return "Good afternoon, ";
    } else {
      return "Good evening, ";
    }
  }

  function formatName() {
    if (editing) return name;
    // enable placeholder
    if (!name) return "";
    return getGreeting() + name;
  }
  console.log(name);

  return (
    <form
      onSubmit={handleFormSubmit}
      onBlur={handleFormSubmit}
      onFocus={() => setEditing(true)}
      autoComplete="off"
    >
      <input
        className="name"
        onChange={e => {
          console.log(e.target.value);
          setName(e.target.value);
        }}
        value={formatName()}
        placeholder="What's your name?"
      />
    </form>
  );
}

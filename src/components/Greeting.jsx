import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../chrome-keys";
import { getChromeState, setChromeState } from "../api/chrome-api";
import "./Greeting.css";

export default function Greeting() {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function getName() {
      const { name } = await getChromeState(CHROME_KEYS.GREETING);
      name && setName(name);
    }
    getName();
  }, []);

  function handleFormSubmit(e) {
    document.activeElement.blur();
    e.preventDefault();
    setEditing(false);
    setChromeState(CHROME_KEYS.GREETING, { name });
  }

  function getGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
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

  return (
    <form
      onSubmit={handleFormSubmit}
      onBlur={handleFormSubmit}
      onFocus={() => setEditing(true)}
      autoComplete="off"
    >
      <input
        className="name"
        onChange={e => setName(e.target.value)}
        value={formatName()}
        placeholder="What's your name?"
      />
    </form>
  );
}

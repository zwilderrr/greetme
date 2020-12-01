// gives setting cb functions that toggle display
import React, { useState, useEffect } from "react";
import { CHROME_KEYS } from "../chrome-keys";
import Greeting from "./Greeting";
import Search from "./Search";
import Settings from "./Settings";
import Tasks from "./Tasks";

export default function Content() {
  return (
    <>
      content
      <Search />
      <Settings />
      <Greeting />
      <Tasks />
    </>
  );
}

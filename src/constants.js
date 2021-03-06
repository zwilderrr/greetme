import { getErrorImage } from "./api/unsplash-api";
export const URL_BASE = "https://greetme-api-proxy.herokuapp.com";
// export const URL_BASE = "http://localhost:8000";

export const NOPE_IMAGE = {
  raw:
    "https://images.unsplash.com/photo-1573019606806-9695d0a9739d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjM4OTc4fQ",
  name: "Daniel Herron",
  profileLink: "https://unsplash.com/@herrond",
  downloadLocation: "https://api.unsplash.com/photos/vBxbZokRL10/download",
  photoLocation: "Oregon, USA",
  photoLink: "https://unsplash.com/photos/vBxbZokRL10",
};

export const CHROME_KEYS = {
  SEARCH: "search",
  BACKGROUND: "background",
  GOALS: "goals",
  NOTES: "notes",
  TIME: "time",
  GREETING: "greeting",
  SERIF: "serif",
  FLY: "fly",
};

export const DEFAULT_STATE = {
  [CHROME_KEYS.GREETING]: { showGreeting: true, name: "" },
  [CHROME_KEYS.TIME]: { showTime: true, standardTime: true },
  [CHROME_KEYS.GOALS]: {
    showGoals: true,
    goalOne: "",
    goalOneComplete: false,
    goalTwo: "",
    goalTwoComplete: false,
    duration: "today",
  },
  [CHROME_KEYS.SEARCH]: { query: "", saved: false },
  [CHROME_KEYS.NOTES]: { showNotes: false, notes: "", monospace: true },
  [CHROME_KEYS.FLY]: { showFly: false },
  [CHROME_KEYS.BACKGROUND]: getErrorImage(),
  // key indicating whether or not storage needs to be mapped
  // from v1
  mappedFromV0: true,
};

export const SETTINGS = [
  CHROME_KEYS.GREETING,
  CHROME_KEYS.TIME,
  CHROME_KEYS.GOALS,
  CHROME_KEYS.SERIF,
  CHROME_KEYS.FLY,
  CHROME_KEYS.NOTES,
];

export const PLACEHOLDER_WIDTH = {
  MAX_GOAL: "85vw",
  GOAL_ONE: "22.5vw",
  GOAL_ONE_SERIF: "25.5vw",
  GOAL_TWO: "13vw",
  GOAL_TWO_SERIF: "14.5vw",
  SEARCH: "12vw",
};

export const DURATIONS = ["today", "this week", "this month"];

export const SERIF_FONT_FAMILY = "Noto Serif";

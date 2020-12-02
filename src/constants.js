import { getErrorImage } from "./api/unsplash-api";

export const CHROME_KEYS = {
  BACKGROUND: "background",
  GOALS: "goals",
  NOTES: "notes",
  TIME: "time",
  ZOOM: "zoom",
  GREETING: "greeting",
};

export const hideableElements = [
  CHROME_KEYS.TIME,
  CHROME_KEYS.GREETING,
  CHROME_KEYS.TASKS,
];

export const DEFAULT_STATE = {
  [CHROME_KEYS.BACKGROUND]: getErrorImage(),
  [CHROME_KEYS.ZOOM]: { showZoom: false },
  [CHROME_KEYS.NOTES]: { showNotes: false },
  [CHROME_KEYS.TIME]: { showTime: true },
  [CHROME_KEYS.GREETING]: { showGreeting: true },
  [CHROME_KEYS.GOALS]: { showGoals: true },
};

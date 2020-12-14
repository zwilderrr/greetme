import { getErrorImage } from "./api/unsplash-api";

export const CHROME_KEYS = {
  BACKGROUND: "background",
  GOALS: "goals",
  NOTES: "notes",
  TIME: "time",
  ZOOM: "zoom",
  GREETING: "greeting",
};

export const DEFAULT_STATE = {
  [CHROME_KEYS.BACKGROUND]: { showBackground: true, ...getErrorImage() },
  [CHROME_KEYS.ZOOM]: { showZoom: false },
  [CHROME_KEYS.NOTES]: { showNotes: false, notes: "" },
  [CHROME_KEYS.TIME]: { showTime: true, standardTime: true },
  [CHROME_KEYS.GREETING]: { showGreeting: true, name: "" },
  [CHROME_KEYS.GOALS]: { showGoals: true },
};

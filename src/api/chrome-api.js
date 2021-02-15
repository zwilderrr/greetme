/*global chrome*/
import { DEFAULT_STATE, CHROME_KEYS } from "../constants";

export function logStorage(...args) {
  chrome.storage.sync.get(null, res =>
    console.log("next storage:", ...args, "\n", res)
  );
}

export function getChromeStorage(key) {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, res => {
      res = !key || Array.isArray(key) ? res : res[key];
      resolve(res);
    });
  });
}

export async function setChromeStorage(key, update) {
  const current = await getChromeStorage(key);
  const next = { ...current, ...update };
  return new Promise(resolve => {
    chrome.storage.sync.set({ [key]: { ...next } }, () => {
      resolve();
    });
  });
}

export async function initializeChromeStorage() {
  const storage = await getChromeStorage();
  if (Object.keys(storage).length === 0) {
    return new Promise(resolve => {
      chrome.storage.sync.set(DEFAULT_STATE, () => {
        console.log("storage initialized from default state");
        resolve();
      });
    });
  }

  if (!storage.mappedFromV0) {
    await clearChromeStorage();
    const nextStorage = mapStorage(storage);
    return new Promise(resolve => {
      chrome.storage.sync.set(nextStorage, () => {
        console.log("storage mapped from V0");
        resolve();
      });
    });
  }

  if (!storage[CHROME_KEYS.GOALS].duration) {
    const duration = "today";
    await setChromeStorage(CHROME_KEYS.GOALS, { duration });
    console.log("duration added");
  }
}

function clearChromeStorage() {
  return new Promise(resolve => {
    chrome.storage.sync.clear(() => resolve());
  });
}

function mapStorage(oldStorage) {
  const {
    backgroundImage,
    downloadLocation,
    goalOne,
    goalOneCompleted,
    goalTwo,
    goalTwoCompleted,
    imageQuery,
    monospace,
    name,
    notes,
    photoLocation,
    photographer,
    profileLink,
    savedBackground,
    showGoals,
    showNotes,
    showTime,
    showStandardTime,
    showZoom,
    showName,
  } = oldStorage;

  return {
    ...DEFAULT_STATE,
    [CHROME_KEYS.GREETING]: { showGreeting: showName, name },
    [CHROME_KEYS.TIME]: { showTime, standardTime: showStandardTime },
    [CHROME_KEYS.GOALS]: {
      showGoals,
      goalOne,
      goalOneComplete: goalOneCompleted,
      goalTwo,
      goalTwoComplete: goalTwoCompleted,
      duration: "today",
    },
    [CHROME_KEYS.SEARCH]: { query: imageQuery, saved: savedBackground },
    [CHROME_KEYS.NOTES]: { showNotes, notes, monospace },
    [CHROME_KEYS.FLY]: { showFly: showZoom },
    [CHROME_KEYS.BACKGROUND]: {
      backgroundImage,
      photographer,
      profileLink,
      downloadLocation,
      photoLocation,
    },
    mappedFromV0: true,
  };
}

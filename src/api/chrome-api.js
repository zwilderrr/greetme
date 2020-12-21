/*global chrome*/
import { DEFAULT_STATE } from "../constants";

export function logStorage(...args) {
  chrome.storage.sync.get(null, res =>
    console.log("next storage:", ...args, "\n", res)
  );
}

export function getChromeStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, res => {
      res = !key || Array.isArray(key) ? res : res[key];
      resolve(res);
    });
  });
}

export async function setChromeStorage(key, update, log = false) {
  const current = await getChromeStorage(key);
  const next = { ...current, ...update };
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: { ...next } }, () => {
      log && logStorage();
      resolve();
    });
  });
}

export async function initializeChromeStorage() {
  const storage = await getChromeStorage();
  if (Object.keys(storage).length === 0) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(DEFAULT_STATE, () => {
        console.log("storage initialized from default state");
        resolve();
      });
    });
  }
}

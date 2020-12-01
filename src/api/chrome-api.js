/*global chrome*/

export function logStorage(...args) {
  chrome.storage.sync.get(null, res =>
    console.log("next storage:", ...args, "\n", res)
  );
}

export function getChromeState(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, res => {
      // return either the obj the key points to, or an empty object
      const obj = res[key] || {};
      resolve(obj);
    });
  });
}

export async function setChromeState(key, update) {
  const current = await getChromeState(key);
  const next = { ...current, ...update };
  chrome.storage.sync.set({ [key]: { ...next } }, logStorage);
}

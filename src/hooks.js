import { useState, useEffect } from "react";
import { getChromeStorage } from "./api/chrome-api";

export function useGetChromeStorage(chromeKey, key, defaultState = "") {
  const [state, setState] = useState(defaultState);
  useEffect(() => {
    async function fetchData() {
      const storage = await getChromeStorage(chromeKey);
      storage[key] && setState(storage[key]);
    }
    fetchData();
  }, []);
  return [state, setState];
}
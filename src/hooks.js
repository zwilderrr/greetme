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

export function useSkipFirstRender(fn, dependencyArray) {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    !firstRender && fn();
  }, dependencyArray);
}

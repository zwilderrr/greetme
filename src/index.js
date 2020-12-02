import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeChromeStorage } from "./api/chrome-api";

import * as serviceWorker from "./serviceWorker";

async function renderApp() {
  await initializeChromeStorage();
  ReactDOM.render(<App />, document.getElementById("root"));
  serviceWorker.unregister();
}

renderApp();

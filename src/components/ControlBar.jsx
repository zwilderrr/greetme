import React, { useState, useEffect } from "react";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useSkipFirstRender } from "../hooks";
import { getChromeStorage, setChromeStorage } from "../api/chrome-api";
import { fetchImage, sendDownloadRequest } from "../api/unsplash-api";
import { CHROME_KEYS } from "../constants";
import { PinOutlined, PinFilled } from "../pinIcons";
import { SETTINGS } from "../constants";
import Background from "./Background";
import "./ControlBar.css";

export default function ControlBar({ toggleHide, show }) {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState({});
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { query, saved } = await getChromeStorage(CHROME_KEYS.SEARCH);
      let image = await getChromeStorage(CHROME_KEYS.BACKGROUND);
      if (!saved) {
        image = await fetchImage(query);
      }
      setQuery(query);
      setSaved(saved);
      setImage(image);
    }
    fetchData();
  }, []);

  useSkipFirstRender(() => {
    setChromeStorage(CHROME_KEYS.SEARCH, { saved, query });
    setChromeStorage(CHROME_KEYS.BACKGROUND, { ...image });
  }, [saved]);

  async function handleFormSubmit(e) {
    e && e.preventDefault();
    document.activeElement.blur();

    setChromeStorage(CHROME_KEYS.SEARCH, { query });

    const nextImage = await fetchImage(query);

    setImageLoading(true);
    setImage(nextImage);
  }

  function handlePinClick() {
    setSaved(!saved);

    if (!saved) {
      sendDownloadRequest(image.downloadLocation);
    }
  }

  function handleRefreshClick() {
    if (!saved) {
      setTimeout(() => !imageLoading && setImageLoading(false), 5000);
      handleFormSubmit();
    }
  }

  const PinIcon = saved ? PinFilled : PinOutlined;
  const refreshIconCssClass = imageLoading ? "rotate" : "rotate-in";

  return (
    <div>
      <div className="control-bar">
        <div className="search-container">
          <form
            autoComplete={false}
            onSubmit={handleFormSubmit}
            onBlur={handleFormSubmit}
          >
            <input
              className="query"
              onChange={e => setQuery(e.target.value)}
              value={query}
              placeholder="Search for..."
              disabled={saved}
            />
          </form>
          <div onClick={handlePinClick}>
            <PinIcon className="pin-icon" />
          </div>
          <div
            style={{ cursor: saved ? "default" : "pointer" }}
            onClick={handleRefreshClick}
          >
            <RefreshIcon className={refreshIconCssClass} htmlColor={"white"} />
          </div>
        </div>

        <div className="settings-container">
          {SETTINGS.map(s => {
            const className = show[s] ? "selected" : "";
            const setting = s === "notes" ? <ChevronLeftIcon /> : s;
            return (
              <div className={className} onClick={() => toggleHide(s)}>
                {setting}
              </div>
            );
          })}
        </div>
      </div>

      <Background
        {...image}
        setImageLoading={setImageLoading}
        imageLoading={imageLoading}
        fly={show.fly}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import { getChromeStorage, setChromeStorage } from "../api/chrome-api";
import { fetchImage } from "../api/unsplash-api";
import { CHROME_KEYS } from "../constants";
import { PinOutlined, PinFilled } from "../pinIcons";
import "./Background.css";

export default function Background({ showFly }) {
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

  useEffect(() => {
    setChromeStorage(CHROME_KEYS.SEARCH, { saved });
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

  const PinIcon = saved ? PinFilled : PinOutlined;
  const refreshIconClass = imageLoading ? "rotate" : "rotate-in";
  return (
    <>
      <div className="search-container">
        <form autoComplete={false} onSubmit={handleFormSubmit}>
          <input
            className="query"
            onChange={e => setQuery(e.target.value)}
            value={query}
            placeholder="Search for..."
            disabled={saved}
          />
        </form>
        <div onClick={() => query && setSaved(!saved)}>
          <PinIcon className="pin-icon" />
        </div>
        <div onClick={() => !saved && handleFormSubmit()}>
          <RefreshIcon className={refreshIconClass} htmlColor={"white"} />
        </div>
      </div>

      <BackgroundImage
        {...image}
        setImageLoading={setImageLoading}
        showFly={showFly}
      />
    </>
  );
}

function BackgroundImage({
  backgroundImage,
  photographer,
  profileLink,
  downloadLocation,
  photoLocation,
  photoLink,
  showFly,
  setImageLoading,
}) {
  return (
    <>
      {/* <img
        src={backgroundImage}
        alt=""
        onLoad={() => setImageLoading(false)}
        style={{ display: "none" }}
      />
      <div
        className="background-image"
        style={{
          height: 200,
          backgroundImage: `url(${backgroundImage})`,
        }}
      /> */}
    </>
  );
}

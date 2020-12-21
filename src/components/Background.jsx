import React, { useState, useEffect } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import { getChromeStorage, setChromeStorage } from "../api/chrome-api";
import { fetchImage } from "../api/unsplash-api";
import { CHROME_KEYS } from "../constants";
import "./Background.css";
import { PinOutlined, PinFilled } from "../pinIcons";

export default function Background() {
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
  const {
    backgroundImage,
    photographer,
    profileLink,
    downloadLocation,
    photoLocation,
    photoLink,
  } = image;

  return (
    <>
      <div onClick={() => !saved && handleFormSubmit()}>
        {imageLoading ? "loading image" : "image loaded"}
        <RefreshIcon htmlColor={"white"} />
      </div>
      <div onClick={() => query && setSaved(!saved)}>
        <PinIcon className="pin-icon" />
      </div>

      <form autoComplete={false} onSubmit={handleFormSubmit}>
        <input
          className="query"
          onChange={e => setQuery(e.target.value)}
          value={query}
          placeholder="Search for..."
          disabled={saved}
        />
      </form>

      <img
        src={backgroundImage}
        alt=""
        style={{ height: 200 }}
        onLoad={() => setImageLoading(false)}
      />
    </>
  );
}

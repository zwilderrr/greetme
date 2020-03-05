import React from "react";
import "./App.css";

export default function BackgroundImage({
  backgroundLoading,
  backgroundImage,
  setLoadingToFalse,
  showZoom,
  loadedImage
}) {
  return (
    <React.Fragment>
      <img
        src={backgroundImage}
        onLoad={() => setLoadingToFalse(backgroundImage)}
        onError={() => setLoadingToFalse()}
        style={{ display: "none" }}
        alt="background"
      />
      <div
        className={`background-image ${showZoom && "zoom"}`}
        style={{
          backgroundImage: `url(${loadedImage})`
        }}
      />
    </React.Fragment>
  );
}

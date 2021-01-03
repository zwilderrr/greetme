import React, { useState } from "react";
import "./Background.css";

export default function Background({
  backgroundImage,
  photographer,
  profileLink,
  downloadLocation,
  photoLocation,
  photoLink,
  fly,
  setImageLoading,
  imageLoading,
}) {
  const [currentImage, setCurrentImage] = useState("");

  return (
    <>
      <img
        src={backgroundImage}
        alt=""
        onLoad={() => {
          setImageLoading(false);
          setCurrentImage(backgroundImage);
        }}
        style={{ display: "none" }}
      />
      <div
        className="background-image"
        style={{
          height: 200,
          backgroundImage: `url(${currentImage})`,
        }}
      />
    </>
  );
}

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
          // setCurrentImage(backgroundImage);
        }}
        style={{ display: "none" }}
      />
      <div
        className="background-image"
        style={
          {
            // backgroundImage: `url(${currentImage})`,
          }
        }
      />

      {currentImage && !imageLoading && (
        <div className="credit">
          <a href={photoLink}>Photo </a>by{" "}
          <a href={`${profileLink}?utm_source=greetme&utm_medium=referral`}>
            {photographer}
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/?utm_source=greetme&utm_medium=referral">
            Unsplash
          </a>
          {photoLocation && `. ${photoLocation}`}
        </div>
      )}
    </>
  );
}

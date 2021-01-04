// const URL_BASE = "http://localhost:8000";
import { URL_BASE, ERROR_IMAGE } from "../constants";

export const getErrorImage = () => ({
  backgroundImage: `${ERROR_IMAGE.raw}&w=${window.innerWidth}`,
  photographer: ERROR_IMAGE.name,
  profileLink: ERROR_IMAGE.profileLink,
  downloadLocation: ERROR_IMAGE.downloadLocation,
  photoLocation: ERROR_IMAGE.title,
  photoLink: ERROR_IMAGE.photoLink,
});

export const fetchImage = async imageQuery => {
  const windowWidth = window.innerWidth;
  let url = URL_BASE;
  if (imageQuery) {
    url += `imageQuery=${imageQuery}&`;
  }
  url += `windowWidth=${windowWidth}&sig=${Math.random()}`; // ensure requests aren't cached

  try {
    const image = await fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      mode: "cors",
    });
    const jsonImage = await image.json();
    return jsonImage;
  } catch (e) {
    return getErrorImage();
  }
};

export const sendDownloadRequest = url => {
  const downloadLocation = JSON.stringify({
    "download-location": url,
  });

  fetch(`${URL_BASE}/trigger_download`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: downloadLocation,
  });
};

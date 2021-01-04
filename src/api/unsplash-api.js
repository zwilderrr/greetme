import { URL_BASE, NOPE_IMAGE } from "../constants";

export const getErrorImage = () => ({
  backgroundImage: `${NOPE_IMAGE.raw}&w=${window.innerWidth}`,
  photographer: NOPE_IMAGE.name,
  profileLink: NOPE_IMAGE.profileLink,
  downloadLocation: NOPE_IMAGE.downloadLocation,
  photoLocation: NOPE_IMAGE.title,
  photoLink: NOPE_IMAGE.photoLink,
});

export const fetchImage = async query => {
  const windowWidth = window.innerWidth;
  let url = URL_BASE;
  if (query) {
    url += `query=${query}&`;
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

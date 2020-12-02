// const urlBase = "http://localhost:8000";
const urlBase = "https://greetme-api-proxy.herokuapp.com";

const ERROR_IMAGE = {
  raw:
    "https://images.unsplash.com/photo-1573019606806-9695d0a9739d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjM4OTc4fQ",
  name: "Daniel Herron",
  profileLink: "https://unsplash.com/@herrond",
  download_location: "https://api.unsplash.com/photos/vBxbZokRL10/download",
  photoLocation: "Oregon, USA",
  photoLink: "https://unsplash.com/photos/vBxbZokRL10",
};

export const getErrorImage = (windowWidth = window.innerWidth) => ({
  backgroundImage: `${ERROR_IMAGE.raw}&w=${windowWidth}`,
  photographer: ERROR_IMAGE.name,
  profileLink: ERROR_IMAGE.profileLink,
  downloadLocation: ERROR_IMAGE.download_location,
  photoLocation: ERROR_IMAGE.title,
  photoLink: ERROR_IMAGE.photoLink,
});

export const fetchImage = async (imageQuery, windowWidth) => {
  const url = `${urlBase}/?imageQuery=${imageQuery}&windowWidth=${windowWidth}&sig=${Math.random()}`; // ensure requests aren't cached
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
};

export const sendDownloadRequest = url => {
  const downloadLocation = JSON.stringify({
    "download-location": url,
  });

  fetch(`${urlBase}/trigger_download`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: downloadLocation,
  });
};

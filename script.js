const mapElem = document.querySelector("[data-map]");
const apiKey = "at_q8eZXmpQ9whWaLxa88ymX6pF627wD";
const searchForm = document.forms.searchBar;

const addressElem = document.querySelector("[data-ip-address]");
const locationElem = document.querySelector("[data-ip-location]");
const timezoneElem = document.querySelector("[data-ip-timezone]");
const ISPElem = document.querySelector("[data-ip-isp]");

let marker;

let map = L.map(mapElem, {
  zoom: 7,
  center: [52.1326, 5.2913],
  maxZoom: 18,
  minZoom: 7,
  zoomControl: false,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = e.target[0].value;
  if (validIP(value)) {
    getIP(value, "");
  } else if (validURL(value)) {
    getIP("", value);
  }
});

function startForm() {
  searchBar.classList.remove("disabled");
}

function stopForm() {
  searchBar.classList.add("disabled");
}

async function getIP(ip, domain) {
  stopForm();
  await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}&domain=${domain}`)
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      setIPData(result);
    })
    .catch((error) => console.error(error));
  startForm();
}

getIP("", "");

function setIPData(data) {
  if (!data) return;
  if (marker) {
    map.removeLayer(marker);
  }
  marker = new L.Marker([data.location.lat, data.location.lng]);
  map.addLayer(marker);
  map.panTo(new L.LatLng(data.location.lat, data.location.lng));
  addressElem.textContent = data.ip;
  locationElem.innerText = `${data.location.city} \r\n ${data.location.region}, ${data.location.country}`;
  timezoneElem.textContent = `UTC ${data.location.timezone}`;
  ISPElem.textContent = data.isp;
}

function validIP(str) {
  let pattern = new RegExp("^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
  return !!pattern.test(str);
}

function validURL(str) {
  let pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

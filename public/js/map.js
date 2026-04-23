console.log("MAP JS LOADED");

const coordinates = window.coordinates;
const listingTitle = window.listingTitle;

console.log("coords:", coordinates);

if (coordinates && coordinates.length === 2) {

  const latLng = [coordinates[1], coordinates[0]];

  const map = L.map('map').setView(latLng, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  setTimeout(() => {
    map.invalidateSize(); // 🔥 FIX for blank map issue
  }, 200);

  L.marker(latLng).addTo(map)
    .bindPopup(listingTitle)
    .openPopup();

} else {
  console.log("No coordinates found");
}
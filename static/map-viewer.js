function loadJSON(callback) {
  const request = new XMLHttpRequest();
  request.overrideMimeType('application/json');
  request.open('GET', 'data.json', true);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      // Required use of an anonymous callback as .open
      // will NOT return a value but simply returns undefined
      // in asynchronous mode
      callback(request.responseText);
    }
  };
  request.send(null);
}

function renderMap(response) {
// create a base map using OSRM as a base layer
  const map = L.map('map');
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'ACCESS TOKEN'
  }).addTo(map);

// parse RO output
  const jsonData = JSON.parse(response);

// render routes and stops
  for (const tour of jsonData.tours) {
    const latLngs = [];
    for (const stop of tour.stops) {
      let lat = stop.lat;
      let lng = stop.lng;

      // create marker for the given stop
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Courier: ${tour.courier_id}<br/>${lat}, ${lng}`);

      latLngs.push([lat, lng]);
    }

    // draw a line representing a given tour
    const polyline = L.polyline(latLngs).addTo(map);

    map.fitBounds(polyline.getBounds());
  }
}

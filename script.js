// Initialize the map centered on Belgrade only once
const map = L.map('map').setView([44.7866, 20.4489], 13);

// Base Tile Layer from OpenStreetMap
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Overlays for vehicles and custom pins
const vehicleLayer = L.layerGroup().addTo(map);
const customPinLayer = L.layerGroup().addTo(map);

// Optional: Add Layer Control
const baseLayers = {
  "Base Map": baseLayer
};
const overlays = {
  "Vehicles": vehicleLayer,
  "Custom Pins": customPinLayer
};
L.control.layers(baseLayers, overlays).addTo(map);

// Update vehicle locations
function updateVehicleLocations(vehicleData) {
  vehicleLayer.clearLayers();
  vehicleData.forEach(vehicle => {
    L.marker([vehicle.lat, vehicle.lng])
      .bindPopup(`Vehicle ID: ${vehicle.id}`)
      .addTo(vehicleLayer);
  });
}

// Real-Time Data Simulation
function simulateRealTimeData() {
  const vehicleData = [];
  for (let i = 0; i < 5; i++) {
    const lat = 44.7866 + (Math.random() - 0.5) * 0.02;
    const lng = 20.4489 + (Math.random() - 0.5) * 0.02;
    vehicleData.push({ id: i + 1, lat, lng });
  }
  updateVehicleLocations(vehicleData);
}
simulateRealTimeData();
setInterval(simulateRealTimeData, 5000);

// Add custom pins
map.on('click', (e) => {
  const description = prompt('Enter a description for this pin:');
  if (description) {
    L.marker(e.latlng)
      .bindPopup(description)
      .addTo(customPinLayer);
  }
});

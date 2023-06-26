<template>
  <div>
    <h3>Location</h3>
    <div id="map" style="height: 400px;"></div>
  </div>
  <h2>Work is still in progress</h2>
</template>

<script setup lang="ts">
import L, { LatLngExpression } from 'leaflet';

const latitude = 51.505;
const longitude = -0.09;
const zoomLevel = 13;

const markerLat = 51.505; //
const markerLng = -0.09; //

let map: L.Map;

onMounted(() => {
  map = L.map('map').setView([latitude, longitude], zoomLevel);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const markerLatLng: LatLngExpression = [markerLat, markerLng];
  addMarker(markerLatLng);
});

function addMarker(latlng: LatLngExpression) {
  L.marker(latlng).addTo(map);
}
</script>

<style scoped>
</style>

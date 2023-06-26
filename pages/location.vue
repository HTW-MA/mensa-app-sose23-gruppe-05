<template>
  <div>
    <h3>Location</h3>
    <div id="map" style="height: 400px;"></div>
    <button @click="trackLocation">Share Location</button>
  </div>
</template>

<script setup lang="ts">
import L, { LatLngExpression, Marker, LatLngBounds } from 'leaflet';
import { ref } from 'vue';

const latitude = 51.505;
const longitude = -0.09;
const zoomLevel = 13;

const markerLat = 51.505;
const markerLng = -0.09;

let map: L.Map;
let marker: Marker | null = null;
const currentLocation = ref<LatLngExpression | null>(null);

function addMarker(latlng: LatLngExpression) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker(latlng).addTo(map);
}

function trackLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      currentLocation.value = [latitude, longitude];
      addMarker([latitude, longitude]);
      fitMapBounds();
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

function fitMapBounds() {
  const markerLatLng = marker?.getLatLng();
  const currentLatLng = currentLocation.value;
  if (markerLatLng && currentLatLng) {
    const bounds = L.latLngBounds([markerLatLng, currentLatLng]);
    map.fitBounds(bounds);
  }
}

onMounted(() => {
  map = L.map('map').setView([latitude, longitude], zoomLevel);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  addMarker([markerLat, markerLng]);
});
</script>

<style scoped>
</style>

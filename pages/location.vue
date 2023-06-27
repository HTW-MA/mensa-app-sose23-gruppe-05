<template>
  <div>
    <h3>Location</h3>
    <div id="map" style="height: 400px;"></div>
    <button @click="trackLocation">Share Location</button>
  </div>
</template>

<script setup lang="ts">
import L, { LatLngExpression, Marker } from 'leaflet';
import { ref } from 'vue';
import { RestClient } from "~/services/RestClient";
import redMarker from '@/assets/marker-red.png';
import blueMarker from '@/assets/marker-blue.png';

const allCanteens = ref([]);

const latitude = 52.520008;
const longitude = 13.404954;
const zoomLevel = 13;

let map: L.Map;
let marker: Marker | null = null;
const markers: Marker[] = [];
const currentLocation = ref<LatLngExpression | null>(null);

function addMarkerForCanteens(latlng: LatLngExpression, canteen: any) {
  const blueIcon = L.icon({
    iconUrl: blueMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }
  )
  const marker = L.marker(latlng, {icon: blueIcon}).addTo(map); // Create a new marker
  marker.bindPopup(`<strong>${canteen.name}</strong>`);// Set the popup content
  markers.push(marker); // Add the marker to the array
}

function addMarker(latlng: LatLngExpression) {
  if (marker) {
    map.removeLayer(marker);
  }

  const redIcon = L.icon({
    iconUrl: redMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  marker = L.marker(latlng, { icon: redIcon }).addTo(map);
  marker.bindPopup(`<strong>${"Your location"}</strong>`);// Set the popup content
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
  RestClient.getAllCanteens().then(data => {
    allCanteens.value = data;

    // Loop through each canteen and add a marker for its geoLocation
    allCanteens.value.forEach(canteen => {
      const { geoLocation } = canteen.address;
      if (geoLocation && geoLocation.latitude && geoLocation.longitude) {
        const { latitude, longitude } = geoLocation;
        addMarkerForCanteens([latitude, longitude], canteen);
      }
    });
  });

  map = L.map('map').setView([latitude, longitude], zoomLevel);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
});
</script>

<style scoped>
</style>

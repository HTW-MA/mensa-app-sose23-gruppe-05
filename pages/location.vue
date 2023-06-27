<template>
  <div>
    <h3>Location</h3>
    <div id="map" style="height: 400px;"></div>
    <button class="share-button" @click="trackLocation">Share my Location</button>
  </div>
</template>

<script setup lang="ts">
import L, { LatLngExpression, Marker } from 'leaflet';
import { ref } from 'vue';
import { RestClient } from "~/services/RestClient";
import redMarker from '@/assets/marker-red.png';
import blueMarker from '@/assets/marker-blue.png';
import orangeMarker from '@/assets/marker-orange.png';

const allCanteens = ref([]);

const latitude = 52.520008;
const longitude = 13.404954;
const zoomLevel = 10;

let map: L.Map;
let marker: Marker | null = null;
const markers: Marker[] = [];
const currentLocation = ref<LatLngExpression | null>(null);


function addMarkerForCanteens(latlng: LatLngExpression, canteen: any) {
  const blueIcon = L.icon({
    iconUrl: orangeMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const marker = L.marker(latlng, { icon: blueIcon }).addTo(map); // Create a new marker
  marker.bindPopup(`
    <div style="display: flex; flex-direction: column; align-items: center;">
      <strong>${canteen.name}</strong>
      <button style="border: 1px solid #ddd; background-color: #ff992b; margin-top: 5px;  border-radius: 5px;">Show Menu</button>
    </div>
  `); // Set the popup content with the styled button
  markers.push(marker); // Add the marker to the array

  marker.on('popupopen', () => {
    const popupButton = document.querySelector('.leaflet-popup-content button');
    if (popupButton) {
      popupButton.addEventListener('click', () => navigateToCanteen(canteen.id));
    }
  });
}

function navigateToCanteen(canteenId: string) {
  console.log(canteenId)
  const router = useRouter();
  router.push(`/canteens/${canteenId}`);
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

      // Fly to the marker's spot with a slightly increased zoom level
      const zoomLevel = map.getZoom() + 1; // Increase the zoom level by 1
      map.flyTo(new L.LatLng(latitude, longitude), zoomLevel);
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

.share-button {
  border: 1px solid #ddd;
  background-color: #ff992b;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
</style>

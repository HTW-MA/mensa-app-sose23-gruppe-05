<template>
  <div>
    <div id="mapContainer">
      <div id="map" :class="{ 'disabled': !internetConnection }"></div>
      <div v-if="!internetConnection" class="notification">Um auf die Karte zugreifen zu können, müssen Sie über eine Internetverbindung verfügen.</div>
    </div>
    <div class="share-button-container">
      <button class="share-button" @click="trackLocation" :disabled="!internetConnection" v-show="internetConnection">Meinen Standort abrufen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import L, { LatLngExpression, Marker } from 'leaflet';
import { ref, onMounted } from 'vue';
import { RestClient } from "~/services/RestClient";
import redMarker from '@/assets/marker-red.png';
import blueMarker from '@/assets/marker-blue.png';
import orangeMarker from '@/assets/marker-orange.png';

const allCanteens = ref([]);

const latitude = 52.520008;
const longitude = 13.404954;
const zoomLevel = 10;

let map: L.Map | null = null;
let marker: Marker | null = null;
const markers: Marker[] = [];
const currentLocation = ref<LatLngExpression | null>(null);
const internetConnection = ref(navigator.onLine);
const mapDisabled = ref(false);

function addMarkerForCanteens(latlng: LatLngExpression, canteen: any) {
  const blueIcon = L.icon({
    iconUrl: orangeMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const marker = L.marker(latlng, { icon: blueIcon }).addTo(map);
  marker.bindPopup(`
    <div style="display: flex; flex-direction: column; align-items: center;">
      <strong>${canteen.name}</strong>
      <button style="border: 1px solid #ddd; background-color: #ff992b; margin-top: 5px;  border-radius: 5px;">Show Menu</button>
    </div>
  `);
  markers.push(marker);

  marker.on('popupopen', () => {
    const popupButton = document.querySelector('.leaflet-popup-content button');
    if (popupButton) {
      popupButton.addEventListener('click', () => navigateToCanteen(canteen.id));
    }
  });
}

function navigateToCanteen(canteenId: string) {
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
  marker.bindPopup(`<strong>${"Dein Standort"}</strong>`);
}

function trackLocation() {
  if (navigator.onLine) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      currentLocation.value = [latitude, longitude];
      addMarker([latitude, longitude]);

      const zoomLevel = map.getZoom() + 1;
      map.flyTo(new L.LatLng(latitude, longitude), zoomLevel);

      mapDisabled.value = !internetConnection.value;

      if (!internetConnection.value) {
        map?.dragging.disable();
      } else {
        map?.dragging.enable();
      }
    });
  } else {
    internetConnection.value = false;
    mapDisabled.value = true;
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
    allCanteens.value.forEach(canteen => {
      const { geoLocation } = canteen.address;
      if (geoLocation && geoLocation.latitude && geoLocation.longitude) {
        const { latitude, longitude } = geoLocation;
        addMarkerForCanteens([latitude, longitude], canteen);
      }
      if (!internetConnection.value) {
        mapDisabled.value = true;
      }
    });
  });

  map = L.map('map').setView([latitude, longitude], zoomLevel);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  window.addEventListener('online', () => {
    internetConnection.value = true;
    mapDisabled.value = false;
    map?.dragging.enable();
  });

  window.addEventListener('offline', () => {
    internetConnection.value = false;
    mapDisabled.value = true;
    map?.dragging.disable();
  });

  function resizeMap() {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
        fitMapBounds();
      }, 100);
    }
  }

  resizeMap();
  window.addEventListener('resize', resizeMap);
});
</script>

<style scoped>
.share-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.share-button {
  color: black;
  border: 1px solid #ddd;
  background-color: #ff992b;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.disabled {
  filter: grayscale(1);
  pointer-events: none;
}

.notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ddd;
  background-color: #ffcc00;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
}

#mapContainer {
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden; /* Add this line to hide any overflow */
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%; /* Add this line to ensure the map fills the container */
  height: 100%; /* Add this line to ensure the map fills the container */
}

</style>

<template>
  <div>
    <div class="filter-container">
      <h6 v-if="!internetConnection">Ohne Internetverbindung haben Sie nur Zugriff auf Ihre Lieblingsmensa </h6>
      <input class="form-control" type="text" v-model="filterText" placeholder="Mensa suchen">
    </div>
    <div class="canteen-container">
      <div v-for="canteen in filteredCanteens" :key="canteen.id" @click="navigateToCanteenDetails(canteen.id)" class="canteen-item" style="border: 1px solid black; margin: 10px; position: relative;">
        <div v-if="internetConnection">
        <Icon v-if="canteenIsFavorite(canteen)" class="icon favorite-icon" name="ic:baseline-favorite" color="#d9480f" size="30"  @click.stop="toggleFavourite(canteen.id)" />
        <Icon v-if="!canteenIsFavorite(canteen)" class="icon favorite-icon" name="ic:baseline-favorite-border" size="30" @click.stop="toggleFavourite(canteen.id)" />
        </div>
        <div v-else>
          <Icon v-if="canteenIsFavorite(canteen)" class="icon favorite-icon" name="ic:baseline-favorite" color="#d9480f" size="30"/>
          <Icon v-if="!canteenIsFavorite(canteen)" class="icon favorite-icon" name="ic:baseline-favorite-border" size="30"/>
        </div>
        <div class="text-container">
          <h5 style="font-weight: bold">{{ canteen.name }}</h5>
          <div>{{ canteen.address.street}}</div>
          <div>{{canteen.address.zipcode + ' ' + canteen.address.city }}</div>
          <span style="font-weight: bold" v-if="hasOpeningHours(canteen, 'Mensa')">{{ getOpeningHours(canteen, 'Mensa') }}</span>
          <div></div>
          <span style="font-weight: bold" v-if="hasOpeningHours(canteen, 'Mittagstisch')">{{ getOpeningHours(canteen, 'Mittagstisch') }}</span>
          <span v-if="!hasOpeningHours(canteen, 'Mittagstisch') && !hasOpeningHours(canteen, 'Mensa')">geschlossen</span>
        </div>
        <div class="arrow">&#10095;</div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { RestClient } from '~/services/RestClient'

export default {
  data() {
    return {
      allCanteens: [],
      filterText: '',
      internetConnection: navigator.onLine,
    }
  },
  mounted() {
    window.addEventListener('online', this.updateInternetConnection);
    window.addEventListener('offline', this.updateInternetConnection);
    // Check if there is an internet connection
    const isOnline = navigator.onLine;

    if (isOnline) {
      // Online: Make API call using RestClient
      RestClient.getAllCanteens().then((data) => {
        this.allCanteens = data;
      });
    } else {
      // Offline: Retrieve canteens from IndexedDB
      const request = indexedDB.open('offline', 1);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('canteens', 'readonly');
        const objectStore = transaction.objectStore('canteens');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = (event) => {
          const canteens = event.target.result;
          this.allCanteens = canteens;
        };

        transaction.onerror = (event) => {
          console.error('Error retrieving canteens from IndexedDB:', event.target.error);
        };
      };

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
      };
    }
  },
  beforeUnmount() {
    // Remove event listener when component is unmounted
    window.removeEventListener('online', this.updateInternetConnection);
    window.removeEventListener('offline', this.updateInternetConnection);
  },

  computed: {
    filteredCanteens() {
      const filter = this.filterText.trim().toLowerCase();
      if (!this.internetConnection) {
        // Return only the favorite canteen if there is no internet connection
        const favoriteCanteenId = localStorage.getItem('favoriteCanteenId');
        return this.allCanteens.filter(canteen => canteen.id === favoriteCanteenId);
      } else {
        // Filter and sort the canteens as usual
        return this.allCanteens
            .filter(canteen => canteen.name.toLowerCase().includes(filter))
            .sort((a, b) => {
              if (this.canteenIsFavorite(a)) {
                return -1; // a is favorite, b is not
              } else if (this.canteenIsFavorite(b)) {
                return 1; // b is favorite, a is not
              } else {
                // Neither a nor b is favorite, sort by name
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
              }
            });
      }
    }
,
  },
  methods: {
    toggleFavourite(canteenId) {
      let existingFavorites = localStorage.getItem('favoriteCanteenId') || '';

      if (existingFavorites !== canteenId) {
        // Replace existing favorite with new canteen ID
        existingFavorites = canteenId;
        localStorage.setItem('favoriteCanteenId', existingFavorites);
      } else {
        // Remove favorite if it's already the same
        existingFavorites = '';
        localStorage.removeItem('favoriteCanteenId');
      }
      this.$forceUpdate();

    },
    updateInternetConnection() {
      this.internetConnection = navigator.onLine;
    },
    canteenIsFavorite(canteen: any): boolean{
      const favCanteenId = localStorage.getItem('favoriteCanteenId')
      return favCanteenId === canteen.id
    },
    hasOpeningHours(canteen, businessHourType) {
      const businessDays = canteen.businessDays;
      const matchingDay = businessDays.find(day => day.day === this.getCurrentWeekdayAbbreviation());

      if (matchingDay) {
        const openingHours = matchingDay.businessHours;
        return openingHours.some(hour => hour.businessHourType === businessHourType);
      }

      return false;
    },
    getOpeningHours(canteen, businessHourType) {
      const businessDays = canteen.businessDays;
      const matchingDay = businessDays.find(day => day.day === this.getCurrentWeekdayAbbreviation());

      if (matchingDay) {
        const openingHours = matchingDay.businessHours;
        const formattedOpeningHours = openingHours
            .filter(hour => hour.businessHourType === businessHourType)
            .map(hour => `${hour.openAt} - ${hour.closeAt}`)
            .join(', ');

        return `${businessHourType}: ${formattedOpeningHours}`;
      }

      return '';
    },
    getCurrentWeekdayAbbreviation() {
      const germanWeekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      const currentWeekday = new Date().getDay();
      return germanWeekdays[currentWeekday];
    },
    navigateToCanteenDetails(canteenId) {
      this.$router.push(`/canteens/${canteenId}`)
    },
     getCanteensFromDB(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('canteens', 'readonly');
    const objectStore = transaction.objectStore('canteens');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

},
}
</script>

<style scoped>
.text-container {
  padding-right: 40px; /* 30px of icon size + 10px of extra space */
}

.favorite-icon {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 15px;
  margin-top: 15px;
}

.filter-container {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 10px;
  z-index: 1;
}

.canteen-container {
  margin-top: 50px; /* Adjust the margin-top value to leave space for the input field */
}

.canteen-item {
  position: relative;
  border: 1px solid #ddd;
  padding: 15px;
  padding-left: 30px; /* Added to ensure the text does not overlap with the star icon */
  border-radius: 5px;
  background-color: #ff992b;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
}
.arrow {
  margin-right: 20px;
  font-size: 40px; /* Adjust the size as per your requirement */
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);}
</style>

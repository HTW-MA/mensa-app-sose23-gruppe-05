<template>
  <div>
    <div class="filter-container">
      <input class="form-control" type="text" v-model="filterText" placeholder="Mensa suchen">
    </div>
    <div class="canteen-container">
      <div v-for="canteen in filteredCanteens" :key="canteen.id" @click="navigateToCanteenDetails(canteen.id)" class="canteen-item" style="border: 1px solid black; margin: 10px; position: relative;">
        <Icon v-if="canteenIsFavorite(canteen)" class="icon star-icon" name="ic:baseline-star" color="#d9480f" size="30" />
        <h5 style="font-weight: bold">{{ canteen.name }}</h5>
        <div></div>
        <div>{{ canteen.address.street}}</div>
        <div>{{canteen.address.zipcode + ' ' + canteen.address.city }}</div>
        <div></div>
        <span style="font-weight: bold" v-if="hasOpeningHours(canteen, 'Mensa')">{{ getOpeningHours(canteen, 'Mensa') }}</span>
        <div></div>
        <span style="font-weight: bold" v-if="hasOpeningHours(canteen, 'Mittagstisch')">{{ getOpeningHours(canteen, 'Mittagstisch') }}</span>
        <span v-if="!hasOpeningHours(canteen, 'Mittagstisch') && !hasOpeningHours(canteen, 'Mensa')">geschlossen</span>
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
    }
  },
  mounted() {
    RestClient.getAllCanteens().then(data => {
      this.allCanteens = data;
    });
  },
  computed: {
    filteredCanteens() {
      const filter = this.filterText.trim().toLowerCase();
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
    },
  },
  methods: {
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
  },
}
</script>

<style scoped>

.star-icon {
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

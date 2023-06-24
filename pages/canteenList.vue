<template>
  <div>
    <div class="filter-container">
      <input class="form-control" type="text" v-model="filterText" placeholder="Kantine suchen">
    </div>
    <div class="canteen-container">
      <div v-for="canteen in filteredCanteens" :key="canteen.id" @click="navigateToCanteenDetails(canteen.id)" class="canteen-item" style="border: 1px solid black; margin: 10px; position: relative;">
        <i v-if="!canteenIsFavorite(canteen)" class="bi bi-star" style="margin-right: 5px"></i>
        <i v-if="canteenIsFavorite(canteen)" class="bi bi-star-fill" style="margin-right: 5px"></i>
        <span style="font-weight: bold">{{ canteen.name }}</span>
        <div></div>
        <span>{{ canteen.address.street + ', ' + canteen.address.zipcode + ' ' + canteen.address.city }}</span>
        <div></div>
        <span v-if="hasOpeningHours(canteen, 'Mensa')">{{ getOpeningHours(canteen, 'Mensa') }}</span>
        <span v-else>keine Öffnungszeiten vorhanden</span>
        <div></div>
        <span v-if="hasOpeningHours(canteen, 'Mittagstisch')">{{ getOpeningHours(canteen, 'Mittagstisch') }}</span>
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
}
.arrow {
  margin-right: 20px;
  font-size: 40px; /* Adjust the size as per your requirement */
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);}
</style>

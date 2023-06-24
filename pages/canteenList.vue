<template>
  <div>
    <div class="filter-container">
      <input type="text" v-model="filterText" placeholder="Kantine suchen">
    </div>
    <div class="canteen-container">
      <div v-for="canteen in filteredCanteens" :key="canteen.id" @click="navigateToCanteenDetails(canteen.id)">
        <div class="canteen-item" style="margin: 10px;border: 1px solid black; margin: 10px">
          <span style="font-weight: bold">{{ canteen.name }}</span>
          <div></div>
          <span>{{ canteen.address.street + ', ' + canteen.address.zipcode + ' ' + canteen.address.city }}</span>
          <div></div>
          <span v-if="hasOpeningHours(canteen, 'Mensa')">{{ getOpeningHours(canteen, 'Mensa') }}</span>
          <span v-else>keine Öffnungszeiten vorhanden</span>
          <div></div>
          <span v-if="hasOpeningHours(canteen, 'Mittagstisch')">{{ getOpeningHours(canteen, 'Mittagstisch') }}</span>
          <span v-else>kein Mittagstisch</span>
        </div>
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
            if (this.filterText.trim() === '') {
                return this.allCanteens;
            } else {
                const filter = this.filterText.trim().toLowerCase();
                return this.allCanteens.filter(canteen => canteen.name.toLowerCase().includes(filter));
            }
        },
    },
    methods: {
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
    margin-top: 50px;
}

.canteen-item {
    position: relative;
}
</style>

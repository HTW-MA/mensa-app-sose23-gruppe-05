<template>
  <div v-if="canteen">
  <div class="container">
    <div class="canteen-header">
      <h3>{{canteen.name}}</h3>
      <Icon
          v-if="!isFavourite"
          name="ic:baseline-star-outline"
          size="50px"
          @click="toggleFavourite"
      ></Icon>
      <Icon
          v-else
          name="ic:baseline-star-rate"
          size="50px"
          color="#d9480f"
          @click="toggleFavourite"
      ></Icon>
    </div>
    <div class="canteen-details">
      <div class="location">
      <p class="adress">{{ canteen.address.street }}</p>
      <p class="adress">{{ canteen.address.zipcode }} {{ canteen.address.city }}, {{ canteen.address.district}}</p>
      </div>
      <div class="opening-hours">
      <p class="time"><b>Öffnungszeiten:</b> {{ getOpeningHours()[0] }}</p>
      <p class="time"><b>Mittagstisch:</b> {{ getOpeningHours()[1] }}</p>
      </div>
    </div>
    <div class="canteen-menu">
      <h2>Menü</h2>
      <div class="button-date">
        <button class="toggle-date" :class="{ disabled: isFirstDay }" @click="toggleDate(false)">-</button>
        <span class="day"> {{ day }} </span>
        <span> {{ selectedDateString.slice(5,10) }} </span>
        <button class="toggle-date" :class="{ disabled: isLastDay }" @click="toggleDate(true)">+</button>
      </div>
      <div class="filter">
        <button class="filter-button" :class="{ 'active': selectedCategory === 'Essen' }" @click="selectedCategory = 'Essen'">Essen</button>
        <button class="filter-button" @click="selectedCategory = 'Beilagen'">Beilagen</button>
        <button class="filter-button" @click="selectedCategory = 'Salate'">Salate</button>
        <button class="filter-button" @click="selectedCategory = 'Suppen'">Suppen</button>
        <button class="filter-button" @click="selectedCategory = 'Desserts'">Desserts</button>
      </div>
      <div>
        <div v-for="item in filteredMenuItems" :key="item.date">
          <div v-if="item.meals.length === 0">
            <!-- Render when the canteen is closed for the selected date -->
            Mensa ist geschlossen
          </div>
          <div v-else>
            <!-- Render menu items for the selected date -->
            <div class="menu-item" v-for="meal in item.meals" :key="meal.id">
             <h3>{{ meal.category }}</h3>
              <p><b>{{ meal.name }}</b></p>
              <p class="additives">Zusatzstoffe: {{ getAdditivesText(meal.additives) }}</p>
              <div class="price-logos">
              <div v-for="price in meal.prices" :key="price.priceType">
                <p v-if="price.priceType ==='Studierende'"> <Icon class="icon" name="ic:baseline-school" color="black" size="22px" /> {{ price.price }}€</p>
                <p v-else-if="price.priceType ==='Angestellte'"> <Icon class="icon" name="ic:baseline-work" color="black" size="22px" /> {{ price.price }}€</p>
                <p v-else-if="price.priceType ==='Gäste'"> <Icon class="icon" name="ic:baseline-man" color="black" size="24px" /> {{ price.price }}€</p>
              </div>
              </div>
            </div>
          </div>
        </div>
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
      canteenId: this.$route.params.canteenId,
      canteen: '' as any,
      menuItems: [] as any[],
      menuToDay: [] as any[],
      selectedCategory: 'Essen',
      role: localStorage.getItem('role'),
      favourites: '',
      isFavourite: false,
      startDate: '',
      endDate: '',
      selectedDateString: '',
      selectedDate: new Date(),
      day: '',
    }
  },
    mounted() {
      // Fetch canteen data from API
      RestClient.getCanteenById(this.canteenId).then(data => {this.canteen = data[0]; console.log(data[0])})
      // Fetch menu data from API
      this.calculateDates();
      RestClient.getMenueForCanteenInPeriod(this.canteenId, this.startDate,this.endDate)
          .then(data => {
            this.menuItems = data;
            console.log(data);})
      this.favourites = localStorage.getItem('favourites') || '';
      this.isFavourite = this.favourites.includes(this.canteenId);
    },
  methods: {
    getFilteredPrices(prices) {
      if (this.role === 'student') {
        return prices.filter(price => price.priceType === 'Studierende');
      } else if (this.role === 'employee') {
        return prices.filter(price => price.priceType === 'Angestellte');
      } else if (this.role === 'guest') {
        return prices.filter(price => price.priceType === 'Gäste');
      } else {
        return prices;
      }
    },
    getAdditivesText(additives) {
      return additives.map(additive => additive.text).join(', ');
    },
    // Calculate dates for API call (today + 7 days)
    calculateDates() {
      const dateToday = new Date();
      const dateSevenDaysAfter = new Date(dateToday.getTime() + (7 * 24 * 60 * 60 * 1000));
      this.startDate = dateToday.toISOString().slice(0,10);
      this.selectedDate = dateToday
      this.selectedDateString = dateToday.toISOString().slice(0,10);
      this.endDate = dateSevenDaysAfter.toISOString().slice(0,10);
    },
    toggleDate(increment) {
      const newDate = new Date(this.selectedDate.getTime() + (increment ? 1 : -1) * 24 * 60 * 60 * 1000);
      const newDateISOString = newDate.toISOString().slice(0, 10);

      if (newDateISOString >= this.startDate && newDateISOString <= this.endDate) {
        this.selectedDate = newDate;
        this.selectedDateString = newDateISOString;
      }
      this.filterMenu();
    },
    filterMenu() {
      this.menuToDay = this.menuItems.filter(item => item.date === this.selectedDateString);
      console.log("menuItems", this.menuItems.filter(item => item.date === this.selectedDateString))
      console.log("menuToDay", this.menuToDay[0].meals)
      console.log("menuToDay", this.menuToDay[0].meals[0])
      console.log("menuToDay", this.menuToDay); // Output the menuToDay object

    },

    getOpeningHours() {
      const day = this.selectedDate.getDay() === 0 ? 6 : this.selectedDate.getDay() - 1;
      this.displayDay(day);

      const businessHours = this.canteen.businessDays[day].businessHours;
      if (businessHours.length === 0) {
        return ["geschlossen", "geschlossen"];
      }

      const openingHour = businessHours[0].openAt + " - " + businessHours[0].closeAt;
      const mensaHour = businessHours[1].openAt + " - " + businessHours[1].closeAt;

      return [openingHour, mensaHour];
    },

    displayDay(day) {
      switch (day) {
        case 0:
          this.day = "Montag";
          break;
        case 1:
          this.day = "Dienstag";
          break;
        case 2:
          this.day = "Mittwoch";
          break;
        case 3:
          this.day = "Donnerstag";
          break;
        case 4:
          this.day = "Freitag";
          break;
        case 5:
          this.day = "Samstag";
          break;
        case 6:
          this.day = "Sonntag";
          break;
      }
    },
    toggleFavourite() {
      const canteenId = this.canteen.id;
      let existingFavorites = localStorage.getItem('favourites') || '';

      if (existingFavorites !== canteenId) {
        // Replace existing favorite with new canteen ID
        existingFavorites = canteenId;
        localStorage.setItem('favourites', existingFavorites);
      } else {
        // Remove favorite if it's already the same
        existingFavorites = '';
        localStorage.removeItem('favourites');
      }

      this.checkFavorite();
    },


    checkFavorite() {
      const canteenId = this.canteen.id;
      let existingFavorites;
        existingFavorites = localStorage.getItem('favourites') || '';
        this.isFavourite = existingFavorites.includes(canteenId);

    },

  },
  computed: {
    isFirstDay() {
      return this.selectedDateString === this.startDate;
    },
    isLastDay() {
      return this.selectedDateString === this.endDate;
    },
    filteredMenuItems() {
      if (this.selectedCategory === 'Essen') {
        return this.menuToDay.map(item => {
          const filteredMeals = item.meals.filter(meal => meal.category === 'Vorspeisen' || meal.category === 'Essen');
          return { ...item, meals: filteredMeals };
        }).filter(item => item.meals.length > 0);
      } else if (this.selectedCategory !== 'All') {
        return this.menuToDay.map(item => {
          const filteredMeals = item.meals.filter(meal => meal.category === this.selectedCategory);
          return { ...item, meals: filteredMeals };
        }).filter(item => item.meals.length > 0);
      } else {
        return this.menuToDay;
      }
    }

  }

}
</script>


<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
}

.canteen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.canteen-details h2,
.canteen-menu h2 {
  color: #FFA500;
  margin-top: 20px;
}

.canteen-details p,
.canteen-menu p {
  color: #333;
}

.canteen-menu {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.menu-item {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  background-color: #ff992b;
}

.adress, .time {
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.adress {
  font-size: 12px;
}

.opening-hours {
  margin-top: 10px
}

.toggle-date, .filter-button {
  background-color: #ff992b;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 2px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.4s;
}

.disabled {
  background-color: gray;
  cursor: not-allowed;
}

p {
  margin: 0;
  padding: 0;
}

.price-logos {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}

.filter-button.active,
.filter-button:hover,
.filter-button:focus,
.filter-button:active {
  background-color: #d9480f;
  /* Other styles for active button */
}


.day {
  margin-right: 5px;
  font: bold 16px Arial, sans-serif;
}
</style>
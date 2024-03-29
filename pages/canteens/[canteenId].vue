<template>
  <div v-if="canteen">
  <div class="container">
    <div v-if="internetConnection" class="canteen-header">
      <h3>{{canteen.name}}</h3>
      <Icon
          v-if="!isFavourite"
          name="ic:baseline-favorite-border"
          size="50px"
          @click="toggleFavourite"
      ></Icon>
      <Icon
          v-else
          name="ic:baseline-favorite"
          size="50px"
          color="#d9480f"
          @click="toggleFavourite"
      ></Icon>
    </div>
    <div v-else class="canteen-header">
      <h3>{{canteen.name}}</h3>
      <Icon
          name="ic:baseline-favorite"
          size="50px"
          color="#808080"
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
        <button class="toggle-date" :class="{ disabled: isFirstDay }" @click="toggleDate(false)">
          <Icon
              name="ic:baseline-arrow-back"
          ></Icon>
        </button>
        <div class="day-date">
        <span class="day"> {{ day }} </span>
          <span> {{'(' + selectedDateStringReadableFormatted + ')' }} </span>
        </div>
        <button class="toggle-date" :class="{ disabled: isLastDay }" @click="toggleDate(true)">
          <Icon
              name="ic:baseline-arrow-forward"
          ></Icon>
        </button>
      </div>
      <div class="filter">
        <button class="filter-button" :class="{ 'active': selectedCategory === 'Essen' }" @click="selectedCategory = 'Essen'">Essen</button>
        <button class="filter-button" @click="selectedCategory = 'Beilagen'">Beilagen</button>
        <button class="filter-button" @click="selectedCategory = 'Salate'">Salate</button>
        <button class="filter-button" @click="selectedCategory = 'Suppen'">Suppen</button>
        <button class="filter-button" @click="selectedCategory = 'Desserts'">Desserts</button>
      </div>
      <div v-if="isLoading" class="spinner-container">
        <div v-if="isLoading" class="spinner">
        </div>
      </div>
      <div v-else>
        <div v-if="filteredMenuItems.length === 0" class="no-mensa">
          Diese Mensa hat keine Informationen verfügbar. Bitte Versuche es mit einer anderen Mensa
        </div>
        <div v-else v-for="item in filteredMenuItems" :key="item.date">
          <div v-if="item.meals.length === 0" class="no-menu">
            <!-- Render when the canteen is closed for the selected date -->
            Es ist kein Menü für den ausgewählten Tag verfügbar
          </div>
          <div v-else>
            <!-- Render menu items for the selected date -->
            <div class="menu-item" v-for="meal in item.meals" :key="meal.id">
             <h3>{{ meal.category }}</h3>
              <p><b>{{ meal.name }}</b></p>
              <p v-if="getAdditivesText(meal.additives)" class="additives">Zusatzstoffe: {{ getAdditivesText(meal.additives) }}</p>
              <p v-else class="additives">Zusatzstoffe: Keine Info</p>
              <div class="price-logos">
              <div v-for="price in meal.prices" :key="price.priceType">
                <p v-if="price.priceType ==='Studierende' && userRole === 'student'"> <Icon class="icon" name="ic:baseline-school" color="black" size="22px" /> {{ price.price }}€</p>
                <p v-else-if="price.priceType ==='Angestellte' && userRole === 'employee'"> <Icon class="icon" name="ic:baseline-work" color="black" size="22px" /> {{ price.price }}€</p>
                <p v-else-if="price.priceType ==='Gäste' && userRole === 'guest'"> <Icon class="icon" name="ic:baseline-man" color="black" size="24px" /> {{ price.price }}€</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <div v-else class="no-favorite">
    <h2>Keine Lieblingsmensa ausgewählt!</h2>
    <p>Klicke auf die Herzsymbole auf den Seiten, um eine Mensa als Favorit zu markieren:</p>
    <div class="icon-example">
      <Icon
          name="ic:baseline-favorite-border"
          size="50px"
          color="#d9480f"
      ></Icon>
      <p class="icon-description">Dieses Symbol zeigt an, dass die Mensa noch nicht zu deinen Favoriten gehört. Klicken darauf, um sie hinzuzufügen.</p>
    </div>
    <div class="icon-example">
      <Icon
          name="ic:baseline-favorite"
          size="50px"
          color="#d9480f"
      ></Icon>
      <p>Dieses Symbol zeigt an, dass die Mensa zu deinen Favoriten gehört. Klicke darauf, um sie zu entfernen.</p>
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
      userRole: localStorage.getItem('userRole'),
      isLoading: true,
      internetConnection: navigator.onLine,
    }
  },
  mounted() {
    window.addEventListener('online', this.updateInternetConnection);
    window.addEventListener('offline', this.updateInternetConnection);
    // Check if there is an internet connection
    const isOnline = navigator.onLine;
    // Fetch canteen data from API
    RestClient.getCanteenById(this.canteenId)
        .then(data => {
          this.canteen = data[0];
        });

    // Fetch menu data from API
    this.calculateDates();
    RestClient.getMenueForCanteenInPeriod(this.canteenId, this.startDate, this.endDate)
        .then(data => {
          this.menuItems = data;
          this.filterMenu(); // Filter and display the menu
        });

    this.favourites = localStorage.getItem('favoriteCanteenId') || '';
    this.isFavourite = this.favourites.includes(this.canteenId);
  },

  created() {
    this.isLoading = true; // Set loading to true initially

    const fetchCanteen = RestClient.getCanteenById(this.canteenId)
        .then(data => {
          console.log("Canteen: " ,data);
          this.canteen = data[0];
        });

    this.calculateDates();
    const fetchMenu = RestClient.getMenueForCanteenInPeriod(this.canteenId, this.startDate, this.endDate)
        .then(data => {
          console.log("Menu data: ", data);
          this.menuItems = data;
          this.filterMenu(); // Filter and display the menu
        });

    Promise.all([fetchCanteen, fetchMenu])
        .then(() => {
        })
        .catch(error => {
          console.log(error);
        });

    this.favourites = localStorage.getItem('favoriteCanteenId') || '';
    this.isFavourite = this.favourites.includes(this.canteenId);
  },


  methods: {
    getAdditivesText(additives) {
      return additives.map(additive => additive.text).join(', ');
    },
    // Calculate dates for API call (today + 7 days)
    calculateDates() {
      const dateToday = new Date();
      const dateSevenDaysAfter = new Date(dateToday.getTime() + (14 * 24 * 60 * 60 * 1000));
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
      this.$nextTick(() => {
        setTimeout(() => {
          this.isLoading = false; // Set loading to false after 1 second
        }, 1000);
      });
    },

    getOpeningHours() {
      const day = this.selectedDate.getDay() === 0 ? 6 : this.selectedDate.getDay() - 1;
      this.displayDay(day);

      const businessHours = this.canteen.businessDays[day].businessHours;
      if (businessHours.length === 0) {
        return ["geschlossen", "geschlossen"];
      }

      const openingHour = (businessHours[0]?.openAt ?? "Keine Info") + " - " + (businessHours[0]?.closeAt ?? "Keine Info");
      const mensaHour = (businessHours[1]?.openAt ?? "Keine Info") + " - " + (businessHours[1]?.closeAt ?? "Keine Info");

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

      this.checkFavorite();
    },

    updateInternetConnection() {
      this.internetConnection = navigator.onLine;
    },

    checkFavorite() {
      const canteenId = this.canteen.id;
      let existingFavorites;
        existingFavorites = localStorage.getItem('favoriteCanteenId') || '';
        this.isFavourite = existingFavorites.includes(canteenId);

    },

  },
  computed: {
    selectedDateStringReadableFormatted () {

      const date = new Date(this.selectedDateString);

      const options = { day: "2-digit", month: "2-digit" };

      return date.toLocaleDateString("de-DE", options);

    },
    isFirstDay() {
      return this.selectedDateString === this.startDate;
    },
    isLastDay() {
      return this.selectedDateString === this.endDate;
    },
    filteredMenuItems() {
      let result;

      if (this.selectedCategory === 'Essen') {
        result = this.menuToDay.map(item => {
          const filteredMeals = item.meals.filter(meal => meal.category === 'Vorspeisen' || meal.category === 'Essen');
          this.isLoading = false;
          return { ...item, meals: filteredMeals };
        });
      } else if (this.selectedCategory !== 'All') {
        result = this.menuToDay.map(item => {
          const filteredMeals = item.meals.filter(meal => meal.category === this.selectedCategory);
          this.isLoading = false;
          return { ...item, meals: filteredMeals };
        });
      } else {
        this.isLoading = false;
        result = this.menuToDay;
      }
      this.isLoading = false;
      return result;
    }
  }

}
</script>


<style scoped>

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
  padding: 15px;
  border-radius: 5px;
  background-color: #ff992b;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
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
  color: black;
  background-color: #ff992b;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.4s;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
  margin: 2px;
  display: inline-block;
  text-align: center;
}

.toggle-date {
  padding: 6px 24px;
}

.filter-button {
  width: 100px;
  height: 40px;
  padding: 5px 20px;
  line-height: 30px;
}


.filter {
  text-align: center;
}


.button-date {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
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
  margin-top: 10px;
}
.price-logos p {
  margin-right: 5px;
}

.filter-button.active,
.filter-button:hover,
.filter-button:focus,
.filter-button:active,
.toggle-date:active {
  background-color: #d9480f;
}

@keyframes clickAnimation {
  0% {background-color: #d9480f;}
  80% {background-color: #d9480f;}
  100% {background-color: #ff992b;}
}

.filter-button:active,
.toggle-date:active {
  animation: clickAnimation 20s forwards;
}

.day {
  margin-right: 5px;
  font: bold 16px Arial, sans-serif;
}

.no-menu, .no-mensa {
  font-size: 18px;
  color: #d9480f;
  font-weight: bold;
  padding: 15px;
  margin: 15px 0;
  text-align: center;
  border-radius: 5px;
  background: #fcebde;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
  0px 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.no-mensa {
  background: #d9480f;
  color: black;
}

.no-favorite {
  padding: 0rem 2rem;
  text-align: center;
  color: #4a4a4a;
  font-size: 1.2rem;
}

.no-favorite h2 {
  color: #d9480f;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.icon-example {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  margin-top: 40px;
}

.icon-example p {
  margin-left: 1rem;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #d9480f;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>

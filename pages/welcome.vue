<template>
  <div class="container mt-5">
    <h1 class="text-center" style="font-family: 'Comme'; color: #555;">Willkommen zu <span
        style="color: #ff922b;">MensaMania</span>!</h1>
    <div class="row justify-content-center mt-5">
      <div class="col-lg-6">
        <div class="mb-3">
          <label for="searchField" class="form-label" style="font-weight: bold; color: #555;">Lieblingsmensa:</label>
          <input className="canteenSearch" type="search" id="canteenSearch" class="form-control equal-width"
                 v-model="canteen" placeholder="Suche deine Lieblingsmensa" style="background-color: #ffffff;"
                 @input="searchCanteen" @click="searchCanteen">
        </div>
        <div class="mb-3">
          <ul class="list-group" v-if="showResults === true">
            <li v-for="result in filteredResults" :key="result.id" class="list-group-item" @click="selectCanteen(result)">
              {{ result.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="mb-3">
          <label for="roleSelect" class="form-label" style="font-weight: bold; color: #555;">Rolle:</label>
          <select className="roleSelect" id="roleSelect" class="form-select equal-width" v-model="selectedRole"
                  style="background-color: #ffffff;" placeholder="Wähle eine Rolle">
            <option value="" disabled style="color: #555;">Wähle eine Rolle...</option>
            <option value="student" style="color: #555;">Student</option>
            <option value="employee" style="color: #555;">Angestellter</option>
            <option value="guest" style="color: #555;">Gast</option>
          </select>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div class="row mt-3">
        <div class="col-sm"></div>
        <div class="col-sm">
          <button class="btn text-center" @click="saveSetting">Speichern</button>
        </div>
        <div class="col-sm"></div>
      </div>
    </div>
  </div>
</template>

<script >

import { RestClient } from '~/services/RestClient';
import { navigateTo } from "#app";

export default {
  name: 'WelcomePage',
  data() {
    return {
      canteen: '',
      allCanteens: '',
      showResults: false,
      filteredResults: [],
      selectedRole: '',
    }
  },
  mounted() {
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
  methods: {
    searchCanteen() {

      this.showResults = true;

      const query = this.canteen.toLowerCase();
      this.filteredResults = this.allCanteens.filter(canteen => canteen.name.toLowerCase().includes(query));


      this.showResults = this.filteredResults.length > 0 && this.canteen !== this.filteredResults[0].name;
    },

    selectCanteen(canteen) {
      this.canteen = canteen.name;
      this.showResults = false;
    },

    saveSetting() {
      if (this.selectedRole === '') {
        alert('Bitte wähle eine Rolle aus!');
        return;
      }

      if (this.canteen === '') {
        alert('Bitte wähle eine Mensa aus!');
        return;
      }
      const favCanteenId = this.filteredResults.find(canteen => canteen.name === this.canteen).id;

      localStorage.setItem('userRole', this.selectedRole);
      localStorage.setItem('hasVisited', true);
      localStorage.setItem('favoriteCanteenId', favCanteenId);
      navigateTo('canteens/' + favCanteenId)
    },
  },
  setup() {
    definePageMeta({
      layout: 'welcome'
    })
  }
}

</script>

<style scoped>
.btn {
  background-color: #ff922b;
  color: #333;
}

.btn:hover {
  background-color: #ffc078;
  color: #333;
}

.btn {
  transition: all .7s;
}
</style>

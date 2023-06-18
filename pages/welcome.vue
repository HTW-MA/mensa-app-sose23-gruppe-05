<template>
  <div class="container mt-5">
    <h1 class="text-center text-primary" style="font-family: 'Comme'; color: #555;">Willkommen zu MensaMania!</h1>
    <div class="row justify-content-center mt-5">
      <div class="col-lg-6">
        <div class="mb-3">
          <label for="searchField" class="form-label" style="font-weight: bold; color: #555;">Lieblingsmensa:</label>
          <input className="canteenSearch" type="text" id="canteenSearch" class="form-control equal-width"
            v-model="canteen" placeholder="Suche deine Liebslingsmensa" style="background-color: #ffffff;"
            @input="searchCanteen">
        </div>
        <ul class="list-group">
          <li v-for="result in filteredResults" :key="result.id" class="list-group-item" @click="selectCanteen(result)">
            {{ result.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-4">
        <div class="mb-3">
          <label for="roleSelect" class="form-label" style="font-weight: bold; color: #555;">Rolle:</label>
          <select className="roleSelect" id="roleSelect" class="form-select equal-width" v-model="selectedRole"
            style="background-color: #ffffff;" placeholder="Wähle eine Rolle">
            <option value="" style="color: #555;">Wähle eine Rolle</option>
            <option value="student" style="color: #555;">Student</option>
            <option value="employee" style="color: #555;">Angestellter</option>
            <option value="guest" style="color: #555;">Gast</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-lg-4">
        <NuxtLink class="btn btn-primary" @click="saveSetting">Speichern</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script >

import { RestClient } from '~/services/RestClient';
import { defineComponent } from 'vue';

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
    RestClient.getAllCanteens().then(data => { this.allCanteens = data; })
  },
  methods: {
    searchCanteen() {

      if (this.canteen === '') {
        this.showResults = false;
        this.filteredResults = [];
        return;
      }

      const query = this.canteen.toLowerCase();
      this.filteredResults = this.allCanteens.filter(canteen => canteen.name.toLowerCase().includes(query));


      this.showResults = this.filteredResults.length > 0;
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

      localStorage.setItem('role', this.selectedRole);
      localStorage.setItem('canteen', this.canteen);
      localStorage.setItem('hasVisited', true);
      const router = useRouter();
      router.push('/');
    }

  },
  setup() {
    definePageMeta({
      layout: 'welcome'
    })
  }
}

</script>

<style scoped>
/* .container {
  text-align: center;
}

.equal-width {
  width: 10%;
}

.btn-primary:hover {
  background-color: #ffc078;
  border-color: #ffc078;
}

.btn-primary:focus,
.btn-primary:active {
  background-color: #d9480f;
  border-color: #d9480f;
}

select.form-select {
  color: #555;
} */
</style>

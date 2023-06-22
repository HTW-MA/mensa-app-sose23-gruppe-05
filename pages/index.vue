<template>
  <div class="container overflow-hidden text-center">
    <div class="row gy-5">
      <div class="col-6">
        <div class="">
          <h3 class="text-start">{{ favoriteCanteen }}</h3>
          <p class="text-md-start" style="font-size: small;">
            {{ canteenStreet }} <br>
            {{ canteenZipcode }} {{ canteenCity }} <br>
            <strong>Öffnungszeiten: </strong>{{ canteenOpeningTime }} <br>
            <strong>Mittagstisch:</strong> {{ canteenLunchOpeningTime }}
          </p>
        </div>
      </div>
      <div class="col-6">
        <div class="p-3"><h1><i class="bi bi-star-fill" style="color: #ff922b;"></i></h1></div>
      </div>
      <div class="col-6">
        <div class="p-3">TAGE</div>
      </div>
      <div class="col-6">
        <div class="p-3">KALENDER</div>
      </div>
      <div class="container text-center">
        <div class="row">
          <div class="col">
            1 of 3
          </div>
          <div class="col-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id odio consequuntur sed odit minus, et est beatae esse explicabo tenetur vero fugit veniam ducimus voluptate consectetur molestiae? Sed, mollitia placeat?
          </div>
          <div class="col">
            3 of 3
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RestClient } from "~/services/RestClient";
import "bootstrap-icons/font/bootstrap-icons.css";
export default {
  name: 'IndexPage',
  data() {
    return {
      canteen: '',
      allCanteens: '',
      canteenMenu: '',
      favoriteCanteen: '',
      canteenStreet: '',
      canteenZipcode: '',
      canteenCity: '',
      canteenOpeningTime: '',
      canteenLunchOpeningTime: '',
      today: '',
    }
  },
  mounted() {

    RestClient.getCanteenById(localStorage.getItem('favoriteCanteenId')).then(data => {
      this.canteen = data[0];
      this.favoriteCanteen = localStorage.getItem('favoriteCanteen');
      console.log("Lieblingsmensa: " + this.favoriteCanteen);
      this.canteenStreet = data[0].address.street;
      console.log("Straße und Hausnummer: " + this.canteenStreet);
      this.canteenZipcode = data[0].address.zipcode;
      this.canteenCity = data[0].address.city;
      console.log("PLZ und Stadt: " + this.canteenZipcode + " " + this.canteenCity);
      //this.canteenOpenAt = data[0].businessDays[0].businesshours[0].businessHourType;
      //console.log("Öffnungszeiten: "+ this.canteenOpenAt + " ");
      this.canteenOpeningTime = data[0].businessDays[this.currentDate() - 1].businessHours[0].openAt + " - " + data[0].businessDays[this.currentDate() - 1].businessHours[0].closeAt;
      console.log("Öffnungszeiten: " + data[0].businessDays[this.currentDate() - 1].businessHours[0].openAt + " - " + data[0].businessDays[this.currentDate() - 1].businessHours[0].closeAt);
      this.canteenLunchOpeningTime = data[0].businessDays[this.currentDate() - 1].businessHours[1].openAt + " - " + data[0].businessDays[this.currentDate() - 1].businessHours[1].closeAt;
      console.log("Mittagstisch: " + data[0].businessDays[this.currentDate() - 1].businessHours[1].openAt + " - " + data[0].businessDays[this.currentDate() - 1].businessHours[1].closeAt);

    })
    RestClient.getAllCanteens().then(data => { this.allCanteens = data; })
    RestClient.getMenueForCanteenInPeriod('6375f3112e6cbe73bac78a7d', '2023-06-15', '2023-06-20').then(data => { this.canteenMenu = data[0]; })

  },
  methods: {
    currentDate() {
      const currentDate = new Date();
      this.today = currentDate;
      console.log("Heutiges Datum: " + this.today);
      const currentDay = currentDate.getDay();
      console.log("Heutiger Wochentag: " + currentDay);
      return currentDay;
    }
  }
}
</script>

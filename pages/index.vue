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
            <!-- //left -->
          </div>
          <div class="col-6 border" style="background-color: #ff922b;color: #555;font-family: Comme; padding: 0.2cm;">
            <h2><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1em" viewBox="0 0 24 24">
    <path fill="currentColor" 
    d="M6 21q-.825 0-1.413-.588T4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21H6Zm0-2h12v-9l-6-4.5L6 10v9Zm4-5v3.5q0 .2.15.35t.35.15q.2 0 .35-.15t.15-.35V14q.625 0 1.063-.438T12.5 12.5V10q0-.2-.15-.35T12 9.5q-.2 0-.35.15t-.15.35v2.5H11V10q0-.2-.15-.35t-.35-.15q-.2 0-.35.15T10 10v2.5h-.5V10q0-.2-.15-.35T9 9.5q-.2 0-.35.15T8.5 10v2.5q0 .625.438 1.063T10 14Zm4.5 4q.2 0 .35-.15t.15-.35v-7.4q0-.2-.15-.35t-.35-.15q-.7 0-1.1.575T13 11.5V14q0 .2.15.35t.35.15h.5v3q0 .2.15.35t.35.15ZM6 19h12H6Z"></path></svg>Hauptgerichte</h2>

            

 
          
          </div>
          <div class="col">
            <!-- 3 of 3 -->
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
      date: ''
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
      const currentDate = new Date("YYYY-MM-DD");
      this.today = currentDate;
      console.log("Heutiges Datum: " + this.today);
      const currentDay = currentDate.getDay();
      console.log("Heutiger Wochentag: " + currentDay);
      return currentDay;
    }
  }
}
</script>

<template>
  <h1>Index.vue is right now the landing page (/)</h1>
  <span>
              {{canteen.name}}
          </span>
</template>

<script>
import {RestClient} from "~/services/RestClient";

export default {
  name: 'IndexPage',
  data() {
    return {
      canteen: '',
      allCanteens: '',
      canteenMenu: ''
    }
  },
  mounted() {
    RestClient.getCanteenById('6375f3112e6cbe73bac78a7d').then(data => { this.canteen = data[0];})
    RestClient.getAllCanteens().then(data => { this.allCanteens = data;})
    RestClient.getMenueForCanteenInPeriod('6375f3112e6cbe73bac78a7d', '2023-06-15', '2023-06-20').then(data => { this.canteenMenu = data[0];})
  }
}
</script>

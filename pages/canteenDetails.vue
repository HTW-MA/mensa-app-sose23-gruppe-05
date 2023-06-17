<template>
  <div class="container">
    <div class="canteen-header">
      <h1>My Canteen</h1>
    </div>
    <div class="canteen-details">
      <h2>Description</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac magna vel nisi interdum feugiat. Donec varius, mi in commodo egestas.</p>
      <h2>Location</h2>
      <p>123 Canteen Street, Food City</p>
      <h2>Opening hours</h2>
      <p>Monday to Friday: 9am - 7pm</p>
      <h2>Contact us</h2>
      <p>Phone: 123-456-7890</p>
      <p>Email: canteen@example.com</p>
    </div>
    <div class="canteen-menu">
      <h2>Menu</h2>
      <div class="menu-item" v-for="item in menuItems" :key="item.id">
        <h3>{{ item.name }}</h3>
        <p>Price: ${{ item.price }}</p>
        <p>Allergens: {{ item.allergens }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RestClient } from '~/services/RestClient'

export default {
  data() {
    return {
      canteen: '',
      menuItems: [{ id: 1, name: 'Menu Item 1', price: 9.99, allergens: 'Contains gluten, nuts' },
      { id: 2, name: 'Menu Item 2', price: 12.99, allergens: 'Contains dairy, eggs' }],
    // Add more menu items here...
    }
  },
    mounted() {
     RestClient.getCanteenById('6375f3112e6cbe73bac78a7d').then(data => { this.canteen = data[0];})
    }
}
</script>


<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
}

.canteen-header {
  background-color: #FFA500;
  padding: 10px;
  color: white;
  margin-top: 10px;
}

.canteen-header h1 {
  margin: 0;
  padding: 10px 0;
}

.canteen-details {
  margin-top: 20px;
}

.canteen-details h2,
.canteen-menu h2 {
  color: #FFA500;
  margin-top: 20px;
}

.canteen-details p,
.canteen-menu p {
  color: #333;
  line-height: 1.5;
}

.canteen-menu {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.menu-item {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
}

</style>

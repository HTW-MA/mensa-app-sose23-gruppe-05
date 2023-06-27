<template>
 <div>
   <h2>
     Einstellungen
   </h2>
 </div>
  <div class="mb-3">
    <label for="roleSelect" class="form-label">Rolle:</label>
    <select v-model="userRole" @change="setUserRole()" class="form-select roleSelect" id="roleSelect" placeholder="Wähle eine Rolle">
      <option value="" disabled>Wähle eine Rolle...</option>
      <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
    </select>
  </div>
</template>

<script lang="ts">

import {RestClient} from "~/services/RestClient";

export default {
  data() {
    return {
      userRole: '',
      roles: [
        { value: 'student', label: 'Student' },
        { value: 'employee', label: 'Angestellter' },
        { value: 'guest', label: 'Gast' },
      ],
      canteens: [],
    }
  },
  mounted() {
    this.canteens = RestClient.getAllCanteens()
    this.getUserRole()
  },
  methods: {
    setUserRole(){
      localStorage.setItem('userRole', this.userRole)
    },
    getUserRole(){
      this.userRole = localStorage.getItem('userRole')
    }
  },
}
</script>

<style scoped>

</style>

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
  <div class="mb-3">
    <label for="pushNotifications" class="form-label">Push-Benachrichtigungen:</label>
    <input type="checkbox" v-model="notificationsEnabled" @change="toggleNotifications()" class="form-check-input" id="pushNotifications">
    <span> (Please remove Push Notification Permissions in order to disable Push Notifications)</span>
  </div>
</template>

<script lang="ts">

import {RestClient} from "~/services/RestClient";
import firebase from "@/plugins/firebase.js";
import { onMessage } from "firebase/messaging";
import {getMessaging, getToken} from "firebase/messaging";

export default {
  data() {
    return {
      notificationsEnabled: false,
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
    this.getNotificationStatus()
  },
  methods: {
    setUserRole(){
      localStorage.setItem('userRole', this.userRole)
    },
    getUserRole(){
      this.userRole = localStorage.getItem('userRole')
    },

      toggleNotifications() {
        if (this.notificationsEnabled) {
          this.askPermission();
        } else {
          this.unsubscribeNotifications();
        }
      },
      askPermission() {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.subscribeNotifications();
          } else {
            this.notificationsEnabled = false;
          }
        });
      },
      async subscribeNotifications() {
        try {
          const messaging = getMessaging();
          const token = await getToken(messaging);

          await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              Authorization: "Bearer AAAAe-ZXsGE:APA91bFuYaN-XdA-w6SPLhSq7GjbetbBsORcqcw46_D6eMXuw5dXdeb86SS7fPTeFak6nj9EgVvMg5Ir2Jf-29NuTlhOfx1yVg8pv16PnZKnZ6wIhRZ7uzM2_zXtQVIM1hhG-4rdDlKP",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: token,
              data: {
                title: "MensaMania",
                body: "Notifications enabled!",
              },
            }),
          });
        } catch (error) {
          console.error("Error sending periodic notification:", error);
        }
      },
      unsubscribeNotifications() {
        // Add logic to unsubscribe user from your push service
      },
      getNotificationStatus() {
        this.notificationsEnabled = Notification.permission === 'granted';
      }
    },
  }
</script>

<style scoped>

</style>

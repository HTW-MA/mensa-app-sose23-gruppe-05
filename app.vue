<template>
  <head>
    <meta name="theme-color" content="#ff992b">
  </head>
  <div>
    <VitePwaManifest />
    <NuxtLayout />
  </div>
</template>


<script>
import firebase from "@/plugins/firebase.js";
import { onMessage } from "firebase/messaging";
import { getMessaging, getToken } from "firebase/messaging";

export default {
  created() {
    // Request permission and get token
    Notification.requestPermission()
        .then(async function (permission) {
          if (permission === "granted") {
            console.log("Notification permission granted.");

            // Get FCM token
            try {
              const messaging = getMessaging();
              const token = await getToken(messaging);
              console.log(token); // Display user token
            } catch (err) {
              console.error("Unable to get token", err);
            }
          } else {
            console.log("Unable to get permission to notify.");
          }
        })
        .catch(function (err) {
          console.error("Unable to get permission to notify.", err);
        });

    // Handle incoming messages
    onMessage(firebase.messaging, (payload) => {
      console.log("Message received: ", payload);
    });

    // Set up periodic interval for sending push notifications
    this.startPeriodicNotification();
  },
  methods: {
  async startPeriodicNotification() {
   //   setInterval(async () => {
        try {
          const messaging = getMessaging();
          const token = await getToken(messaging);

          // Make the POST request to send the push notification
          // Replace the URL and payload with your specific data
          await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              Authorization: "Bearer AAAAe-ZXsGE:APA91bFuYaN-XdA-w6SPLhSq7GjbetbBsORcqcw46_D6eMXuw5dXdeb86SS7fPTeFak6nj9EgVvMg5Ir2Jf-29NuTlhOfx1yVg8pv16PnZKnZ6wIhRZ7uzM2_zXtQVIM1hhG-4rdDlKP",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: token,
              data: {
                title: "Welcome",
                body: "Welcome to MensaMania!",
              },
            }),
          });

          console.log("Periodic notification sent.");
        } catch (error) {
          console.error("Error sending periodic notification:", error);
        }
     // }, 5 * 1000); // Send notification every 1 minute (adjust as needed)
    },
  },
};
</script>





<style>
:root {
  touch-action: manipulation;
}
</style>

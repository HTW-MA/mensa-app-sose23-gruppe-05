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
    startPeriodicNotification() {
      setInterval(async () => {
        try {
          const messaging = getMessaging();
          const token = await getToken(messaging);

          // Make the POST request to send the push notification
          // Replace the URL and payload with your specific data
          await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              Authorization: "Bearer AAAAAtmCQqU:APA91bFdyf0UgUl4LA6solqDtkbEA5-4nsejH0ZkNRPeah04_WEOceV0hUW6U66V_A31hGwwEYsfURJejF7m742SbZ0RxhYO4fNm8qw7YPOsjx8Qi2qkLB2UHuIxqR7DefFohP6NaFOg",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: token,
              notification: {
                title: "Periodic Notification",
                body: "This is a periodic notification.",
              },
            }),
          });

          console.log("Periodic notification sent.");
        } catch (error) {
          console.error("Error sending periodic notification:", error);
        }
      }, 5 * 1000); // Send notification every 1 minute (adjust as needed)
    },
  },
};
</script>





<style>
:root {
  touch-action: manipulation;
}
</style>

<template>
  <div></div>
</template>

<script>
import { getMessaging } from "firebase/messaging";

export default {
  mounted() {
    const messaging = getMessaging();

    messaging.onMessage(function(payload) {
      console.log('Message received: ', payload);

      const { title, body } = payload.notification;

      // Display notification using the Notification API
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
};
</script>

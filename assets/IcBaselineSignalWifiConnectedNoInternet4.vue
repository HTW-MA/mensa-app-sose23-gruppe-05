<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
    <path :fill="color" d="M24 8.98A16.88 16.88 0 0 0 12 4C7.31 4 3.07 5.9 0 8.98L12 21v-9h8.99L24 8.98zM19.59 14l-2.09 2.09L15.41 14L14 15.41l2.09 2.09L14 19.59L15.41 21l2.09-2.08L19.59 21L21 19.59l-2.08-2.09L21 15.41L19.59 14z"></path>
  </svg>
</template>

<script>
export default {
  name: 'IcBaselineSignalWifiConnectedNoInternet4',
  props: {
    size: {
      type: String,
      default: "30px"
    },
    color: {
      type: String,
      default: "#d9480f"
    }
  }
}
</script>

<template>
  <div class="container">
    <header>
      <div>
        <nav class="navbar navbar-light" style="background-color: white; font-family: Comme;">
          <div class="container-fluid" id="logo1">
            <a class="navbar-brand">
              <img src="../assets/logo.png" alt="logo" style="height: 50px; width: auto; margin: 10px;" class="" @click="navigateToFavorites">
            </a>
            <NuxtLink class="link" to="/settings" style="width: auto; margin: 10px; float: right;">
              <Icon class="icon" name="ic:round-settings" color="black" size="30px" />
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <div class="wrapper">
        <nav>
          <NuxtLink class="link" @click="navigateToFavorites()">
            <Icon class="icon" name="ic:baseline-favorite" color="black" size="50px"/>
          </NuxtLink>
          <NuxtLink class="link" to="/canteenList">
            <Icon class="icon" name="ic:baseline-format-list-bulleted" color="black" size="50px"/>
          </NuxtLink>
          <NuxtLink class="link" to="/location">
            <Icon class="icon" name="ic:baseline-location-on" color="black" size="50px" />
          </NuxtLink>

        </nav>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  methods: {
    navigateToFavorites() {
      const favorites = localStorage.getItem('favoriteCanteenId');
          this.$router.push(`/canteens/${favorites}`);

    },
  },
};
</script>


<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  flex-grow: 1;
  overflow-y: auto;
}

main::-webkit-scrollbar {
  display: none;
}

.container::-webkit-scrollbar {
  display: none;
}

nav {
  display: flex;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  background-color: white;
  align-items: center;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 15px;
}

:root {
  touch-action: manipulation;
}

.link {
  transition: 0.4s;
  padding: 5px;
}

.link:hover,
.link:active,
.link:focus {
  border-radius: 5px;
  padding: 5px;
}

.icon path {
  transition: 0.4s;
}

.link:hover .icon path,
.link:active .icon path,
.link:focus .icon path {
  fill: #d9480f;
  width: 100px;
}


header {
  top: 0;
  width: 100%;
  margin-bottom: 10px;
}

main {
  margin-bottom: 10px;
}


footer {
  margin-top: 10px;
  width: 100%;
}

</style>

<template>
  <div class="container">
    <header>
      <div>
        <nav class="navbar navbar-light" style="background-color: white;font-family: Comme;">
          <div class="container-fluid" id="logo1">
            <a class="navbar-brand">
              <img src="../assets/logo.png" alt="logo" style="height: 50px;width: auto;margin: 10px;" class="">
            </a>
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
          <div class="nav-connected">
            <NuxtLink class="link" to="/canteenDetails">Details</NuxtLink>
            <NuxtLink class="link" to="/canteenList">List</NuxtLink>
          </div>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script>


export default {
  name: 'DefaultLayout',
}
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

nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  background-color: #ff992b;
  align-items: center;
  justify-content: center;
}

.nav-connected {
  display: flex;
  align-items: center;
  justify-content: center;
}

.link {
  text-decoration: none;
  font-size: 24px;
  color: #333333;
  transition: 0.4s;
  padding: 5px;
  box-sizing: border-box;
}

.logo {
  margin-right: 5px;
}

.link:hover,
.link:active,
.link:focus {
  color: #ff992b;
  background-color: #333333;
  border-radius: 5px;
  padding: 5px;
}

.logo {
  max-width: 75px;
}

.welcome-text {
  font-size: 26px;
  font-family: Pacifico;
  font-weight: 300;
  text-align: center;
}

.welcome-text:hover {
  cursor: default;
}

header {
  background-color: #ff992b;
  top: 0;
  width: 100%;
  margin-bottom: 10px;
}

footer {
  margin-top: 10px;
  background-color: #ff992b;
  width: 100%;
}

.wrapper {
  display: flex;
  justify-content: center;
  padding: 10px;
}

footer nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  align-items: center;
}
</style>

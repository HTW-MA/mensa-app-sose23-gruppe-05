<template>
  <div>
    <header>
      <div className="wrapper">
        <nav>
          <div className="nav-connected">
            <NuxtLink to="/"><img className="logo" src="../assets/logo-removebg.png" alt="logo"></NuxtLink>
            <NuxtLink class="link" to="/"><p className="welcome-text">MensaMania</p></NuxtLink>
            <font-awesome-icon :icon="['fasl', 'gear']" size="2xs"/>
          </div>
        </nav>
      </div>
    </header>
      <body>
      <div>
          <span>
              {{canteen.name}}
          </span>
      </div>
      </body>
    <footer>
      <div className="wrapper">
        <nav>
          <div className="nav-connected">
            <NuxtLink class="link" to="/x1">Nav1</NuxtLink>
            <NuxtLink class="link" to="/">Home</NuxtLink>
            <NuxtLink class="link" to="/x1">Nav2</NuxtLink>
          </div>
        </nav>
      </div>
    </footer>
    <Nuxt/>
  </div>
</template>

<script>
import {RestClient} from "~/static/RestClient";

export default {
  name: 'DefaultLayout',
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

<style>
nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  background-color: #FFA500;
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

.link:hover, .link:active, .link:focus {
  color: #FFA500;
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

footer {
  background-color: #FFA500;
  position: fixed;
  bottom: 0;
  width: 100%;
}

footer .wrapper {
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

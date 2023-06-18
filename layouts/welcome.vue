<template>
    <div>
        <header>
      <div>
        <nav>
          <div class="nav-connected">
            <NuxtLink to="/"><img class="logo" src="../assets/logo-removebg.png" alt="logo"></NuxtLink>
            <NuxtLink class="link" to="/"><p class="welcome-text">MensaMania</p></NuxtLink>
          </div>
        </nav>
      </div>
    </header>
    </div>

    <!-- Outcome of content -->
    <main>
        <NuxtPage />
    </main>
        
    

    <footer class="footer">
        &copy; 2023 by MensaMania
    </footer>
</template>
<style scoped>
.footer {
    color: #fff;
}

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

header {
  background-color: #FFA500;
  top: 0;
  width: 100%;
  margin-bottom: 10px;
}

footer {
  margin-top: 10px;
  background-color: #FFA500;
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

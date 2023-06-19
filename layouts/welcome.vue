<template>
  <div>
    <header>
      <div class="" style="border-image-slice: ;">
        <nav class="navbar navbar-light" style="background-color: white;font-family: Comme;">
          <div class="container-fluid" id="logo1" >
            <a class="navbar-brand">
              <img src="../assets/logo.png" alt="logo" style="height: 50px;width: auto;margin: 10px;" class="">
            </a>
          </div>
        </nav>
      </div>
    </header>
  </div>

  <!-- Outcome of content -->
  <main>
    <NuxtPage />
  </main>



  <footer class="footer fixed-bottom">
    &copy; 2023 by MensaMania
  </footer>
</template>
<style scoped>
.footer {
  background-color: #ff922b;
  color: #ffffff;
  text-align: left;
  font-size: 14px;
  padding: 10px;
  font-family: Comme;
}

</style>

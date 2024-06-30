<template>
  <header class="shadow">
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container-fluid">
        <router-link class="navbar-brand d-flex align-items-center" exact-active-class="" to="/" style="text-decoration: none; color: inherit;">
          <img src="@/assets/logo.png" alt="Logo" class="me-2" style="height: 60px;" />
        </router-link>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/">
              <i class="fa-solid fa-house me-2"></i>Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/bills">
              <i class="fa-solid fa-file-invoice-dollar me-2"></i>Bills
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/clients">
              <i class="fa-solid fa-users me-2"></i>Clients
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" to="/about">
              <i class="fa-solid fa-info-circle me-2"></i>About
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink
  }
};
</script>

<style scoped>
</style>

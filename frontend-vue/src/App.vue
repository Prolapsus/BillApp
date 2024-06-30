<template>
  <div class="container py-4">

    <PageHeader />

    <div class="border p-4 rounded-bottom shadow bg-white">
      <RouterView />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import { RouterView } from 'vue-router'

export default {
  components: {
    PageHeader,
    // RouterLink,
    RouterView
  }
}
</script>

<style scoped></style>

<template>
  <div id="app">
    <Navbar />
    <div class="section">
      <div class="container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Navbar from '@/components/NavBar.vue';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  components: { Navbar },
});
</script>

<style lang="scss">
@import '~@mdi/font/css/materialdesignicons.min.css';
</style>

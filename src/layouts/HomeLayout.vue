<script setup>
  import { RouterView, RouterLink } from 'vue-router'
</script>
<template>
  <div class="h-full">
    <main class="py-5 h-full relative">
      <div class="absolute bg-zinc-500 text-white top-[-10px] left-24 z-20 px-10 py-6 uppercase font-black rounded-xl text-xl tracking-wider">
        Geoportal
      </div>
      <div class="px-4 sm:px-6 lg:px-8 h-full">
        <RouterView />
      </div>
    </main>
  </div>  
</template>
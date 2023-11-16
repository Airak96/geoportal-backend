<script setup>
  import { RouterView } from 'vue-router'
</script>
<template>
  <div class="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#0075C9]">
    <div class="w-full max-w-md space-y-14">
      <RouterView />
    </div>
  </div>
</template>
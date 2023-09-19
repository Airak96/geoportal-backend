<script setup>
  import { RouterView } from 'vue-router'
</script>
<template>
  <div class="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-10">
      <RouterView />
    </div>
  </div>
</template>
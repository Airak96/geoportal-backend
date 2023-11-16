<script setup>
  import { RouterView, RouterLink } from 'vue-router'
</script>
<template>
  <div class="h-full">
    <header class="bg-[#0075C9] px- py-3 absolute left-0 right-0 top-0 z-10">
      <nav class="mx-auto flex max-w-7xl items-center justify-between">
        <div class="flex lg:flex-1">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Proyecto Cuidar</span>
            <img class="h-20 w-auto" src="/src/assets/main_logo.svg" alt="">
          </RouterLink>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-4">
          <a href="https://proyecto-cuidar.com/" class="text-base font-semibold leading-6 text-white hover:text-[#41f2e6]">Página principal</a>
          <RouterLink to="/admin" class="text-base font-semibold leading-6 text-white flex items-center gap-1 hover:text-[#41f2e6] mr-7">
            Ingreso 
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </RouterLink>
          <a href="https://www.facebook.com/" class="text-base font-semibold leading-6 text-white hover:opacity-70">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0,0,256,256">
              <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M32,11h5c0.552,0 1,-0.448 1,-1v-6.737c0,-0.524 -0.403,-0.96 -0.925,-0.997c-1.591,-0.113 -4.699,-0.266 -6.934,-0.266c-6.141,0 -10.141,3.68 -10.141,10.368v6.632h-7c-0.552,0 -1,0.448 -1,1v7c0,0.552 0.448,1 1,1h7v19c0,0.552 0.448,1 1,1h7c0.552,0 1,-0.448 1,-1v-19h7.222c0.51,0 0.938,-0.383 0.994,-0.89l0.778,-7c0.066,-0.592 -0.398,-1.11 -0.994,-1.11h-8v-5c0,-1.657 1.343,-3 3,-3z"></path></g></g>
            </svg>
          </a>
          <a href="https://twitter.com/" class="text-base font-semibold leading-6 text-white hover:opacity-70">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0,0,256,256">
              <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M50.0625,10.4375c-1.84766,0.82031 -3.82812,1.37109 -5.91016,1.62109c2.125,-1.27344 3.75781,-3.28906 4.52344,-5.6875c-1.98437,1.17578 -4.19141,2.03125 -6.53125,2.49219c-1.875,-2 -4.54687,-3.24609 -7.50391,-3.24609c-5.67969,0 -10.28516,4.60156 -10.28516,10.28125c0,0.80469 0.09375,1.58984 0.26953,2.34375c-8.54687,-0.42969 -16.12109,-4.52344 -21.19531,-10.74609c-0.88672,1.52344 -1.39062,3.28906 -1.39062,5.17187c0,3.56641 1.8125,6.71484 4.57422,8.5625c-1.6875,-0.05469 -3.27344,-0.51953 -4.66016,-1.28906c0,0.04297 0,0.08594 0,0.12891c0,4.98438 3.54688,9.13672 8.24609,10.08594c-0.85937,0.23438 -1.76953,0.35938 -2.70703,0.35938c-0.66406,0 -1.30859,-0.0625 -1.9375,-0.1875c1.3125,4.08203 5.10938,7.0625 9.60547,7.14453c-3.51562,2.75781 -7.94922,4.39844 -12.76953,4.39844c-0.83203,0 -1.64844,-0.04687 -2.44922,-0.14453c4.54687,2.92188 9.95312,4.62109 15.76172,4.62109c18.91406,0 29.25781,-15.66797 29.25781,-29.25391c0,-0.44531 -0.01172,-0.89453 -0.02734,-1.33203c2.00781,-1.44922 3.75,-3.26172 5.12891,-5.32422z"></path></g></g>
            </svg>
          </a>
        </div>
      </nav>
    </header>

    <main class="h-full pt-[104px] min-h-[650px]">
      <div class="h-full">
        <RouterView />
      </div>
    </main>
  </div>  
</template>
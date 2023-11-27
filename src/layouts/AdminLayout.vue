<script setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia'
  import { RouterView, RouterLink } from 'vue-router'
  import { useAuthStore } from '../stores/auth.store'

  const showDropdown = ref(false),
        openMenu = ref(false),
        hidden   = ref(true);

  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
    
  const openDropdown = () => {
    hidden.value = false;
    setTimeout(() => {
      showDropdown.value = true;
    }, 1);
  };

  const closeDropdown = () => {
    showDropdown.value = false;
    setTimeout(() => {
      hidden.value = true;
    }, 200);
  };

  const logout = () => {
    authStore.logout();
  }
</script>
<template>
  <div class="font-sans">
    <nav class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="-ml-2 mr-2 flex items-center md:hidden">
              <!-- Mobile menu button -->
              <button type="button" @click="openMenu = !openMenu"
                class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <!--
                Icon when menu is closed.

                Menu open: "hidden", Menu closed: "block"
              -->
                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  aria-hidden="true" :class="{ 'hidden': openMenu, 'block': !openMenu }">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <!--
                Icon when menu is open.

                Menu open: "block", Menu closed: "hidden"
              -->
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  aria-hidden="true" :class="{ 'hidden': !openMenu, 'block': openMenu }">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex flex-shrink-0 items-center">
              <span class="font-bold text-slate-500 uppercase text-sm">Panel de Administración</span>
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <RouterLink to="/admin" class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Mapa</RouterLink>
              <RouterLink v-if="user?.data?.role?.name === 'admin'" to="/admin/users" class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Usuarios</RouterLink>
            </div>
          </div>
          <div class="flex items-center">
            <div class="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
              <div class="relative ml-3">
                <div>
                  <button type="button"
                    class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                    v-on="showDropdown ? { click: closeDropdown }:{ click: openDropdown }">
                    <span class="sr-only">Open user menu</span>
                    <!-- <img class="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""> -->
                    <svg class="h-8 w-8 rounded-full text-gray-300 border-gray-300 border" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>  
                  </button>
                </div>
                <div
                  class="transition ease-out duration-200 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  :class="{ 'transform opacity-100 scale-100': showDropdown, 'transition ease-in duration-75 transform opacity-0 scale-90 ': !showDropdown, 'hidden': hidden }"
                  role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                  <!-- <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                    tabindex="-1" id="user-menu-item-1">Ajustes</a> -->
                  <button type="button" @click="logout()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem"
                    tabindex="-1" id="user-menu-item-2">Salir</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="md:hidden" id="mobile-menu" :class="{ 'hidden': !openMenu }">
        <div class="space-y-1 pb-3 pt-2">
          <!-- Current: "bg-blue-50 border-blue-500 text-blue-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
          <!-- <a href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6">Capas</a> -->
          <!-- <a href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6">Categorías</a> -->
          <!-- <a href="#"
            class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6">Usuarios</a> -->
        </div>
        <div class="border-t border-gray-200 pb-3 pt-4">
          <div class="flex items-center px-4 sm:px-6">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="">
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">Tom Cook</div>
              <div class="text-sm font-medium text-gray-500">tom@example.com</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a href="#"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6">Ajustes</a>
            <a href="#"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6">Salir</a>
          </div>
        </div>
      </div>
    </nav>
    <main class="py-10">
      <div class="px-4 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>
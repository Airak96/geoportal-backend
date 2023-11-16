<script setup>
// vue imports
import { ref } from "vue";

// logic
const emit = defineEmits(['confirmed']);

const loading = ref(false);
const ids = ref(null);
const showModal = ref(false);
const hidden = ref(true);
const type = ref(true);

const openModal = (n, t) => {
  ids.value = n;
  type.value = t;
  hidden.value = false;
  setTimeout(() => {
    showModal.value = true;
  }, 100);
};

const closeModal = () => {
  ids.value = null;
  loading.value = false;

  showModal.value = false;
  setTimeout(() => {
    hidden.value = true;
  }, 250);
};

const executeDelete = () => {
  loading.value = true;
  emit('confirmed', ids.value, type.value);
}

defineExpose({
  openModal,
  closeModal,
});
</script>

<template>
  <div class="relative z-10"
    :class="{ hidden: hidden }"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      :class="{
        'ease-out duration-300 opacity-100': showModal,
        'ease-in duration-200 opacity-0': !showModal,
      }"
    ></div>
    
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          :class="{
            'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100':
              showModal,
            'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95':
              !showModal,
          }"
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button :disabled="loading"
              @click="closeModal()"
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Eliminar registro</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">¿Estás seguro de que deseas eliminar el registro? Todos los datos serán eliminados permanentemente de nuestros servidores para siempre. Esta acción no se puede deshacer.</p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button @click="executeDelete()" type="button" :disabled="loading" class="items-center inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
              <svg v-show="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Eliminar
            </button>
            <button @click="closeModal()" :disabled="loading" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
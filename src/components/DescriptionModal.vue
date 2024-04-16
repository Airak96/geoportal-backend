<script setup>
// vue imports
import { ref } from "vue";
import DOMPurify from 'dompurify';

// logic
const showModal = ref(false);
const hidden = ref(true);
const data = ref(null);

const openModal = (info) => {
  data.value = info;
  if(hidden.value && !showModal.value) {
    hidden.value = false;
    setTimeout(() => {
      showModal.value = true;
    }, 100);
  }
};

const sanitizedHTML = () => {
  return DOMPurify.sanitize(data.value);
}
const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    hidden.value = true;
  }, 250);
};

// vue functions
defineExpose({
  openModal,
});
</script>
<template>
  <div
    class="relative z-50"
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

    <div class="fixed inset-0 z-50 overflow-y-auto">
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
            <button
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
          <div>
            <template v-if="data">
              <div class="px-4 sm:px-0" v-html="sanitizedHTML()"></div>
            </template>
            <template v-else>
              <p class="text-center text-gray-600 italic">(No hay información relacionada)</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

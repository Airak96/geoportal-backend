<script setup>
import { notify } from "@kyvg/vue3-notification";

// vue imports
import { ref } from "vue";
import { useGeoserverStore } from '../stores/geoserver.store';

// logic
const showModal = ref(false); // false: modal oculto | true: modal abierto
const hidden = ref(true);     // false: overlay oculto | true: overlay abierto
const layer = ref(null);

const executed = ref(false);
const completed = ref(false);

const message = ref('');
const error = ref(false);

const geoserverStore  = useGeoserverStore();

const openModal = (item) => {
  layer.value = item;

  hidden.value = false;
  setTimeout(() => {
    showModal.value = true;
  }, 100);
}

const closeModal = (reset) => {
  showModal.value = false;
  setTimeout(() => {
    hidden.value = true;
    layer.value = null;
  }, 250);
};

const publishLayer = () => {
  executed.value = true;

  if(layer.value.type === 'raster') {
    message.value = 'Generando almacén de datos...'
    geoserverStore.createCoverageStore(layer.value.external_id)
      .then(res => {
        message.value = 'Publicando capa...'
        geoserverStore.createRasterLayer(layer.value.external_id)
          .then(res => {
            executed.value = false;
            completed.value = true;
            layer.value.published = true;
            message.value = '¡Completado!';
          }).catch(err => {
            console.log('Layer Error: ', err);
            message.value = 'Error al publicar la capa...'
            error.value = true;
            executed.value = false;

            notify({
              text: err?.response?.data?.message || 'Error al procesar la solicitud.',
              type: '!text-base !bg-red-500 !border-red-800',
            });
          });
      }).catch(err => {
        console.log('CoverageStore Error: ', err);
        message.value = 'Error al generar almacén de datos...'
        error.value = true;
        executed.value = false;

        notify({
          text: err?.response?.data?.message || 'Error al procesar la solicitud.',
          type: '!text-base !bg-red-500 !border-red-800',
        });
      });
  } else {
    message.value = 'Generando almacén de datos...'
    geoserverStore.createDataStore(layer.value.external_id)
      .then(res => {
        message.value = 'Publicando capa...'
        geoserverStore.createShapeLayer(layer.value.external_id)
          .then(res => {
            layer.value.published = true;
            message.value = 'Añadiendo estilos...';
            
            geoserverStore.createStyles(layer.value.external_id)
              .then(res => {
                executed.value = false;
                completed.value = true;
                message.value = '¡Completado!'             
              }).catch(err => {
                console.log('Styles Error: ', err);
                message.value = 'Error añadir los estilos...'
                error.value = true;
                executed.value = false;

                notify({
                  text: err?.response?.data?.message || 'Error al procesar la solicitud.',
                  type: '!text-base !bg-red-500 !border-red-800',
                });
              });
          }).catch(err => {
            console.log('Layer Error: ', err);
            message.value = 'Error al publicar la capa...'
            error.value = true;
            executed.value = false;

            notify({
              text: err?.response?.data?.message || 'Error al procesar la solicitud.',
              type: '!text-base !bg-red-500 !border-red-800',
            });
          });
      }).catch(err => {
        console.log('DataStore Error: ', err);
        message.value = 'Error al generar almacén de datos...'
        error.value = true;
        executed.value = false;

        notify({
          text: err?.response?.data?.message || 'Error al procesar la solicitud.',
          type: '!text-base !bg-red-500 !border-red-800',
        });
      });
  }
}

// vue functions
defineExpose({
  openModal,
});
</script>

<template>
  <div
    class="relative z-10"
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
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Publicar capa</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Al confirmar esta acción, los archivos de la capa serán enviados al servidor y será visible en el mapa. <br><br>¿Está seguro/a de publicar la capa? </p>
              </div>
              
              <div v-show="message !== ''" class="flex gap-x-1 items-center mt-2 bg-blue-700 text-white py-2 px-3 rounded">
                <svg v-show="!error && !completed" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-show="error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                </svg>
                <svg v-show="completed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                </svg>
                {{ message }}
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button @click="publishLayer()" type="button" v-show="!completed" :disabled="executed" class="flex items-center justify-center w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
              <svg v-show="executed" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ executed ? 'Publicando...':'Publicar' }}
            </button>
            <button @click="closeModal(handleReset)" type="button" :disabled="executed" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
              {{ completed ? 'Cerrar':'Cancelar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
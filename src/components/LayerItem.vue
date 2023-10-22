<script setup>
// vue imports
import { ref } from 'vue';
import { formatDate } from '../helpers/utils'

// vue functions
const emit = defineEmits([
  'delete',
  'edit', 
  'add',
  'publish',
]);

const show = ref(false);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  lvl: {
    type: Number
  }
});

function getLvl(lvl) {
  if(lvl < 2) {
    return '';
  }

  var txt = ''
  for (let i = 1; i < lvl; i++) {
    txt += `<div class="lvl"></div>`
  }

  return txt+' ';
}

function addItem(parent) {
  emit('add', parent);
}

function deleteItem(external) {
  var obj = { external_id: external, layers: null }
  emit('delete', obj);
}

function editItem(item) {
  emit('edit', item);
}

function publish(item) {
  emit('publish', item);
}
</script>

<template>
  <tr    
    :key="item.id_layer"
    class="border-t-2 border-gray-200"
  >
    <td
      colspan="2"
      class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white relative"
    >
      <div class="flex items-center gap-x-2">
        <div v-html="getLvl(lvl)" class="flex items-center gap-x-3 ml-2"></div>
        <div class="flex-1">
          <svg v-show="item.type !== 'raster'" class="w-4 h-4 inline mr-1 -mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
          </svg>
          <svg v-show="item.type === 'raster'" class="w-4 h-4 inline mr-1 -mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
          </svg>
          {{ item.name }}
          <span class="block text-gray-500 text-xs ml-6"><b>ID:</b> {{ item.external_id }}</span>
        </div>
      </div>
    </td>
    <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
      {{ formatDate(item.updated_at) }}
    </td>
    <td
      class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white"
    >
      <div class="flex gap-x-5">
        <div
          v-show="item.status"
          class="flex items-center gap-x-2 justify-start"
        >
          <div class="flex-none rounded-full p-1 text-green-400 bg-green-400/10">
            <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
          </div>
          <div class="block">Activo</div>
        </div>

        <div
          v-show="!item.status"
          class="flex items-center gap-x-2 justify-start"
        >
          <div class="flex-none rounded-full p-1 text-rose-400 bg-rose-400/10">
            <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
          </div>
          <div class="block">Inactivo</div>
        </div>

        <div
          v-show="item.published"
          class="flex items-center gap-x-2 justify-start"
        >
          <div class="flex-none rounded-full p-1 text-green-400 bg-green-400/10">
            <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
          </div>
          <div class="block">Publicado</div>
        </div>

        <div
          v-show="!item.published"
          class="flex items-center gap-x-2 justify-start"
        >
          <div class="flex-none rounded-full p-1 text-rose-400 bg-rose-400/10">
            <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
          </div>
          <div class="block">No publicado</div>
        </div>

      </div>
    </td>
    <td
      class="pl-4 pr-3 py-2 text-right text-sm font-semibold text-gray-900 sm:pl-3 bg-white"
    >
      <div class="flex space-x-1 justify-end">
        <button @click="editItem(item)" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          Editar
        </button>
        <button @click="deleteItem(item.external_id)" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Eliminar
        </button>
        <button @click="publish(item)" v-if="!item.published" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
          </svg>
          Publicar
        </button>
        <div class="w-5"></div>
      </div>
    </td>
  </tr>  
</template>
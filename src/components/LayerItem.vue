<script setup>
// vue imports
import { ref } from 'vue';
import { formatDate } from '../helpers/utils'

import FileItem from '../components/FileItem.vue'

// vue functions
const emit = defineEmits([
  'delete',
  'edit', 
  'add',
  'editFile',
  'deleteFile',
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

function toggleSub() {
  show.value = !show.value;
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

function editFile(item) {
  emit('editFile', item);
}

function deleteFile(n) {
  n.files = props.item?.files;
  emit('deleteFile', n);
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
          <svg class="w-4 h-4 inline mr-1 -mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
          </svg>
          {{ item.name }}
        </div>
      </div>
    </td>
    <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
      {{ formatDate(item.updated_at) }}
    </td>
    <td
      class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white"
    >
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
    </td>
    <td
      class="pl-4 pr-3 py-2 text-right text-sm font-semibold text-gray-900 sm:pl-3 bg-white"
    >
      <div class="flex space-x-1 justify-end">
        <button @click="addItem(item)" type="button" title="Añadir archivo" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>

        </button>
        <button @click="editItem(item)" type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button @click="deleteItem(item.external_id)" type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
        <button type="button" @click="toggleSub()">
          <svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
  <template v-if="show">
    <template v-if="item.files?.length">
      <FileItem
        v-if="item.files?.length" 
        v-for="file in item.files"
        :item="file"
        :lvl="lvl + 1" 
        @delete="deleteFile"
        @edit="editFile"
      />
    </template>
    <template v-else>
      <tr class="border-t-2 border-gray-200">
        <th colspan="5" class="p-5">
          <div class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
            <span class="block text-sm font-semibold italic text-gray-500">Añade un archivo para verlo aquí.</span>
          </div>
        </th>
      </tr>
    </template>
  </template>
  
</template>
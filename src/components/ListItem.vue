<script setup>
// vue imports
import { ref } from 'vue';

// store imports
import { useCategoriesStore } from '../stores/categories.store'

// component imports
import ListItem from '../components/ListItem.vue'
import LayerItem from '../components/LayerItem.vue'

// vue functions
const emit = defineEmits(
  [
    'delete',
    'edit', 
    'add', 
    'addLayer', 
    'editLayer', 
    'deleteLayer',
    'publish',
  ]
);

const loading = ref(false);
const show = ref(false);
const consulted = ref(false);

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

function toggleSub(toggle) {
  if(props.lvl >= 2 && !consulted.value) {
    loading.value = true;
    const categoriesStore = useCategoriesStore();
    
    categoriesStore.get(props.item?.external_id)
      .then(res => {
        if(res.data?.categories?.length) {
          props.item.categories = res.data.categories;
        }
        if(res.data?.layers?.length) {          
          props.item.layers = res.data.layers;
        }
        consulted.value = true;
        loading.value = false;
      }).catch(err => {
        console.log(err);
      });
  }
  
  if(toggle) {
    show.value = !show.value;
  } else {
    show.value = true;
  }
}

function addItem(item) {
  toggleSub(false);
  emit('add', item);
}

function deleteItem(n) {
  n?.push({ external_id: props.item?.external_id, categories: props.item?.categories });
  emit('delete', n);
}

function editItem(item) {
  emit('edit', item);
}

function addLayer(parent) {
  toggleSub(false);
  emit('addLayer', parent);
}

function editLayer(item) {
  emit('editLayer', item);
}

function deleteLayer(n) {
  if(n.layers === null) {
    n.layers = props.item?.layers;
  }
  emit('deleteLayer', n);
}

function publish(item) {
  emit('publish', item);
}
</script>
<template>
  <tr    
    :key="item.id_category"
    class="border-t-2 border-gray-200"
  >
    <th
      colspan="3"
      class="pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
      :class="{ 'py-2 bg-gray-100': lvl < 2, 'py-2 bg-gray-200': lvl >= 2 }"
    >
      <div class="flex items-center gap-x-2">
        <div v-html="getLvl(lvl)" class="flex items-center gap-x-3" :class="{ 'ml-2': lvl >=2 }"></div>
        <div class="flex-1">
          <svg class="w-4 h-4 inline mr-1 -mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
          </svg>
          {{ item.name }}          
        </div>
      </div>
    </th>
    <th
      class="pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
      :class="{ 'py-2 bg-gray-100': lvl < 2, 'py-1 bg-gray-200': lvl >= 2 }"
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
    </th>
    <th
      class="pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-3"
      :class="{ 'py-2 bg-gray-100': lvl < 2, 'py-1 bg-gray-200': lvl >= 2 }"
    >
      <div class="flex space-x-1 justify-end">
        <button @click="addItem(item)" type="button" title="Añadir categoría" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
          Categoría
        </button>
        <button @click="addLayer(item)" type="button" title="Añadir capa" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
          </svg>
          Capa
        </button>
        <button @click="editItem(item)" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          Editar
        </button>
        <button @click="deleteItem([])" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Eliminar
        </button>
        <button type="button" @click="toggleSub(true)">
          <svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </th>
  </tr>
  <template v-if="show">
    <template v-if="(item.categories?.length || item.layers?.length) && !loading">
      <LayerItem 
        v-if="item.layers?.length" 
        v-for="layer in item.layers"      
        :item="layer"
        :lvl="lvl + 1"
        @edit="editLayer"
        @delete="deleteLayer"
        @publish="publish"
      />
      
      <ListItem 
        v-if="item.categories?.length" 
        v-for="subcategory in item.categories" 
        :item="subcategory" 
        :lvl="lvl + 1" 
        @delete="deleteItem" 
        @edit="editItem" 
        @add="addItem"
        @addLayer="addLayer"
        @editLayer="editLayer"
        @deleteLayer="deleteLayer"
        @publish="publish"
      />
    </template>
    
    <template v-else-if="!loading">
      <tr v-if="show" class="border-t-2 border-gray-200">
        <th colspan="5" class="p-5">
          <div class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
            <span class="block text-sm font-semibold italic text-gray-500">Añade una capa o categoría para verla aquí.</span>
          </div>
        </th>
      </tr>
    </template>

    <template v-else>
      <tr v-if="loading">
        <th colspan="5" class="bg-white py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
          <svg class="animate-spin mx-auto h-8 w-8 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </th>
      </tr>
    </template>
  </template>  
</template>

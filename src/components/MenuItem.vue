<script setup>
  // vue imports
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia'

  import { useCategoriesStore } from '../stores/categories.store';
  import { useLayersStore } from '../stores/layers.store';
  import { useGeoserverStore } from '../stores/geoserver.store';
  import { useAuthStore } from '../stores/auth.store';
  import { notify } from "@kyvg/vue3-notification";
  import DescModal from './DescriptionModal.vue';

  import MenuItem from "./MenuItem.vue";
  
  import router from '../router/index';

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    lvl: {
      type: Number
    },
    legends: {
      type: Array,
      required: true,
    }
  });
  const loaded = ref(false);
  const show = ref(false);
  const categoriesStore = useCategoriesStore();
  const geoserverStore = useGeoserverStore();
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const descModalRef = ref(null);

  function loadData() {
    categoriesStore.get(props.item?.external_id)
      .then(res => {
        if(res.data?.categories?.length) {
          props.item.categories = res.data.categories;
        }
        if(res.data?.layers?.length) {          
          props.item.layers = res.data.layers;
        }
        loaded.value = true;
      }).catch(err => {
        console.log(err);
      });
  }

  function toggleLegend(layer, show) {
    if(show) {
      if(!layer.legends?.layerName) {
        geoserverStore.legends(layer.external_id)
          .then(res => {
            console.log(res.data)
            let geoLegend = res.data?.Legend;
            if(geoLegend && geoLegend?.length) {
              let obj = geoLegend[0];
              obj.localName = layer.name;
              obj.localType = layer.type;
              obj.show = true;
              obj.description = layer.description;
              layer.legends = obj;
              props.legends.push(obj);
            }
          }).catch(err => {
            console.log(err);
          });
      } else {
        props.legends.push(layer.legends);
      }
    } else {
      let index = props.legends.findIndex(x => x.layerName === layer.external_id)
      if(index > -1) {
        props.legends.splice(index, 1);
      }
    }
  }

  function download(path, name) {
    if(user?.value?.data?.role === 'visitor' || user?.value?.data?.role === 'admin' || user?.value?.data?.role === 'user') {
      notify({
        text: 'Descargando archivo...',
        type: '!text-base !bg-blue-600 !border-blue-900',
      });
      let layersStore = useLayersStore();
      layersStore.download(path)
        .then(res => {
          let file_name = name+"."+path.split(".")[1];
          file_name = file_name.replace(/ /g, '_');

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file_name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          console.log('Archivo descargado!');
          notify({
            text: 'Archivo descargado!',
            type: '!text-base !bg-green-600 !border-green-900',
          });
        })
        .catch(error => console.log(error));
    } else {
      notify({
        text: 'Inicia sesión para descargar el archivo',
        type: '!text-base !bg-red-500 !border-red-800',
      });
      authStore.logout();
    }
  }

  if(props.lvl > 1) {
    loadData();
  }

  const openInfoModal = (info) => {
    descModalRef.value?.openModal(info);
  }
</script>
<template>
  <fieldset class="pl-5 mt-2" v-if="item.status">
    <legend class="w-full">
      <button @click="show = !show" type="button" class="flex gap-x-3 -ml-5 w-full items-center justify-between px-2 pb-1 text-gray-400 hover:text-gray-500 border-b border-gray-200" aria-controls="filter-section-0" aria-expanded="false">
        <span v-if="!show">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
          </svg>
        </span>
        <span v-if="show">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
          </svg>
        </span>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600 flex-grow text-left leading-5">{{ item.name }}</p>
        </div>
        <!-- <span v-if="lvl > 1 && !loaded" class="flex items-end"><button @click="loadData()" type="button" class="text-sm">(Mostrar)</button></span> -->
      </button>
    </legend>
    <template v-if="show && item.layers?.length">
      <div class="pl-2 pr-4 py-2">
        <div class="space-y-1">
          <template v-for="option in item.layers">
            <template v-if="option.status && option.published">
              <div class="flex items-center w-full gap-x-2">
                <input id="color-0-mobile" :name="option.ref" v-model="option.show" @change="toggleLegend(option, option.show)" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <label for="color-0-mobile" class="text-sm text-gray-500 flex-1">{{ option.name }}</label>
                <button type="button" class="outline-none p-1 bg-slate-100 rounded-md text-gray-800" @click="openInfoModal(option.description)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </button>
                <span>
                  <a href="javascript:void(0)" class="outline-none block p-1 bg-slate-100 rounded-md text-gray-800" @click="download(option.filepath, option.name)">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                </span>
              </div>
            </template>
          </template>
        </div>
      </div>      
    </template>
    <MenuItem
      v-if="show && item.categories?.length && item.categories.length > 0"
      v-for="category in item.categories"
      :item="category"
      :lvl="lvl + 1"
      :legends="legends"
    />
  </fieldset>
  <DescModal ref="descModalRef" />
</template>
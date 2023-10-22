<script setup>
  // vue imports
  import { ref } from 'vue';

  import { useCategoriesStore } from '../stores/categories.store';
  import { useGeoserverStore } from '../stores/geoserver.store';
  import MenuItem from "./MenuItem.vue";

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
  const categoriesStore = useCategoriesStore();
  const geoserverStore = useGeoserverStore();

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
      if(layer.type === 'shapes') {
        geoserverStore.legends(layer.external_id)
          .then(res => {
            let geoLegend = res.data?.Legend;
            if(geoLegend && geoLegend?.length) {
              let obj = geoLegend[0];
              obj.localName = layer.name;
              props.legends.push(obj);
            }
          }).catch(err => {
            console.log(err);
          });
      }
    } else {
      let index = props.legends.findIndex(x => x.layerName === layer.external_id)
      if(index > -1) {
        props.legends.splice(index, 1);
      }
    }
  }
</script>
<template>
  <fieldset class="pl-5 mt-2" v-if="item.status">
    <legend class="w-full px-2">
      <button type="button" class="flex gap-x-3 -ml-5 w-full items-center justify-between px-2 text-gray-400 hover:text-gray-500" aria-controls="filter-section-0" aria-expanded="false">
        <span>-</span>
        <span class="text-base font-medium text-gray-600 flex-grow text-left">{{ item.name }}</span>
        <span v-if="lvl > 1 && !loaded" class="flex items-end"><button @click="loadData()" type="button" class="text-sm">(Mostrar)</button></span>
      </button>
    </legend>
    <div class="px-4 pb-2 pt-2" id="filter-section-0">
      <div class="space-y-3">
        <template v-for="option in item.layers">
          <div class="flex items-center" v-if="option.status && option.published">
            <input id="color-0-mobile" :name="option.ref" v-model="option.show" @change="toggleLegend(option, option.show)" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <label for="color-0-mobile" class="ml-3 text-sm text-gray-500">{{ option.name }}</label>
          </div>
        </template>
      </div>
    </div>
    <MenuItem
      v-if="item.categories?.length && item.categories.length > 0"
      v-for="category in item.categories"
      :item="category"
      :lvl="lvl + 1"
      :legends="legends"
    />
  </fieldset>
</template>
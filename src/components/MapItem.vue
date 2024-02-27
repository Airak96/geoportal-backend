<script setup>
  import { ref } from "vue";
import MapItem from "./MapItem.vue"
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    lvl: {
      type: Number
    }
  });

  const url = ref(import.meta.env.VITE_GEOSERVER);
</script>
<template>
  <template v-for="layer in item.layers">
    <ol-tile-layer :zIndex="1" v-if="layer.show">
      <ol-source-tile-wms
        :url="url"
        :layers="'Ecuador:'+layer.external_id"
        serverType="geoserver"
      />
    </ol-tile-layer>
  </template>
  <MapItem 
    v-for="category in item.categories"
    :item="category"
    :lvl="lvl + 1"
  />
</template>
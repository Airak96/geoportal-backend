<script setup>
  import MapItem from "./MapItem.vue"
  import { ref, inject } from 'vue'
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    lvl: {
      type: Number
    }
  });

  const format = inject("ol-format");
  const geoJson = new format.GeoJSON();

  const projection = ref("EPSG:3857");

  function getURL(path) {
    let url = `${import.meta.env.VITE_FILES_URL}/${path}`
    console.log(url)
    return url;
  }
</script>
<template>
  <template v-for="layer in item.layers">
    <ol-image-layer :zIndex="1" v-if="layer.show">
      <ol-source-image-wms
        url="http://localhost:8080/geoserver/wms"
        :layers="'Ecuador:'+layer.external_id"
        serverType="geoserver"
      />
    </ol-image-layer>
  </template>
  <MapItem 
    v-for="category in item.categories"
    :item="category"
    :lvl="lvl + 1"
  />
</template>
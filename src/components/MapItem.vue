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
    <template v-for="file in layer.files">
      <ol-vector-image-layer
        :zIndex="2"
        v-if="file.type === 'vector' && layer.show"        
      >
        <!-- fuente de datos -->
        <!-- :ref        = referencia de la fuente -->
        <!-- :url        = url de origen -->
        <!-- :format     = formato de la fuente -->
        <!-- :projection = sistema de referencia de coordenadas -->
        <ol-source-vector 
          :ref="'file_'+file.id_file"
          :url="getURL(file.path_json)"
          :format="geoJson"
          :projection="projection"
        ></ol-source-vector>
        <!-- FIN fuente de datos -->

        <!-- estilos -->
        <ol-style v-if="file.properties">
          <!-- linea -->
          <ol-style-stroke
            v-if="file.properties?.stroke" 
            :color="file.properties?.stroke?.color || 'blue'" 
            :width="file.properties?.stroke?.width || 2"
          ></ol-style-stroke>
          <!-- FIN linea -->

          <!-- relleno -->
          <ol-style-fill 
            v-if="file.properties?.fill" 
            :color="file.properties?.fill?.color || 'rgba(255,255,255,0.4)'"
          ></ol-style-fill>
          <!-- FIN relleno -->

          <!-- circulo -->
          <ol-style-circle 
            v-if="file.properties?.circle"
            :radius="file.properties?.circle?.radius || 7">

            <!-- relleno circulo -->
            <ol-style-fill 
              v-if="file.properties?.circle?.fill"
              :color="file.properties?.circle?.fill?.color || 'blue'"
            ></ol-style-fill>
            <!-- FIN relleno circulo -->

          </ol-style-circle>
          <!-- FIN circulo -->
        </ol-style>
        <!-- FIN estilos -->
      </ol-vector-image-layer>
      <!-- FIN capa -->

      <ol-image-layer v-if="file.type === 'raster' && layer.show" >
        <ol-source-image-static
          :url="getURL(file.path_json)"
          :imageExtent="[
            file.extent.west,
            file.extent.south,
            file.extent.east,
            file.extent.north,
          ]"
        ></ol-source-image-static>
      </ol-image-layer>
    </template>
  </template>
  <MapItem 
    v-for="category in item.categories"
    :item="category"
    :lvl="lvl + 1"
  />
</template>
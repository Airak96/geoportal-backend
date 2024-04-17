<script setup>
  import MenuItem from '../components/MenuItem.vue'
  import MapItem from '../components/MapItem.vue'
  import InfoModal from '../components/InfoModal.vue';
  import { transform } from 'ol/proj'
  import { ref } from 'vue';

  // store imports
  import { useCategoriesStore } from '../stores/categories.store'
  import { useVisitStore } from '../stores/visits.store';

  const categoriesStore = useCategoriesStore();
  const visitStore = useVisitStore();
  const data = ref([]);
  const selected = ref([]);

  const registerVisit = () => {
    let visit = JSON.parse(sessionStorage.getItem('visit'));
    if(!visit?.registered) {
      visitStore.getip()
        .then(res => {
          let ip = res.data.ip;
          visitStore.register(ip)
            .then(res => {
              sessionStorage.setItem('visit', JSON.stringify({ registered: true }))
            })
            .catch(error => console.log(error));
        }).catch(error => console.log(error));
    }
  }

  registerVisit();

  categoriesStore.getAllData()
    .then(res => {
      let arr = res.data;
      data.value = arr.map(obj => ({
        ...obj,
        layers: obj.layers.map(lay => ({ ...lay, show: false, loaded: false })),
      }));
    })
    .catch(error => console.log(error));

  // formato de fuentes
  const childComponentRef = ref(null);
  const map = ref(null);

  // config mapa
  const long = -79.15054214735792;
  const lati = -4.887745621654;
  const center = ref(transform([long, lati], 'EPSG:4326', 'EPSG:3857'));
  const projection = ref("EPSG:3857");
  const zoom = ref(9.6);
  const rotation = ref(0);

  // sistema de referencia coordenadas
  const projectionName = "EPSG:32717";
  const projectionDef = "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs +type=crs";

  const clicked = (event) => {
    if(event.pixel) {
      const map = event.map;
      const view = map.getView();
      const resolution = view.getResolution();

      var layers = map.getLayers()['array_'];
      var pos = layers.length - 1;
      if(layers.length > 0) {
        findProperties(layers, pos, event, resolution);
      }
    }
  };
  
  const findProperties = (layers, pos, event, resolution) => {
    if(pos > -1) {
      let layer = layers[pos];
      if(layer.getVisible()) {
        if(layer.getSource().getFeatureInfoUrl) {
          let url = layer.getSource().getFeatureInfoUrl(event.coordinate, resolution, 'EPSG:3857', {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': '300',
          })
          if(url) {
            fetch(url)
              .then(res => {
                console.log('DATOS: ', res);
                return res.json();
              })
              .then(data => {
                if(data && data.features?.length) {
                  childComponentRef.value?.openModal(data.features[0]?.properties)
                } else {
                  findProperties(layers, pos - 1, event, resolution);
                }
              })
              .catch(err => {
                console.error('Fetch error:', err);
              });
          }
        }
      }
    }
  }
</script>
<template>
  <div class="grid grid-cols-5 gap-3 h-full">
    <div class="col-span-5 relative h-full">      
      <!-- filtro del mapa -->
      <div class="absolute top-8 left-14 z-10 w-[320px]">
        <div class="bg-white rounded-lg shadow-md mb-5 overflow-hidden">
          <div class="w-full bg-[#dff1ff] px-5">
            <div class="flex w-full items-center justify-between py-2 text-black/80">
              <span class="text-sm font-bold uppercase">Capas de información</span>
            </div>
          </div>
          <div class="px-5 pt-2 pb-5 overflow-y-auto max-h-[500px]">
            <form>
              <fieldset>
                <MenuItem 
                  v-if="data?.length && data.length > 0"
                  v-for="item in data"
                  :item="item"
                  :lvl="1"
                  :legends="selected"
                />
              </fieldset>
            </form>
          </div>
        </div>
      </div>

      <div class="absolute top-8 right-10 z-[1] w-[320px]">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="w-full bg-[#dff1ff] px-5">
            <div class="flex w-full items-center justify-between py-2 text-black/80">
              <span class="text-sm font-bold uppercase">Leyendas</span>
            </div>
          </div>
          <div class="px-5 pt-2 pb-5 overflow-y-auto max-h-[350px]">
            <template v-if="selected?.length && selected.length > 0">
              <template v-for="obj in selected">
                <div class="ml-4 mt-4 mb-2">
                  <div class="flex w-full items-center gap-x-2">
                    <span class="flex-1 font-bold text-xs uppercase">{{ obj.localName }}</span>
                    <!-- <button v-if="obj.description?.trim()" type="button" class="outline-none p-1.5 bg-slate-100 rounded-md" @click="openInfoModal(obj.description)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </button> -->
                    <button type="button" class="outline-none p-1.5 bg-slate-100 rounded-md" @click="obj.show = !obj.show">
                      <svg v-if="obj.show" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      </svg>
                      <svg v-if="!obj.show" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
                <template v-if="obj.show">
                  <template v-for="legend in obj.rules">
                    <div v-if="legend.ElseFilter !== 'true'" class="grid grid-cols-12 items-center gap-3 pl-4 mt-3">
                      <template v-if="legend.symbolizers[0]?.Polygon">
                        <div class="col-span-2">
                          <div class="w-[20px] h-4" :style="{ backgroundColor: legend.symbolizers[0]?.Polygon?.fill }"></div>
                        </div>
                        <div class="col-span-10">
                          <p class="text-xs text-gray-500">{{ legend.name }}</p> 
                        </div>                       
                      </template>
                      <template v-if="legend.symbolizers[0]?.Point">
                        <div class="col-span-2">
                          <div class="w-[20px] h-4" :style="{ backgroundColor: legend.symbolizers[0]?.Point?.graphics[0]?.fill }"></div>
                        </div>
                        <div class="col-span-10">
                          <p class="text-xs text-gray-500">{{ legend.name }}</p> 
                        </div>
                      </template>
                      <template v-if="legend.symbolizers[0]?.Line">
                        <div class="col-span-2">
                          <div class="w-[20px] h-4" :style="{ backgroundColor: legend.symbolizers[0]?.Line?.stroke }"></div>
                        </div>
                        <div class="col-span-10">
                          <p class="text-xs text-gray-500">{{ legend.name }}</p> 
                        </div>
                      </template>
                      <template v-if="legend.symbolizers[0]?.Raster">
                        <template v-if="legend.symbolizers[0]?.Raster?.colormap">
                          <template v-for="entry of legend.symbolizers[0]?.Raster?.colormap?.entries">
                            <div class="col-span-2">
                              <div class="w-[20px] h-4" :style="{ backgroundColor: entry?.color }"></div>
                            </div>
                            <div class="col-span-10">
                              <p class="text-xs text-gray-500">{{ entry?.label }}</p> 
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <div class="col-span-10">
                            <p class="text-xs text-gray-500">(Sin información o leyenda)</p> 
                          </div>
                        </template>
                      </template>
                    </div>
                  </template>
                </template>     
              </template>             
            </template>

            <template v-if="selected?.length === 0">
              <div class="pl-4 text-sm italic text-gray-500 mt-1">
                (No hay capas seleccionadas)
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- MAPA (Open Layers: vue3-openlayers) -->
      <div class="overflow-hidden h-full">
        <ol-map
          ref="map"
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height: 100%"
          @click="clicked"
        >
          <!-- registro de proyeccion -->
          <ol-projection-register
            :projectionName="projectionName"
            :projectionDef="projectionDef"
          />
          <!-- FIN registro de proyeccion -->

          <!-- configuracion del mapa -->
          
          <!-- :center     = coordenadas para posicionar el centro del mapa -->
          <!-- :rotation   = nivel de rotacion del mapa -->
          <!-- :zoom       = aumento predeterminado -->
          <!-- :projection = sistema de referencia de coordenadas -->
          <ol-view
            ref="view"
            :center="center" 
            :rotation="rotation"
            :zoom="zoom"
            :projection="projection"
          />
          <!-- FIN configuracion del mapa -->

          <ol-webgl-tile-layer :zIndex="1">
            <ol-source-osm />
          </ol-webgl-tile-layer>

          <!-- zoom del mapa -->
          <ol-zoom-control />
          <!-- FIN zoom del mapa -->

          <!-- barra de zoom del mapa -->
          <ol-zoomslider-control />
          <!-- FIN barra de zoom del mapa -->

          <!-- escala del mapa -->
          <ol-scaleline-control />
          <!-- FIN escala del mapa -->

          <!-- capa de vector -->
          <template v-for="category in data">
            <MapItem 
              :item="category"
              :lvl="1"
            />
          </template>
        </ol-map>
        <!-- FIN mapa -->
      </div>
    </div>
  </div>
  <InfoModal ref="childComponentRef" />
</template>

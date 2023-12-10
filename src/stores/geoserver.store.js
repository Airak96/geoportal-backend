import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/geoserver`;
const geourl = import.meta.env.VITE_GEOSERVER;
const workspace = import.meta.env.VITE_WORKSPACE;

export const useGeoserverStore = defineStore({
  id: 'geoserver',
  state: () => ({}),
  actions: {
    createDataStore(id) {    
      return fetchWrapper.post(`${baseUrl}/create/datastore/${id}`, null);
    },
    createShapeLayer(id) {    
      return fetchWrapper.post(`${baseUrl}/create/shape/${id}`, null);
    },
    createStyles(id) {    
      return fetchWrapper.post(`${baseUrl}/create/styles/${id}`, null);
    },

    createCoverageStore(id) {    
      return fetchWrapper.post(`${baseUrl}/create/coveragestore/${id}`, null);
    },
    createRasterLayer(id) {    
      return fetchWrapper.post(`${baseUrl}/create/raster/${id}`, null);
    },
    legends(layer) {
      return fetchWrapper.get(`${geourl}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=application/json&WIDTH=35&HEIGHT=15&LAYER=${workspace}:${layer}`)
    }
  }
});
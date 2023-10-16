import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/geoserver`;

export const useGeoserverStore = defineStore({
  id: 'geoserver',
  state: () => ({}),
  actions: {
    publishShapes(id) {    
      return fetchWrapper.post(`${baseUrl}/publish/shape/${id}`, null);
    },
    publishRaster(id) {    
      return fetchWrapper.post(`${baseUrl}/publish/raster/${id}`, null);
    },
  }
});
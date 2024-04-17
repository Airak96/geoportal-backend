import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/layers`;

export const useLayersStore = defineStore({
  id: 'layers',
  state: () => ({
    layers: {},
  }),
  actions: {
    async getAll() {
      this.layers = { loading: true };
      fetchWrapper.get(`${baseUrl}/all`)
        .then(layers => this.layers = layers)
        .catch(error => this.layers = { error })
    },
    add(data, file, styles) {
      const formData = new FormData();
      formData.append('file', file);
      if(styles) {
        formData.append('styles', styles);
      }
      formData.append('fileProps', JSON.stringify(data));
      
      if(data.type === 'raster') {        
        return fetchWrapper.post(`${baseUrl}/raster`, formData);
      } else {        
        return fetchWrapper.post(`${baseUrl}/shapes`, formData);
      }
    },
    get(id) {
      return fetchWrapper.get(`${baseUrl}/get/${id}`)
    },
    edit(id, data) {
      return fetchWrapper.put(`${baseUrl}/${id}`, data)
    },
    remove(id) {
      return fetchWrapper.delete(`${baseUrl}/${id}`)
    },
    download(path) {
      return fetchWrapper.files(`${baseUrl}/download/${path}`)
    },
  }
});
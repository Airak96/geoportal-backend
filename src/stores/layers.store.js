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
    add(data) {
      return fetchWrapper.post(`${baseUrl}/`, data)
    },
    get(id) {
      return fetchWrapper.get(`${baseUrl}/get/${id}`)
    },
    edit(id, data) {
      return fetchWrapper.put(`${baseUrl}/${id}`, data)
    },
    remove(id) {
      return fetchWrapper.delete(`${baseUrl}/${id}`)
    }
  }
});
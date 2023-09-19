import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/categories`;

export const useCategoriesStore = defineStore({
  id: 'categories',
  state: () => ({
    categories: {}
  }),
  actions: {
    async getAll() {
      this.categories = { loading: true };
      fetchWrapper.get(`${baseUrl}/all`)
        .then(res => {
          this.categories = res.data;
        })
        .catch(error => this.categories = { error })
    },
    getAllData() {
      return fetchWrapper.get(`${baseUrl}/all`)
    },
    add(data) {
      return fetchWrapper.post(`${baseUrl}/`, data)
    },
    get(id) {
      return fetchWrapper.get(`${baseUrl}/get/${id}`)
    },
    getSub(id) {
      return fetchWrapper.get(`${baseUrl}/all/sub/${id}`)
    },
    edit(id, data) {
      return fetchWrapper.put(`${baseUrl}/${id}`, data)
    },
    remove(id) {
      return fetchWrapper.delete(`${baseUrl}/${id}`)
    }
  }
});
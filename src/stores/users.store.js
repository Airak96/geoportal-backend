import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    users: {}
  }),
  actions: {
    async getAll() {
      this.users = { loading: true };
      fetchWrapper.get(`${baseUrl}/all`)
      .then(res => {
        this.users = res.data;
      })
      .catch(error => this.categories = { error })
    },
    getAllData() {
      return fetchWrapper.get(`${baseUrl}/all`)
    },
    add(data) {
      return fetchWrapper.post(`${baseUrl}/`, data)
    },
    edit(id, data) {
      return fetchWrapper.put(`${baseUrl}/${id}`, data)
    },
    toggleStatus(id) {
      return fetchWrapper.put(`${baseUrl}/status/${id}`, null)
    },
    remove(id) {
      return fetchWrapper.delete(`${baseUrl}/${id}`)
    }
  }
})
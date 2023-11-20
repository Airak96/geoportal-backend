import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/roles`;

export const useRolesStore = defineStore({
  id: 'roles',
  state: () => ({
    roles: {}
  }),
  actions: {
    async getAll() {
      this.roles = { loading: true };
      fetchWrapper.get(`${baseUrl}/`)
      .then(res => {
        this.roles = res.data;
      })
      .catch(error => this.categories = { error })
    },
  }
});
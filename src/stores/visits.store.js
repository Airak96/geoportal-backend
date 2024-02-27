import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/visit`;

export const useVisitStore = defineStore({
  id: 'visits',
  state: () => ({
    visits: {}
  }),
  actions: {
    register() {
      return fetchWrapper.post(`${baseUrl}/register`, null)
    },
    unique() {
      return fetchWrapper.get(`${baseUrl}/counter/unique`);
    },
    byCountries() {
      return fetchWrapper.get(`${baseUrl}/counter/countries`);
    },
  }
});
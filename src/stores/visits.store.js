import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/visit`;

export const useVisitStore = defineStore({
  id: 'visits',
  state: () => ({
    visits: {}
  }),
  actions: {
    getip() {
      return fetchWrapper.get(`https://api6.ipify.org/?format=json`)
    },
    register(ip) {
      return fetchWrapper.post(`${baseUrl}/register`, { ip_address: ip })
    },
    unique() {
      return fetchWrapper.get(`${baseUrl}/counter/unique`);
    },
    byCountries() {
      return fetchWrapper.get(`${baseUrl}/counter/countries`);
    },
  }
});
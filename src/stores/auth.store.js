import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';
import router from '../router/index';
import { notify } from "@kyvg/vue3-notification";

const baseUrl = `${import.meta.env.VITE_API_URL}/auth`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(email, password) {
      const user = await fetchWrapper.post(`${baseUrl}/login`, { email, password });

      // update pinia state
      this.user = user.data;

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user.data));

      notify({
        text: '¡Bienvenid@!',
        type: '!text-base !bg-green-600 !border-green-900',
      });

      if(this.user?.data?.role == 'admin' || this.user?.data?.role == 'user') {
        // redirect to previous url or default to home page
        router.push(this.returnUrl || '/admin');
      } else {
        router.push('/');
      }
    },
    signup(data) {      
      return fetchWrapper.post(`${baseUrl}/signup`, data);
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    },
    recoverPassword(data) {
      return fetchWrapper.post(`${baseUrl}/restore-password`, data);
    }
  }
});
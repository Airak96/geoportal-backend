import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';

import App from './App.vue'
import router from './router'

import OpenLayersMap from "vue3-openlayers";
import Notifications from '@kyvg/vue3-notification'
import PrimeVue from 'primevue/config'
import "vue3-openlayers/dist/vue3-openlayers.css";

const app = createApp(App);

app.use(createPinia());
app.use(router)
app.use(OpenLayersMap);
app.use(Notifications)
app.use(PrimeVue, {});
app.mount('#app')

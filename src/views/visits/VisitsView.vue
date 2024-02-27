<script setup>
import { notify } from "@kyvg/vue3-notification";

// vue imports
import { ref } from 'vue';
import { formatDate } from '../../helpers/utils'

// store imports
import { useVisitStore } from '../../stores/visits.store';

const uniqueVisits = ref([]);
const globalVisits = ref([]);
const visitStore = useVisitStore();

function getUniqueVisits() {
  visitStore.unique()
    .then(res => {
      uniqueVisits.value = res.data;
    }).catch(err => {
      console.log(err);
      notify({
        text: err?.response?.data?.message || 'Error al procesar la solicitud.',
        type: '!text-base !bg-red-500 !border-red-800',
      });
    });
}

function getGlobalVisits() {
  visitStore.byCountries()
    .then(res => {
      globalVisits.value = res.data;
    }).catch(err => {
      console.log(err);
      notify({
        text: err?.response?.data?.message || 'Error al procesar la solicitud.',
        type: '!text-base !bg-red-500 !border-red-800',
      });
    });
}

getGlobalVisits();
getUniqueVisits();

</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-12 gap-x-10">
      <div class="col-span-4">
        <h4 class="text-slate-500 font-bold text-lg mb-5">Visitas globales</h4>
        <div class="flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">País</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Visitas totales</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr
                      v-if="globalVisits?.length" 
                      v-for="visit in globalVisits"
                      class="border-t-2 border-gray-200"
                    >
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ visit.country_name }}
                      </td>
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ visit.total_visits }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-8">        
        <h4 class="text-slate-500 font-bold text-lg mb-5">Visitas únicas (Últimas 50)</h4>
        <div class="flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">IP</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">IP Ver.</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">País</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Conteo</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ult. visita</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr
                      v-if="uniqueVisits?.length" 
                      v-for="visit in uniqueVisits"
                      :key="visit.id_visit"
                      class="border-t-2 border-gray-200"
                    >
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ visit.ip }}
                      </td>
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ visit.ip_ver }}
                      </td>
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ visit.country_name !== '-' ? visit.country_name  : 'Loopback' }}
                      </td>
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ visit.visit_count }}
                      </td>
                      <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                        {{ formatDate(visit.updated_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
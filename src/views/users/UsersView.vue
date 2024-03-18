<script setup>
import { notify } from "@kyvg/vue3-notification";

// vue imports
import { ref } from 'vue';
import { formatDate } from '../../helpers/utils'
import { storeToRefs } from 'pinia'

// component imports
import UserModal from '../../components/UserModal.vue';
import DeleteModal from '../../components/DeleteModal.vue';

// store imports
import { useUsersStore } from '../../stores/users.store';

// logic
const userModalRef = ref(null);
const deleteModalRef = ref(null);

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const getAllUsers = () => {
  usersStore.getAll();  
}
getAllUsers();

function addUser() {
  userModalRef.value?.openModal(null, 'add')
}

function editUser(n) {
  userModalRef.value?.openModal(n, 'edit')
}

function openDeleteUser(n) {
  deleteModalRef.value?.openModal(n,'user');
}

function deleteRecord(n, type) {
  if(type === 'user') {
    const usr = n.external_id;
    usersStore.remove(usr)
      .then(res => {
        let index = users.value.findIndex(i => i.external_id == usr);
        if(index > -1) {
          users.value.splice(index, 1);
        }

        notify({
          text: 'Usuario eliminado correctamente.',
          type: '!text-base !bg-green-600 !border-green-900',
        });

        deleteModalRef.value?.closeModal();
      }).catch(err => {
        console.log(err);
        notify({
          text: err?.response?.data?.message || 'Error al procesar la solicitud.',
          type: '!text-base !bg-red-500 !border-red-800',
        });
      });
  }
}

</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="mb-6 flex items-center justify-start gap-x-5">
            <button @click="addUser()" type="button"
              class="relative inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              <svg class="-ml-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
              </svg>
              Agregar usuario
            </button>
          </div>
          <div class="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Cuenta</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rol</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">País</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Institución</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ult. Modif.</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-if="users?.loading">
                  <th colspan="5" class="bg-gray-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                    <svg class="animate-spin mx-auto h-8 w-8 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </th>
                </tr>

                <tr
                  v-if="users.length" 
                  v-for="user in users"
                  :key="user.id_user"
                  class="border-t-2 border-gray-200"
                >
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white relative">
                    {{ user.name }}
                    <span class="block text-gray-500 text-xs">{{ user.email }}</span>
                  </td>
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                    {{ user.role_id === '1' ? 'Administrador':'Usuario' }}
                  </td>
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                    {{ user.country }}
                  </td>
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                    {{ user.institution }}
                  </td>
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                    {{ formatDate(user.updated_at) }}
                  </td>
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                    <div
                      v-show="user.status"
                      class="flex items-center gap-x-2 justify-start"
                    >
                      <div class="flex-none rounded-full p-1 text-green-400 bg-green-400/10">
                        <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                      </div>
                      <div class="block">Activo</div>
                    </div>

                    <div
                      v-show="!user.status"
                      class="flex items-center gap-x-2 justify-start"
                    >
                      <div class="flex-none rounded-full p-1 text-rose-400 bg-rose-400/10">
                        <div class="h-1.5 w-1.5 rounded-full bg-current"></div>
                      </div>
                      <div class="block">Inactivo</div>
                    </div>
                  </td>
                  <td class="pl-4 pr-3 py-2 text-left text-sm text-gray-900 sm:pl-3 bg-white">
                    <div class="flex space-x-1 justify-end">
                      <button @click="editUser(user)" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                        Editar
                      </button>
                      <button @click="openDeleteUser(user)" type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Eliminar
                      </button>
                      <!-- <button type="button" class="flex gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Bloquear
                      </button> -->
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <UserModal 
      ref="userModalRef"
      @refresh="(n) => getAllUsers()"
    />
    <DeleteModal 
      ref="deleteModalRef" 
      @confirmed="deleteRecord" 
    />
  </div>
</template>
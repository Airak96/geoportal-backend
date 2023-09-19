<script setup>
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router'

  const showModal = ref(false);
  const hidden = ref(true);

  const openModal = () => {
    hidden.value = false;
    setTimeout(() => {
      showModal.value = true;
    }, 100);
  }

  const closeModal = () => {
    showModal.value = false;
    setTimeout(() => {
      hidden.value = true;
    }, 250);
  }
</script>

<template>
  <div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="mb-6 flex items-center justify-start gap-x-6">
              <button type="button" @click="openModal()"
                class="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <svg class="-ml-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                </svg>
                Agregar capa
              </button>
            </div>
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Archivos</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ult. Modif.</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Lindsay Walton</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">3 Archivos</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Activo</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">30/06/2023</td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <RouterLink to="/admin/capas/editar" class="text-indigo-600 hover:text-indigo-900">Editar</RouterLink>
                    </td>
                  </tr>
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Lindsay Walton</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">1 archivo</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Activo</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">30/06/2023</td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" class="text-indigo-600 hover:text-indigo-900">Editar</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <nav class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
                <div class="hidden sm:block">
                  <p class="text-sm text-gray-700">
                    Mostrando
                    <span class="font-medium">1</span>
                    a
                    <span class="font-medium">10</span>
                    de
                    <span class="font-medium">20</span>
                    resultados
                  </p>
                </div>
                <div class="flex flex-1 justify-between sm:justify-end">
                  <a href="#" class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Anterior</a>
                  <a href="#" class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0">Siguiente</a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10" :class="{ 'hidden': hidden }" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" :class="{ 'ease-out duration-300 opacity-100': showModal, 'ease-in duration-200 opacity-0': !showModal }"></div>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div :class="{ 'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100': showModal, 'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !showModal }" class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button @click="closeModal()" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <form>
                <div class="space-y-12">
                  <div class="border-b border-gray-900/10 pb-12">
                    <h2 class="text-lg font-semibold leading-5 text-gray-900">Nueva capa de datos</h2>
                    <p class="text-sm leading-6 text-gray-600">Ingresa la información relacionada a la capa de datos.</p>

                    <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">

                      <div class="sm:col-span-3">
                        <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Categoría
                        </label>
                        <div class="mt-2">
                          <select id="country" name="country" autocomplete="country-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                            <option>Categoría 1</option>
                            <option>Categoría 2</option>
                            <option>Categoría 3</option>
                          </select>
                        </div>
                      </div>

                      <div class="col-span-full">
                        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                        <div class="mt-2">
                          <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                            <input type="text" name="name" id="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                          </div>
                        </div>
                      </div>

                      <div class="col-span-full">
                        <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Descripción</label>
                        <div class="mt-2">
                          <textarea id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-end gap-x-4">
                  <button @click="closeModal()" type="button" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cerrar</button>
                  <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Crear capa</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  // Modal Editar
  const showEditModal = ref(false);
  const hiddenEdit = ref(true);

  const openEditModal = () => {
    hiddenEdit.value = false;
    setTimeout(() => {
      showEditModal.value = true;
    }, 100);
  }

  const closeEditModal = () => {
    showEditModal.value = false;
    setTimeout(() => {
      hiddenEdit.value = true;
    }, 250);
  }

  // Modal Archivo
  const showFileModal = ref(false);
  const hiddenFile = ref(true);

  const openFileModal = () => {
    hiddenFile.value = false;
    setTimeout(() => {
      showFileModal.value = true;
    }, 100);
  }

  const closeFileModal = () => {
    showFileModal.value = false;
    setTimeout(() => {
      hiddenFile.value = true;
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
                <button type="button" @click="openEditModal()"
                  class="relative inline-flex items-center gap-x-1.5 rounded-md bg-black/60 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-ml-0.5 h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Editar capa
                </button>
                <button type="button" @click="openFileModal()"
                  class="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <svg class="-ml-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  Agregar archivo
                </button>
              </div>
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Color</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ult. Modif.</th>
                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">Distribución de prueblos Ecuador</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#BCFE11</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Activo</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">19/02/2022</td>
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

      <div class="relative z-10" :class="{ 'hidden': hiddenEdit }" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" :class="{ 'ease-out duration-300 opacity-100': showEditModal, 'ease-in duration-200 opacity-0': !showEditModal }"></div>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div :class="{ 'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100': showEditModal, 'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !showEditModal }" class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button @click="closeEditModal()" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                      <h2 class="text-lg font-semibold leading-5 text-gray-900">Editar capa</h2>
                      <p class="text-sm leading-6 text-gray-600">Edita la información a conveniencia de la capa de datos</p>

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
                    <button @click="closeEditModal()" type="button" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cerrar</button>
                    <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Crear capa</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="relative z-10" :class="{ 'hidden': hiddenFile }" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" :class="{ 'ease-out duration-300 opacity-100': showFileModal, 'ease-in duration-200 opacity-0': !showFileModal }"></div>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div :class="{ 'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100': showFileModal, 'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !showFileModal }" class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button @click="closeFileModal()" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                      <h2 class="text-lg font-semibold leading-5 text-gray-900">Nuevo archivo</h2>
                      <p class="text-sm leading-6 text-gray-600">Agrega nuevos archivos a la capa</p>

                      <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                        <div class="col-span-full">
                          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                          <div class="mt-2">
                            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input type="text" name="name" id="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            </div>
                          </div>
                        </div>

                        <div class="col-span-full">
                          <div class="flex items-center gap-x-3">
                            <div>
                              <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Color</label>
                            </div>
                            <div>
                              <input type="color" name="name" value="#0000ff" class="w-[100px]">
                            </div>
                          </div>
                        </div>

                        <div class="col-span-full">
                          <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Archivo de la capa</label>
                          <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div class="text-center">
                              <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                              </svg>
                              <div class="mt-4 flex text-sm leading-6 text-gray-600">
                                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                  <span>Sube un archivo</span>
                                  <input id="file-upload" name="file-upload" type="file" class="sr-only">
                                </label>
                                <p class="pl-1">o arrástralo aquí</p>
                              </div>
                              <p class="text-xs leading-5 text-gray-600">ZIP hata 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 flex items-center justify-end gap-x-4">
                    <button @click="closeFileModal()" type="button" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cerrar</button>
                    <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Guardar archivo</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
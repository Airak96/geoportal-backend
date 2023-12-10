<script setup>
import { notify } from "@kyvg/vue3-notification";

// vue imports
import { ref } from "vue";

// store imports
import { useCategoriesStore } from '../stores/categories.store'

// form imports
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

// vue functions
const emit = defineEmits(['refresh']);

// logic
const showModal = ref(false); // false: modal oculto | true: modal abierto
const hidden = ref(true);     // false: overlay oculto | true: overlay abierto
const edit = ref(false);      // false: nuevo | true: editando
const parentRef = ref(null);  // referencia del padre
const object = ref(null);     // objeto a editar
const form = ref(null);       // referencia del formulario

const status = ref(true);     // checkbox de estado == false: Inactivo | true: Activo

const schema = Yup.object().shape({
  external: Yup.string(),
  name: Yup.string().required("El nombre es requerido"),
  description: Yup.string(),
});

const openModal = (item, type, parent) => {
  object.value = item;
  parentRef.value = parent;
  edit.value = (type === 'edit');
  
  if(item) {
    form.value.setFieldValue('name', item.name);
    form.value.setFieldValue('description', item.description || '');
    form.value.setFieldValue('external', item.external_id);
    status.value = item.status;
  } else {
    status.value = true;
  }

  hidden.value = false;
  setTimeout(() => {
    showModal.value = true;
  }, 100);
};

const closeModal = (reset) => {
  if(reset)
    reset();
  showModal.value = false;
  setTimeout(() => {
    hidden.value = true;
  }, 250);
};

const refreshValues = (data) => {
  object.value.name = data.name;
  object.value.description = data.description;
  object.value.status = status.value;
  object.value.updated_at = data.updated_at;
}

function onSubmit(values, { setErrors, resetForm }) {
  const categoriesStore = useCategoriesStore();
  const { 
    external,
    name, 
    description
  } = values;

  let body = {
    name: name,
    status: status.value,
    updated_at: new Date(),
  }

  if(description)
    body.description = description;

  if(parentRef.value)
    body.parent_id = parentRef.value.id_category;

  if(edit.value && external) {
    return categoriesStore.edit(external, body)
      .then(res => {
        refreshValues(body);
        resetForm();
        closeModal();

        notify({
          text: 'Categoría editada correctamente.',
          type: '!text-base !bg-green-600 !border-green-900',
        });
      })
      .catch(error => {
        console.log(error);
        notify({
          text: error?.response?.data?.message || 'Error al procesar la solicitud.',
          type: '!text-base !bg-red-500 !border-red-800',
        });
      });
  } else {
    return categoriesStore.add(body)
      .then(res => {
        resetForm();
        closeModal();

        notify({
          text: 'Categoría creada correctamente.',
          type: '!text-base !bg-green-600 !border-green-900',
        });
        
        if(parentRef.value) {
          if(parentRef.value.categories) {
            parentRef.value.categories.push(res.data);
          } else {
            parentRef.value.categories = [];
            parentRef.value.categories.push(res.data);
          }
        }else {
          emit('refresh', res.data);
        }
      })
      .catch(error => {
        console.log(error);
        notify({
          text: error?.response?.data?.message || 'Error al procesar la solicitud.',
          type: '!text-base !bg-red-500 !border-red-800',
        });
      });
  }
}

// vue functions
defineExpose({
  openModal,
});

</script>
<template>
  <div
    class="relative z-10"
    :class="{ hidden: hidden }"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      :class="{
        'ease-out duration-300 opacity-100': showModal,
        'ease-in duration-200 opacity-0': !showModal,
      }"
    ></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          :class="{
            'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100':
              showModal,
            'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95':
              !showModal,
          }"
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div>
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting, handleReset }" ref="form" method="POST">
              <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                  <h2 class="text-lg font-semibold leading-5 text-gray-900">
                    {{ edit ? 'Editar':'Nueva' }} categoría
                  </h2>
                  <p class="text-sm leading-6 text-gray-600">
                    {{ edit ? 'Edita':'Ingresa' }} la información relacionada a la categoría.
                  </p>

                  <div v-if="errors.name" class="rounded-md bg-red-50 p-4 mt-3">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">Completa el formulario para continuar</h3>
                      </div>
                    </div>
                  </div>

                  <fieldset :disabled="isSubmitting">
                    <Field 
                      type="hidden"
                      name="external"
                    />
                    <div
                      class="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6"
                    >
                      <div class="col-span-full" v-if="parentRef">
                        <div class="bg-gray-100 border border-gray-200 py-3 px-4 rounded">
                          <p class="mb-0 text-sm truncate"><span class="font-bold">Categoría relacionada:</span> {{ parentRef?.name }}</p>
                        </div>
                      </div>
                      <div class="col-span-full">
                        <label
                          for="category_name"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Nombre</label
                        >
                        <div class="mt-2">
                          <div
                            class="relative flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                          >
                            <Field
                              type="text"
                              name="name"
                              id="category_name"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            />
                            <div v-show="errors.name" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="edit" class="sm:col-span-3">
                        <div class="relative flex items-start">
                          <div class="flex h-6 items-center">
                            <input id="category_status" name="status" type="checkbox" :checked="status" @click="() => status = !status" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600">
                          </div>
                          <div class="ml-3 text-sm leading-6">
                            <label for="category_status" class="font-medium text-gray-900">Activo</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end gap-x-4">
                <button :disabled="isSubmitting"
                  @click="closeModal(handleReset)"
                  type="button"
                  class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button :disabled="isSubmitting" :class="{ 'cursor-not-allowed':isSubmitting }"
                  type="submit"
                  class="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <svg v-show="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ edit ? 'Guardar cambios':'Crear categoría' }}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

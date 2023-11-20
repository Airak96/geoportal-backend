<script setup>
// vue imports
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { generatePassword } from "../helpers/utils";

// store imports
import { useUsersStore } from '../stores/users.store'
import { useRolesStore } from '../stores/roles.store'

// form imports
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

// vue functions
const emit = defineEmits(['refresh']);

// logic
const rolesStore = useRolesStore();
const usersStore = useUsersStore();
const { roles } = storeToRefs(rolesStore);
rolesStore.getAll();

const showModal = ref(false); // false: modal oculto | true: modal abierto
const hidden = ref(true);     // false: overlay oculto | true: overlay abierto
const edit = ref(false);      // false: nuevo | true: editando
const object = ref(null);     // objeto a editar
const form = ref(null);       // referencia del formulario

const schema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string(),
  password: Yup.string(),
  role: Yup.string(),
  external: Yup.string(),
});

const openModal = (item, type) => {
  object.value = item;
  edit.value = (type === 'edit');

  if(item) {
    form.value.setFieldValue('name', item.name);
    form.value.setFieldValue('email', item.email);
    form.value.setFieldValue('role', item.role_id);
    form.value.setFieldValue('external', item.external_id);
  } else {    
    form.value.setFieldValue('role', "2");
    form.value.setFieldValue('password', generatePassword(15, 'a-z,A-Z,0-9'));
  }

  hidden.value = false;
  setTimeout(() => {
    showModal.value = true;
  }, 100);
}

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
  object.value.email = data.email;
  object.value.role_id = data.role;
}

function onSubmit(values, { setErrors, resetForm }) {
  const { 
    name,
    email,
    password,
    role,
    external,
  } = values;

  let body = {
    name: name,
    email: email,
    role_id: role,
    updated_at: new Date(),
  }

  if(password) 
    body.password = password
  
  if(edit.value && external) {
    return usersStore.edit(external, body)
      .then(res => {
        refreshValues(body);
        resetForm();
        closeModal();
      })
      .catch(error => console.log(error));
  } else {
    return usersStore.add(body)
      .then(res => {
        resetForm();
        closeModal();
        
        emit('refresh', res.data);
      })
      .catch(error => console.log(error));
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
                    {{ edit ? 'Editar':'Nuevo' }} usuario
                  </h2>
                  <p class="text-sm leading-6 text-gray-600">
                    {{ edit ? 'Edita':'Ingresa' }} la información relacionada al usuario.
                  </p>
                  <fieldset :disabled="isSubmitting">
                    <Field 
                      type="hidden"
                      name="external"
                    />
                    <div
                      class="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6"
                    >
                      <div class="col-span-full">
                        <label
                          for="user_name"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Nombre</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                          >
                            <Field
                              type="text"
                              name="name"
                              id="user_name"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-span-full">
                        <label
                          for="user_email"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Email</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                          >
                            <Field
                              type="email"
                              name="email"
                              id="user_email"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div v-if="!edit" class="col-span-full">
                        <label
                          for="user_pass"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Contraseña</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                          >
                            <Field
                              type="text"
                              name="password"
                              id="user_pass"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="col-span-full">
                        <label
                          for="user_type"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Tipo de cuenta</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                          >
                            <Field
                              as="select"
                              name="role"
                              id="user_type"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            >
                              <option value="1" selected>Administrador</option>
                              <option value="2">Usuario</option>
                            </Field>
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
                  {{ edit ? 'Guardar cambios':'Crear usuario' }}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
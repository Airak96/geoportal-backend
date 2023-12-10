<script setup>
  import { Form, Field } from 'vee-validate';
  import * as Yup from 'yup';
  import { RouterLink } from 'vue-router'

  import { useAuthStore } from '../../stores/auth.store';
  import { notify } from "@kyvg/vue3-notification";

  const schema = Yup.object().shape({
    email: Yup.string().required('El email es requerido'),
    password: Yup.string().required('La contraseña es requerida')
  });

  function onSubmit(values, { setErrors }) {
    const authStore = useAuthStore();
    const { email, password } = values;

    return authStore.login(email, password)
        .catch(error => {
          setErrors({ apiError: error });
          notify({
            text: error?.response?.data?.message || 'Error al procesar la solicitud.',
            type: '!text-base !bg-red-500 !border-red-800',
          });
        });
  }
</script>
<template>
  <div>
    <RouterLink to="/">
      <img class="mx-auto h-24 w-auto" src="/src/assets/main_logo.svg" alt="">
    </RouterLink>    
  </div>
  <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
    <h2
      class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
    >
      Inicio de sesión
    </h2>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }" class="space-y-6" method="POST">
      <div v-show="errors.email || errors.password" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Completa el formulario para iniciar sesión</h3>
          </div>
        </div>
      </div>

      <div class="relative -space-y-px rounded-md shadow-sm">
        <div
          class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300"
        ></div>
        <fieldset :disabled="isSubmitting">
          <div>
            <label for="email-address" class="sr-only">Correo electrónico</label>
            <div class="relative rounded-md shadow-sm">
              <Field
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Correo electrónico"
                :validateOnBlur="false" :validateOnChange="false" :validateOnInput="false"
              />
              <div v-show="errors.email" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <div class="relative rounded-md shadow-sm">
              <Field
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Contraseña"
                :validateOnBlur="false" :validateOnChange="false" :validateOnInput="false"
              />
              <div v-show="errors.password" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <button
          type="submit"
          class="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition ease-in-out duration-150"
          :class="{ 'cursor-not-allowed':isSubmitting }"
        >
          <svg v-show="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Iniciar sesión
        </button>
      </div>
    </Form>
  </div>
</template>

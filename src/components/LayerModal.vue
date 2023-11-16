<script setup>
// vue imports
import { reactive, ref, toRefs } from "vue";

// store imports
import { useLayersStore } from '../stores/layers.store'

// form imports
import { Form, Field, FieldArray } from "vee-validate";
import * as Yup from "yup";

// logic
const showModal = ref(false); // false: modal oculto | true: modal abierto
const hidden = ref(true);     // false: overlay oculto | true: overlay abierto
const edit = ref(false);      // false: nuevo | true: editando
const parentRef = ref(null);  // referencia del padre
const object = ref(null);     // objeto a editar
const form = ref(null);       // referencia del formulario

const status = ref(true);     // checkbox de estado == false: Inactivo | true: Activo
const state = reactive({
  legends: [],
});
const { legends } = toRefs(state);

const schema = Yup.object().shape({
  external: Yup.string(),
  name: Yup.string().required("El nombre es requerido"),
  type: Yup.string().default('shape').required('El tipo es requerido'),
  file: Yup.mixed(),
  styles: Yup.mixed(),
  description: Yup.string(),
});

const openModal = (item, type, parent) => {
  object.value = item;
  parentRef.value = parent;
  edit.value = (type === 'edit');
  
  if(item) {
    form.value.setFieldValue('name', item.name);
    form.value.setFieldValue('type', item.type);
    form.value.setFieldValue('description', item.description || '');
    form.value.setFieldValue('external', item.external_id);

    if(item.type === 'raster') {
      // form.value.setFieldValue('legends', item.legends || []);
      if(item.legends?.length) {
        legends.value = item.legends;
      } else {
        legends.value = [];
      }
    }

    status.value = item.status;
  } else {
    form.value.setFieldValue('type', 'shapes');
    // form.value.setFieldValue('legends', []);
    legends.value = [];
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

const refreshValues = (data, res) => {
  object.value.name = data.name;
  object.value.type = data.type;
  object.value.legends = data.legends;
  object.value.description = data.description;
  object.value.status = status.value;
  object.value.updated_at = data.updated_at;
  if(res) {
    object.value.filename = res.filename;
    object.value.filepath = res.filepath;
    object.value.folderpath = res.folderpath;
  }
}

function download(path, name) {
  let layersStore = useLayersStore();
  layersStore.download(path)
    .then(res => {
      let file_name = name+"."+path.split(".")[1];
      file_name = file_name.replace(/ /g, '_');

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log('Archivo descargado!');
    })
    .catch(error => console.log(error));
}

const addField = () => {
  state.legends.push({ color: '#0062FF', description: '' });
}

const deleteField = (id) => {
  state.legends.splice(id, 1);
}

function onSubmit(values, { setErrors, resetForm }) {
  const layersStore = useLayersStore();
  const { 
    external,
    name,
    type,
    file,
    styles,
    description,
  } = values;

  let body = {
    name: name,
    type: type,
    status: status.value,
    legends: [...legends.value.filter(x => x.color !== '' && x.description !== '')],
    updated_at: new Date(),
  }

  if(description)
    body.description = description;

  if(parentRef.value)
    body.category_id = parentRef.value.id_category;

  if(edit.value && external) {
    return layersStore.edit(external, body)
      .then(res => {
        refreshValues(body);
        resetForm();
        closeModal();
      })
      .catch(error => console.log(error));
  } else {
    return layersStore.add(body, file, styles)
      .then(res => {
        resetForm();
        closeModal();
        
        if(parentRef.value) {
          if(parentRef.value.layers) {
            parentRef.value.layers.push(res.data);
          } else {
            parentRef.value.layers = [];
            parentRef.value.layers.push(res.data);
          }
        }
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
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting, handleReset, values }" ref="form" method="POST">
              <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                  <h2 class="text-lg font-semibold leading-5 text-gray-900">
                    {{ edit ? 'Editar':'Nueva' }} capa
                  </h2>
                  <p class="text-sm leading-6 text-gray-600">
                    {{ edit ? 'Edita':'Ingresa' }} la información relacionada a la capa.
                  </p>
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
                          for="layer_name"
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
                              id="layer_name"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="col-span-full">
                        <label
                          for="layer_type"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Tipo</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                          >
                            <Field
                              as="select"
                              name="type"
                              id="layer_type"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                              :disabled="!!object"
                            >
                              <option value="shapes" selected>Geometrías (zip)</option>
                              <option value="raster">Ráster (tif)</option>
                            </Field>
                          </div>
                        </div>
                      </div>

                      <div class="col-span-full" v-if="!object">
                        <label
                          for="layer_file"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Archivo {{ values.type === 'raster' ? 'Ráster' : 'de Geometrías' }}</label
                        >
                        <Field
                          type="file"
                          name="file"
                          id="layer_file"
                          class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          :accept="values.type === 'raster' ? '.tif' : '.zip'"
                        />
                      </div>

                      <div class="col-span-full" v-if="object?.filepath">
                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200 mt-2">
                          <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                            <div class="flex w-0 flex-1 items-center">
                              <svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                              </svg>
                              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                <span class="truncate font-medium">{{ object.filepath }}</span>
                              </div>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <button type="button" @click="download(object.filepath, object.name)" class="font-medium text-blue-600 hover:text-blue-500">Descargar</button>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="col-span-full" v-if="!object && values.type !== 'raster'">
                        <label
                          for="layer_styles"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Archivo de estilos</label
                        >
                        <Field
                          type="file"
                          name="styles"
                          id="layer_styles"
                          class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          accept=".sld"
                        />
                      </div>

                      <div class="col-span-full" v-if="object?.styles">
                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200 mt-2">
                          <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                            <div class="flex w-0 flex-1 items-center">
                              <svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                              </svg>
                              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                <span class="truncate font-medium">{{ object.styles }}</span>
                              </div>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <button type="button" @click="download(object.styles, object.name)" class="font-medium text-blue-600 hover:text-blue-500">Descargar</button>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div v-if="edit" class="sm:col-span-3">
                        <div class="relative flex items-start">
                          <div class="flex h-6 items-center">
                            <input id="layer_status" name="status" type="checkbox" :checked="status" @click="() => status = !status" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600">
                          </div>
                          <div class="ml-3 text-sm leading-6">
                            <label for="layer_status" class="font-medium text-gray-900">Activo</label>
                          </div>
                        </div>
                      </div>

                      <template v-if="values.type === 'raster'">
                        <div class="col-span-full">
                          <hr class="mb-2" />
                          <p class="pl-2 block text-sm font-bold leading-6 text-gray-500 uppercase">Leyendas</p>
                          <hr class="mt-2" />
                        </div>

                        <div class="col-span-full">
                          <div v-for="(field, idx) in legends" :key="idx" class="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6 items-end mb-4">
                            <div class="col-span-full">
                              <label
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >{{ `Leyenda #${idx+1}` }}</label
                              >
                            </div>
                            <div class="col-span-2">
                              <label
                                :for="`legend_color_${idx}`"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Color</label
                              >
                              <input 
                                type="color"
                                :id="`legend_color_${idx}`"
                                autocomplete="off"
                                :name="`legends[${idx}].color`"
                                class="block w-full rounded-md border-0 h-[36px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                v-model="legends[idx].color"
                              >
                            </div>
                            <div class="col-span-3">
                              <label
                                :for="`legend_description_${idx}`"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Leyenda</label
                              >
                              <input 
                                type="text"
                                :id="`legend_description_${idx}`"
                                autocomplete="off"
                                :name="`legends[${idx}].description`"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                v-model="legends[idx].description"
                              />
                            </div>
                            <div class="col-span-1">
                              <button type="button" @click="deleteField(idx)" class="rounded-md bg-white px-4 py-[11px] text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="col-span-full text-right">
                          <button @click="addField()" type="button" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Agregar
                          </button>
                        </div>
                      </template>
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
                  {{ edit ? 'Guardar cambios':'Crear capa' }}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
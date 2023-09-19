<script setup>
// vue imports
import { ref } from "vue";

// store imports
import { useFilesStore } from '../stores/files.store'

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

const schema = Yup.object().shape({
  external: Yup.string(),
  name: Yup.string().required("El nombre es requerido"),
  type: Yup.string(),
  fileZip: Yup.mixed(),
  fileJSON: Yup.mixed(),
  legends: Yup.array().of(
    Yup.object().shape({
      color: Yup.string().required("El color es requerido"),
      description: Yup.string().required("La leyenda es requerida"),
    }),
  ),
  extent: Yup.object().shape({
    west: Yup.number(),
    south: Yup.number(),
    east: Yup.number(),
    north: Yup.number(),
  }),
  style: Yup.object().shape({
    type: Yup.string(),
    circle: Yup.object().shape({
      radius: Yup.number(),
      fill: Yup.object().shape({
        color: Yup.string(),
      })
    }),
    stroke: Yup.object().shape({
      color: Yup.string(),
      width: Yup.number(),
    }),
    fill: Yup.object().shape({
      color: Yup.string(),
    }),
  }),
});

const openModal = (item, type, parent) => {
  object.value = item;
  parentRef.value = parent;
  edit.value = (type === 'edit');

  if(item) {
    form.value.setFieldValue('name', item.name);
    form.value.setFieldValue('external', item.external_id);
    form.value.setFieldValue('type', item.type);
    if(item.type === 'vector') {
      form.value.setFieldValue('style.type', item.properties?.type);
      if(item.properties?.type === 'plain') {
        form.value.setFieldValue('style.stroke', item.properties?.stroke);
        form.value.setFieldValue('style.fill', item.properties?.fill);
      }
      if(item.properties?.type === 'circle') {
        form.value.setFieldValue('style.circle', item.properties?.circle);
      }
    }
    if(item.type === 'raster') {
      form.value.setFieldValue('extent', item.extent);
    }
    form.value.setFieldValue('legends', item.legends || [{ color: '#0062FF', description:'' }]);
    status.value = item.status;
  } else {
    form.value.setFieldValue('type', 'vector');
    form.value.setFieldValue('legends', [{ color: '#0062FF', description:'' }]);
    form.value.setFieldValue('style.type', 'plain');
    form.value.setFieldValue('style.stroke.width', 0.4);
    form.value.setFieldValue('style.stroke.color', '#000000');
    form.value.setFieldValue('style.fill.color', '#0062FF');
    form.value.setFieldValue('style.circle.fill.color', '#0062FF');
    form.value.setFieldValue('style.circle.radius', 7);
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

const handleFile = (evt) => {
  let name = evt.target?.value?.split('\\');
  console.log(evt.target.files[0])
  if(name && name.length > 0) {
    form.value.setFieldValue('name', name[name.length - 1]);
  } else {
    form.value.setFieldValue('name', '');
  }
}

const handleTypeObject = (type) => {
  if(type === 'vector') {
    form.value.setFieldValue('style.type', 'plain');
    form.value.setFieldValue('style.stroke.width', 0.4);
    form.value.setFieldValue('style.stroke.color', '#0062FF');
    form.value.setFieldValue('style.fill.color', '#0062FF');
    form.value.setFieldValue('style.circle.color.fill', '#0062FF');
    form.value.setFieldValue('style.circle.radius', 7);
  } else {    
    form.value.setFieldValue('extent.west', '');
    form.value.setFieldValue('extent.south', '');
    form.value.setFieldValue('extent.east', '');
    form.value.setFieldValue('extent.north', '');
  }
}

const refreshValues = (data, zip, json) => {
  object.value.name = data.name;
  object.value.type = data.type;
  object.value.status = status.value;
  object.value.properties = data.properties;
  object.value.extent = data.extent;
  object.value.legends = data.legends;
  object.value.updated_at = data.updated_at;
  if(zip) 
    object.value.path_zip = zip;
  if(json)
    object.value.path_json = json;
}

function download(path, name) {
  let filesStore = useFilesStore();
  filesStore.download(path)
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

function onSubmit(values, { setErrors, resetForm }) {
  const filesStore = useFilesStore();
  const {
    extent,
    external,
    fileJSON,
    fileZip,
    legends,
    name,
    style,
    type
  } = values;

  let body = {
    name: name,
    type: type,   
    status: status.value,
    legends: legends,
  }

  if(type === 'vector') {
    body.properties = {
      type: style.type,
    };

    if(style.type === 'plain') {
      body.properties.stroke = {
        color: style.stroke.color,
        width: style.stroke.width,
      };

      body.properties.fill = {
        color: style.fill.color,
      };
    }

    if(style.type === 'circle') {
      body.properties.circle = {
        radius: style.circle.radius,
        fill: {
          color: style.circle.fill.color,
        },
      }
    }
  } else if(type === 'raster') {
    body.extent = extent;
  }

  if(parentRef.value)
    body.layer_id = parentRef.value.id_layer;

  if(external)
    body.updated_at = new Date();

  if(edit.value && external) {
    return filesStore.edit(external,body,fileZip,fileJSON)
      .then(res => {
        refreshValues(body, res.data.zip, res.data.json);
        resetForm();
        closeModal();
      })
      .catch(error => console.log(error));
  } else {
    return filesStore.add(body, fileZip, fileJSON)
      .then(res => {
        resetForm();
        closeModal();

        if(parentRef.value) {
          if(parentRef.value.files) {
            parentRef.value.files.push(res.data);
          } else {
            parentRef.value.files = [];
            parentRef.value.files.push(res.data);
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
            'ease-in duration-200 opacity-0 translate-y-4 sm:scale-95':
              !showModal,
          }"
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div>
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting, resetForm, values }" ref="form" method="POST">
              <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                  <h2 class="text-lg font-semibold leading-5 text-gray-900">
                    {{ edit ? 'Editar':'Nuevo' }} archivo
                  </h2>
                  <p class="text-sm leading-6 text-gray-600">
                    {{ edit ? 'Edita':'Ingresa' }} la información relacionada al archivo.
                  </p>
                  <!-- <p>{{ errors }}</p> -->
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
                          <p class="mb-0 text-sm truncate"><span class="font-bold">Capa relacionada:</span> {{ parentRef?.name }}</p>
                        </div>
                      </div>

                      <div class="col-span-full">
                        <label
                          for="file_type"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Tipo</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                          >
                            <Field
                              as="select"
                              name="type"
                              id="file_type"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                              @change="handleTypeObject(values.type)"
                            >
                              <option value="vector" selected>Vectorial</option>
                              <option value="raster">Ráster</option>
                            </Field>
                          </div>
                        </div>
                      </div>

                      <div class="col-span-full">
                        <label
                          for="file_zip"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Archivo comprimido (zip)</label
                        >
                        <Field
                          type="file"
                          name="fileZip"
                          id="file_name"
                          class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          accept=".zip"
                          @change="handleFile"
                        />

                        <ul v-if="object" role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200 mt-2">
                          <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                            <div class="flex w-0 flex-1 items-center">
                              <svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                              </svg>
                              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                <span class="truncate font-medium">{{ object.path_zip }}</span>
                              </div>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <button type="button" @click="download(object.path_zip, object.name)" class="font-medium text-indigo-600 hover:text-indigo-500">Descargar</button>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="col-span-full">
                        <label
                          for="file_json"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Archivo {{values.type === 'vector' ?  'GeoJSON':'PNG'}}</label
                        >
                        <Field
                          type="file"
                          name="fileJSON"
                          id="file_json"
                          class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          :accept="values.type === 'vector' ? '.json,.geojson':'.png'"
                          autocomplete="off"
                        />

                        <ul v-if="object" role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200 mt-2">
                          <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                            <div class="flex w-0 flex-1 items-center">
                              <svg class="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                              </svg>
                              <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                <span class="truncate font-medium">{{ object.path_json }}</span>
                              </div>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <button type="button" @click="download(object.path_json, object.name)" class="font-medium text-indigo-600 hover:text-indigo-500">Descargar</button>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div class="col-span-full">
                        <label
                          for="file_name"
                          class="block text-sm font-medium leading-6 text-gray-900"
                          >Nombre</label
                        >
                        <div class="mt-2">
                          <div
                            class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                          >
                            <Field
                              type="text"
                              name="name"
                              id="file_name"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                      </div>

                      <template v-if="values.type !== 'raster'">
                        <div class="col-span-full">
                          <hr class="mb-2" />
                          <p class="pl-2 block text-sm font-bold leading-6 text-gray-500 uppercase">Propiedades</p>
                          <hr class="mt-2" />
                        </div>

                        <div class="col-span-full">
                          <label
                            for="file_style_type"
                            class="block text-sm font-medium leading-6 text-gray-900"
                            >Tipo Geometría</label
                          >
                          <div class="mt-2">
                            <div
                              class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                            >
                              <Field
                                as="select"
                                name="style.type"
                                id="file_style_type"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                autocomplete="off"
                              >
                                <option value="plain" selected>Plano</option>
                                <option value="circle">Punto</option>
                              </Field>
                            </div>
                          </div>
                        </div>

                        <template v-if="values.style?.type === 'plain'">
                          <div class="col-span-3">
                            <label
                              for="file_stroke_width"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Ancho de línea</label
                            >
                            <div class="mt-2">
                              <div
                                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                              >
                                <Field
                                  type="number"
                                  name="style.stroke.width"
                                  id="file_stroke_width"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                />
                              </div>
                            </div>
                          </div>

                          <div class="col-span-3">
                            <label
                              for="file_stroke_color"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Color de línea</label
                            >
                            <div class="mt-2">
                              <div
                                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                              >
                                <Field
                                  type="color"
                                  name="style.stroke.color"
                                  id="file_stroke_color"
                                  class="block w-full rounded-md border-0 h-[36px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                />
                              </div>
                            </div>
                          </div>

                          <div class="col-span-full">
                            <label
                              for="file_fill_color"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Color de fondo</label
                            >
                            <div class="mt-2">
                              <div
                                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                              >
                                <Field
                                  type="color"
                                  name="style.fill.color"
                                  id="file_fill_color"
                                  class="block w-full rounded-md border-0 h-[36px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                />
                              </div>
                            </div>
                          </div>                        
                        </template>

                        <template v-else-if="values.style?.type === 'circle'">
                          <div class="col-span-3">
                            <label
                              for="file_circle_radius"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Radio del objeto</label
                            >
                            <div class="mt-2">
                              <div
                                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                              >
                                <Field
                                  type="number"
                                  name="style.circle.radius"
                                  id="file_circle_radius"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                />
                              </div>
                            </div>
                          </div>

                          <div class="col-span-3">
                            <label
                              for="file_circle_color"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Color del objeto</label
                            >
                            <div class="mt-2">
                              <div
                                class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                              >
                                <Field
                                  type="color"
                                  name="style.circle.fill.color"
                                  id="file_circle_color"
                                  class="block w-full rounded-md border-0 h-[36px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                />
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>

                      <template v-if="values.type === 'raster'">
                        <div class="col-span-full">
                          <label
                            class="block text-sm font-medium leading-6 text-gray-900"
                            >Extensión del ráster</label
                          >
                          <div class="grid grid-cols-4 gap-x-5 mt-2">
                            <div>
                              <label
                                for="file_extent_west"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Oeste</label
                              >
                              <div class="mt-2">
                                <Field
                                  type="number"
                                  name="extent.west"
                                  id="file_extent_west"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                  placeholder="Oeste"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                for="file_extent_south"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Sur</label
                              >
                              <div class="mt-2">
                                <Field
                                  type="number"
                                  name="extent.south"
                                  id="file_extent_south"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                  placeholder="Sur"
                                />                                
                              </div>
                            </div>
                            <div>
                              <label
                                for="file_extent_east"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Este</label
                              >
                              <div class="mt-2">
                                <Field
                                  type="number"
                                  name="extent.east"
                                  id="file_extent_east"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                  placeholder="Este"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                for="file_extent_north"
                                class="block text-sm font-medium leading-6 text-gray-900"
                                >Norte</label
                              >
                              <div class="mt-2">
                                <Field
                                  type="number"
                                  name="extent.north"
                                  id="file_extent_north"
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  autocomplete="off"
                                  placeholder="Norte"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      
                      <div class="col-span-full">
                        <hr class="mb-2" />
                        <p class="pl-2 block text-sm font-bold leading-6 text-gray-500 uppercase">Leyendas</p>
                        <hr class="mt-2" />
                      </div>

                      <FieldArray name="legends" v-slot="{ fields, push, remove }">
                        <template v-for="(field, idx) in fields" :key="field.key">
                          <div class="col-span-full">
                            <label
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >{{ `Leyenda #${idx+1}` }}</label
                            >
                          </div>
                          <div class="col-span-2">
                            <label
                              :for="`file_color_${idx}`"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Color</label
                            >
                            <Field 
                              type="color"
                              :id="`file_color_${idx}`"
                              autocomplete="off"
                              :name="`legends[${idx}].color`"
                              class="block w-full rounded-md border-0 h-[36px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div class="col-span-4">
                            <label
                              :for="`file_description_${idx}`"
                              class="block text-sm font-medium leading-6 text-gray-900"
                              >Leyenda</label
                            >
                            <Field 
                              type="text"
                              :id="`file_description_${idx}`"
                              autocomplete="off"
                              :name="`legends[${idx}].description`"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </template>
                      </FieldArray>

                      <div v-if="edit" class="sm:col-span-3">
                        <div class="relative flex items-start">
                          <div class="flex h-6 items-center">
                            <input id="layer_status" name="status" type="checkbox" :checked="status" @click="() => status = !status" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
                          </div>
                          <div class="ml-3 text-sm leading-6">
                            <label for="layer_status" class="font-medium text-gray-900">Activo</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end gap-x-4">
                <button :disabled="isSubmitting"
                  @click="closeModal(resetForm)"
                  type="button"
                  class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button :disabled="isSubmitting" :class="{ 'cursor-not-allowed':isSubmitting }"
                  type="submit"
                  class="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg v-show="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ edit ? 'Guardar cambios':'Crear archivo' }}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
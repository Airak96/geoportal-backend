import { defineStore } from 'pinia';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/files`;

export const useFilesStore = defineStore({
  id: 'files',
  state: () => ({
    files: {},
  }),
  actions: {
    async getAll() {
      this.files = { loading: true };
      fetchWrapper.get(`${baseUrl}/all`)
        .then(files => this.files = files)
        .catch(error => this.files = { error })
    },
    add(data, zip, json) {
      const formData = new FormData();
      formData.append('zip', zip);
      formData.append('json', json);
      formData.append('fileProps', JSON.stringify(data));
      return fetchWrapper.post(`${baseUrl}/`, formData)
    },
    get(id) {
      return fetchWrapper.get(`${baseUrl}/get/${id}`)
    },
    edit(id, data, zip, json) {
      const formData = new FormData();
      formData.append('zip', zip);
      formData.append('json', json);
      formData.append('fileProps', JSON.stringify(data));
      return fetchWrapper.put(`${baseUrl}/${id}`, formData)
    },
    remove(id) {
      return fetchWrapper.delete(`${baseUrl}/${id}`)
    },
    download(path) {
      return fetchWrapper.files(`${baseUrl}/download/${path}`)
    },
  }
})
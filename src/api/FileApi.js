import apiClient from './apiClient';

const FileApi = {
  // obtener todos los archivos
  getAll: async () => {
    const res = await apiClient.get('/FileModels');
    return res.data;
  },

  // obtener un archivo por id
  getById: async (id) => {
    const res = await apiClient.get(`/FileModels/${id}`);
    return res.data;
  },

  // subir archivo con referencia
  upload: async (file, tableName, referenceId) => {
    const formData = new FormData();

    formData.append('File', file);
    formData.append('TableName', tableName);
    formData.append('ReferenceId', referenceId);

    const res = await apiClient.post('/FileModels/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },

  // buscar archivos
  search: async (query) => {
    const res = await apiClient.get(`/FileModels/search?query=${query}`);
    return res.data;
  },

  // obtener archivos por tabla y referencia
  getByReference: async (tableName, referenceId) => {
    const res = await apiClient.get(
      `/FileModels/by-reference?tableName=${tableName}&referenceId=${referenceId}`
    );
    return res.data;
  },

  // eliminar archivo
  delete: async (id) => {
    const res = await apiClient.delete(`/FileModels/${id}`);
    return res.data;
  },
};

export default FileApi;

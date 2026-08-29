import apiClient from './apiClient';

/**
 * Webhooks salientes.
 *
 * El catálogo de eventos y de campos lo manda el backend (`/events`): es él
 * quien publica los eventos, así que es la única fuente fiable de qué se
 * puede escuchar y con qué datos.
 */
const webhooksApi = {
  /** Eventos disponibles y los campos que trae cada uno. */
  getEvents: () => apiClient.get('/Webhooks/events'),

  getAll: () => apiClient.get('/Webhooks'),

  getById: (id) => apiClient.get(`/Webhooks/${id}`),

  create: (webhook) => apiClient.post('/Webhooks', webhook),

  update: (id, webhook) => apiClient.put(`/Webhooks/${id}`, webhook),

  remove: (id) => apiClient.delete(`/Webhooks/${id}`),

  /** Bitácora de envíos, del más reciente al más antiguo. */
  getDeliveries: (id, take = 50) =>
    apiClient.get(`/Webhooks/${id}/deliveries`, { params: { take } }),

  /** Envío de prueba con datos de ejemplo. Es síncrono: devuelve el resultado. */
  test: (id, evento) =>
    apiClient.post(`/Webhooks/${id}/test`, null, { params: { evento } }),

  /** Cuerpo que se enviaría, sin enviar nada. */
  preview: (webhook, evento) =>
    apiClient.post('/Webhooks/preview', webhook, { params: { evento } }),
};

export default webhooksApi;

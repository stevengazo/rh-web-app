import apiClient from './apiClient';

/**
 * Mensajería interna. No hay tiempo real: el cliente refresca por sondeo.
 * Todos los métodos devuelven la respuesta Axios completa (convención del repo).
 */
const messagingApi = {
  /** Bandeja del usuario: conversaciones con último mensaje y no leídos. */
  getConversations: (userId) =>
    apiClient.get('/Messaging/conversations', { params: { userId } }),

  /** Total de mensajes sin leer, para el distintivo global. */
  getUnread: (userId) =>
    apiClient.get('/Messaging/unread', { params: { userId } }),

  /** Cabecera y participantes de una conversación. */
  getConversation: (id, userId) =>
    apiClient.get(`/Messaging/conversations/${id}`, { params: { userId } }),

  /**
   * Mensajes de una conversación (cronológico ascendente).
   * @param {{ userId, beforeId?, afterId?, take? }} params
   */
  getMessages: (id, params) =>
    apiClient.get(`/Messaging/conversations/${id}/messages`, { params }),

  /** Abre (o reutiliza) la conversación directa con otra persona. */
  startDirect: (userId, otherUserId) =>
    apiClient.post('/Messaging/conversations/direct', { userId, otherUserId }),

  /** Crea un grupo. */
  startGroup: (userId, title, participantIds) =>
    apiClient.post('/Messaging/conversations/group', {
      userId,
      title,
      participantIds,
    }),

  sendMessage: (id, userId, body) =>
    apiClient.post(`/Messaging/conversations/${id}/messages`, { userId, body }),

  markRead: (id, userId) =>
    apiClient.post(`/Messaging/conversations/${id}/read`, { userId }),

  editMessage: (messageId, userId, body) =>
    apiClient.put(`/Messaging/messages/${messageId}`, { userId, body }),

  deleteMessage: (messageId, userId) =>
    apiClient.delete(`/Messaging/messages/${messageId}`, { params: { userId } }),

  addParticipants: (id, userId, participantIds) =>
    apiClient.post(`/Messaging/conversations/${id}/participants`, {
      userId,
      participantIds,
    }),

  leave: (id, userId) =>
    apiClient.post(`/Messaging/conversations/${id}/leave`, { userId }),
};

export default messagingApi;

import { AuthStore, QueryHandler } from '@scofez/easy-auth';

// Initialize the Store with cookie name
export const authStore = new AuthStore('chat_rooms_token');

// Initialize the QueryHandler with your backend URL
// We pass a function () => authStore.getToken() so QueryHandler 
// always gets the LATEST token from the store.
export const queryHandler = new QueryHandler(
  { 
    baseURL: 'http://localhost:5000/api', 
    tokenKey: 'chat_rooms_token' 
  },
  () => authStore.getToken()
);
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(Toast, {
  position: POSITION.BOTTOM_LEFT,
  timeout: 2000,
});

app.mount('#app');

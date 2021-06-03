import { createApp } from 'vue';
import InspireCloud from '@byteinspire/js-sdk';
import App from './App.vue';
import router from './router';
import Vant from 'vant';
import 'vant/lib/index.css';
import '@vant/touch-emulator';

const app = createApp(App);
app.use(router).use(Vant).mount('#app');

// 创建轻服务实例
app.config.globalProperties.$cloud = new InspireCloud({ serviceId: 'qckesw' });

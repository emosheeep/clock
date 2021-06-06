import { createApp } from 'vue';
import InspireCloud from '@byteinspire/js-sdk';
import App from './App.vue';
import router from './router';
import store from './store';
import useVant from '@/plugins/vant';

import '@/reset.styl';

const app = createApp(App).use(store).use(router);
useVant(app);
app.mount('#app');

// 创建轻服务实例
export const cloud = new InspireCloud({ serviceId: 'qckesw' });

app.config.globalProperties.$cloud = cloud;

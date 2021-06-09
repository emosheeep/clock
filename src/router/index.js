import { createRouter, createWebHistory } from 'vue-router';
import { Toast } from 'vant';
import storage from 'store';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/form',
    name: 'Form',
    component: () => import('@/views/SignForm.vue'),
  },
  {
    path: '/init',
    name: 'Init',
    component: () => import('@/views/InitUserInfo.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const whiteList = ['/init'];
router.beforeEach(to => {
  const uid = storage.get('uid');
  if (whiteList.includes(to.path)) return;
  if (!uid) {
    Toast('请先初始化');
    return '/init';
  };
});

export default router;

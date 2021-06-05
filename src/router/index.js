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
    component: () => import('@/views/SignIn.vue'),
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
router.beforeEach(async (to, from, next) => {
  const uid = storage.get('uid');
  if (whiteList.includes(to.path)) return next();
  if (!uid) {
    Toast('请先初始化');
    return next('/init');
  };

  next();
});

export default router;

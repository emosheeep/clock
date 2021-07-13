import { createRouter, createWebHistory } from 'vue-router';
import { Toast } from 'vant';
import storage from 'store';
import Home from '@/views/Home.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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
  {
    path: '/offer',
    name: 'Offer',
    component: () => import('@/views/Offer.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const whiteList = ['/init', '/offer'];
router.beforeEach(to => {
  NProgress.start();
  const uid = storage.get('uid');
  if (whiteList.includes(to.path)) return;
  if (!uid) {
    Toast('请先初始化');
    return '/init';
  };
});

router.afterEach(() => {
  NProgress.done();
});

export default router;

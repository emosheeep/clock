import { createRouter, createWebHistory } from 'vue-router';
import storage from 'store';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/init',
    name: 'init',
    component: () => import('@/views/Init.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const whiteList = ['init'];
router.beforeEach((to, from, next) => {
  const sid = storage.get('sid');
  if (whiteList.includes(to.name)) {
    next();
  } else if (!sid) {
    next('/init');
  } else next();
});

export default router;

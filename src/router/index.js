import { createRouter, createWebHistory } from 'vue-router';
import { Toast } from 'vant';
import storage from 'store';
import store from '@/store';
import Home from '@/views/Home.vue';
import { cloud } from '@/main';

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
router.beforeEach(async (to, from, next) => {
  const uid = storage.get('uid') || '8002117359';
  if (whiteList.includes(to.name)) return next();
  if (!uid) {
    Toast('请先初始化');
    return next('/init');
  };

  try {
    const data = await cloud.run('getUserInfo', { userId: uid });
    if (data.code !== 0) throw data;
    store.commit('initUser', data.data);
  } catch (e) {
    Toast.fail(e.msg || '用户信息获取失败');
    console.error(e);
  }

  next();
});

export default router;

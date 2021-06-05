import { reactive } from 'vue';
import { cloud } from '@/main';
import { Toast, Notify } from 'vant';
import { pick } from 'lodash-es';
import storage from 'store';
import router from '@/router';

export function useUserInfo(state = {}) {
  const formData = reactive(state);
  const toast = Toast.loading();
  const uid = storage.get('uid');
  const error = msg => {
    Notify({ message: msg, type: 'danger' });
    storage.remove('uid');
    router.replace('/init');
  };
  cloud.run('getUserInfo', { userId: uid })
    .then(data => {
      if (data.code !== 0) throw data;
      const user = data.data;
      Object.assign(formData, pick(data.data, Object.keys(formData)));

      if (user.status?.message === '用户无权访问') {
        error(user.status.message || '请重新初始化');
      }
    }).catch(e => {
      console.error(e);
      error(e.msg || '用户信息获取失败');
    }).finally(() => {
      toast.clear();
    });

  return formData;
}

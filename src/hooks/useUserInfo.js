import { reactive } from 'vue';
import { cloud } from '@/main';
import { Toast, Notify } from 'vant';
import { pick } from 'lodash-es';
import storage from 'store';
import router from '@/router';

export function useUserInfo(state = {}) {
  const formData = reactive(state);
  const toast = Toast.loading();
  const error = msg => Notify({ message: msg, type: 'danger' });
  cloud.run('getUserInfo', { userId: storage.get('uid') })
    .then(data => {
      const user = data.data;
      if (data.code !== 0) {
        return error(data.msg || '用户信息获取失败');
      }
      if (user.status?.message === '用户无权访问') {
        error(user.status.message || '请重新初始化');
        storage.remove('uid');
        router.replace('/init');
        return;
      }
      Object.assign(formData, pick(data.data, Object.keys(formData)));
    }).catch(e => {
      console.error(e);
    }).finally(() => {
      toast.clear();
    });

  return formData;
}

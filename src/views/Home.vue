<template>
  <van-nav-bar title="打卡助手" />
  <van-cell-group title="基本信息">
    <van-cell
      center
      title="当前用户"
      label="点击填写详细信息"
      is-link
      to="/form"
      :value="currentUser"
    />
    <van-cell
      center
      title="今日打卡情况"
      is-link
      label="点击立即打卡"
      @click="signIn"
    >
      <van-loading v-if="loading" size="20px" />
      <van-tag v-else-if="status" v-text="status.message" :type="status.type" />
      <span v-else>暂未打卡</span>
    </van-cell>
  </van-cell-group>
  <van-cell-group title="其他">
    <van-cell title="切换用户" is-link @click="resetCurrentUser" />
  </van-cell-group>
</template>

<script>
import storage from 'store';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ref, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, Toast } from 'vant';
import { cloud } from '@/main';

export default {
  setup() {
    const router = useRouter();
    const uid = storage.get('uid');
    const user = useUserInfo({ status: null, userName: '' });
    const loading = ref(false);
    const currentUser = computed(() => `${uid}/${user.userName}`);

    async function resetCurrentUser() {
      try {
        await Dialog.confirm({
          title: '确认切换？',
          message: '需重新初始化',
        });
        storage.remove('uid');
        router.push('/init');
      } catch (e) {}
    }
    async function signIn() {
      if (user.status?.type === 'success') {
        return Toast('今日已打卡');
      }
      if (loading.value) return;
      loading.value = true;
      const status = { message: '', type: 'success' };
      try {
        const data = await cloud.run('signIn', { id: uid });
        status.message = data.msg;
        status.type = 'success';
        if (data.code !== 0) throw data;
        Toast('打卡成功');
      } catch (e) {
        Toast(e.msg || '打卡失败');
        console.error(e);
        status.type = 'danger';
      } finally {
        loading.value = false;
        user.status = status;
      }
    }
    return {
      uid,
      currentUser,
      resetCurrentUser,
      signIn,
      loading,
      ...toRefs(user),
    };
  },
};
</script>

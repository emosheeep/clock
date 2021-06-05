<template>
  <van-nav-bar title="打卡助手" />
  <van-cell-group title="基本信息">
    <van-cell
      title="当前用户"
      label="点击填写详细信息"
      is-link
      :value="uid"
      @click="jumpToForm"
    />
    <van-cell title="今日打卡情况" is-link label="点击立即打卡" value="内容" />
  </van-cell-group>
  <van-cell-group title="其他">
    <van-cell title="清除本地缓存" is-link @click="resetCurrentUser" />
  </van-cell-group>
</template>

<script>
import storage from 'store';
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';

export default {
  setup() {
    const router = useRouter();

    function jumpToForm() {
      router.push('/form');
    }
    async function resetCurrentUser() {
      try {
        await Dialog.confirm({
          title: '确认清除？',
          message: '清除后需重新初始化',
        });
        storage.remove('uid');
        router.push('/init');
      } catch (e) {}
    }
    return {
      uid: storage.get('uid'),
      jumpToForm,
      resetCurrentUser,
    };
  },
};
</script>

<template>
  <van-dialog v-model:show="show" title="初始化" :beforeClose="beforeClose">
    <van-form ref="formRef">
      <van-field
        v-model="url"
        required
        label="电子ID地址"
        placeholder="请粘贴电子ID地址"
        :rules="[{ validator: urlValidator }]"
      />
    </van-form>
  </van-dialog>
</template>

<script>
import storage from 'store';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { cloud } from '@/main';

export default {
  name: 'InitUserInfo',
  setup() {
    const router = useRouter();
    const url = ref('');
    const show = ref(false);
    const formRef = ref();
    let code;

    onMounted(() => { show.value = true; });

    function urlValidator(value) {
      if (!value) return '请粘贴电子ID地址';
      try {
        const baseUrl = new URL(url.value);
        code = baseUrl.searchParams.get('code');
        if (!code) {
          return 'Url应包含code参数';
        }
      } catch (e) {
        return 'Url格式有误';
      }
    }

    async function beforeClose() {
      try {
        await formRef.value.validate();
      } catch (e) {
        console.error(e);
        return;
      }

      try {
        const data = await cloud.run('initUserInfo', { code });
        if (data.code !== 0) {
          url.value = '';
          throw data;
        }
        storage.set('uid', data.data.userId);
        router.replace('/');
      } catch (e) {
        Toast.fail(e.msg || '初始化失败');
        console.error(e);
      }
    }

    return {
      show,
      url,
      formRef,
      beforeClose,
      urlValidator,
    };
  },
};
</script>

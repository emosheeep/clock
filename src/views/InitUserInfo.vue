<template>
  <van-dialog
    v-model:show="show"
    title="电子ID界面地址"
    :beforeClose="beforeClose"
  >
    <van-form ref="formRef">
      <van-field
        v-model="url"
        required
        placeholder="请粘贴，点击右侧图标查看提示"
        right-icon="question-o"
        :rules="[{ validator: urlValidator }]"
        @click-right-icon="clickRightIcon"
      />
    </van-form>
  </van-dialog>
</template>

<script>
import storage from 'store';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast, Dialog } from 'vant';
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
      if (!value) return '请粘贴电子ID界面地址';
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
        router.replace('/form');
      } catch (e) {
        Toast.fail(e.msg || '初始化失败');
        console.error(e);
      }
    }

    function clickRightIcon() {
      Dialog.alert({
        title: '地址获取方法',
        messageAlign: 'left',
        message: [
          '在南昌大学企业微信中打开电子ID界面，点击右上角并在弹出的菜单中选择🔗复制链接，然后粘贴到输入框中。',
          '初始化一次可使用5天左右，若初始化失败，可尝试退出并重新进入电子ID界面。链接示例：http://jc.ncu.edu.cn/?code=xxx',
        ].join('\n'),
      });
    }

    return {
      show,
      url,
      formRef,
      beforeClose,
      urlValidator,
      clickRightIcon,
    };
  },
};
</script>

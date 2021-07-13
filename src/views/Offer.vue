<template>
  <van-sticky>
    <van-nav-bar
      title="字节跳动内推"
      left-text="返回"
      left-arrow
      @click-left="$router.replace('/')"
    />
  </van-sticky>
  <van-swipe
    ref="swiper"
    :autoplay="3000"
    lazy-render
    height="200"
    @click="preview"
  >
    <van-swipe-item v-for="image in images" :key="image">
      <img :src="image" style="width: 100%" />
    </van-swipe-item>
  </van-swipe>
  <van-cell-group inset title="内推信息">
    <van-cell
      id="code"
      title="内推码"
      clickable
      label="点击复制"
      :value="code"
      :data-clipboard-text="code"
    />
    <van-cell title="内推链接" :label="url" is-link @click="open" />
  </van-cell-group>
  <div style="font-size: 12px; margin: 16px">
    说明：内推码用于在自己提交简历时候填写，若使用上方内推链接进行简历投递，系统将会自动附带内推码，无需手动填写。
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ImagePreview, Toast } from 'vant';
import ClipboardJS from 'clipboard';

const url = 'https://job.toutiao.com/s/esf3SC1';
const code = 'J4U91EU';

export default {
  setup() {
    const swiper = ref();
    const images = [1, 2, 3, 4, 5].map(n => `/images/offer/${n}.png`);
    function preview() {
      ImagePreview({
        images,
        showIndicators: true,
        startPosition: swiper.value.state.active,
      });
    }

    onMounted(() => {
      const clipboard = new ClipboardJS('#code');
      clipboard.on('success', e => {
        Toast('内推码已经复制');
        e.clearSelection();
      });
    });

    return {
      swiper,
      images,
      preview,
      url,
      code,
      open: () => window.open(url, '_blank'),
    };
  },
};
</script>

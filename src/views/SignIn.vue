<template>
  <!-- 导航栏 -->
  <van-nav-bar
    title="基本信息"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
  <!-- 表单 -->
  <van-form ref="formRef" class="form-container">
    <van-field
      v-model="formData.userId"
      required
      disabled
      name="学号"
      label="学号"
      placeholder="学号"
      :rules="[{ required: true, message: '请填写学号' }]"
    />
    <van-field
      v-model="formData.userName"
      required
      disabled
      label="姓名"
      placeholder="姓名"
    />
    <!-- 地区选择 -->
    <van-field
      v-model="addressStr"
      required
      readonly
      clickable
      name="area"
      label="地区选择"
      placeholder="点击选择省市"
      @click="toggleAreaShow"
    />
    <van-popup v-model:show="state.showArea" position="bottom">
      <van-area
        ref="areaRef"
        :area-list="areaList"
        :columns-num="2"
        @cancel="toggleAreaShow"
        @confirm="confirmAreaSelect"
      />
    </van-popup>
    <!-- 详细地址 -->
    <van-field
      v-model="formData.addressInfo"
      required
      name="addressInfo"
      label="详细地址"
      placeholder="详细地址"
      :rules="[{ required: true, message: '请填写详细地址' }]"
    />
    <!-- 是否毕业生 -->
    <van-field name="isGraduate" label="是否毕业生">
      <template #input>
        <van-radio-group v-model="formData.isGraduate" direction="horizontal">
          <van-radio name="是">是</van-radio>
          <van-radio name="否">否</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-button
      type="primary"
      block
      :loading="state.loading"
      style="margin-top: 20px"
      @click="submit"
    >
      提交
    </van-button>
  </van-form>
</template>

<script>
import { reactive, computed, ref, nextTick } from 'vue';
import { omit, invert } from 'lodash-es';
import { useRouter } from 'vue-router';
import { areaList } from '@vant/area-data';
import { Toast } from 'vant';
import { cloud } from '@/main';
import { useUserInfo } from '@/hooks/useUserInfo';

export default {
  name: 'SignIn',
  setup() {
    const router = useRouter();
    const state = reactive({
      loading: false,
      showArea: false,
      areaCache: '',
    });

    const formData = useUserInfo({
      userId: '',
      userName: '',
      isGraduate: '否',
      addressProvince: '',
      addressCity: '',
      addressInfo: '',
    });

    const cityMap = invert(areaList.city_list);
    const areaRef = ref(); // 地区选择组件的引用
    // 省市字符串拼接
    const addressStr = computed(() => `${formData.addressProvince}-${formData.addressCity}`);

    function toggleAreaShow() {
      state.showArea = !state.showArea;
      if (state.showArea) {
        // 调整地区选择框的位置
        nextTick(() => {
          const { addressCity: city } = formData;
          areaRef.value.reset(cityMap[city]);
        });
      }
    }
    function confirmAreaSelect(params) {
      const [province, city] = params;
      formData.addressProvince = province.name;
      formData.addressCity = city.name;
      toggleAreaShow();
    }

    const formRef = ref();
    async function submit() {
      try {
        await formRef.value.validate();
      } catch (e) { return; }
      try {
        state.loading = true;
        const params = omit(formData, ['userName']);
        const data = await cloud.run('setUserData', params);
        if (data.code !== 0) throw data;
        Toast.success('提交成功');
        router.push('/');
      } catch (e) {
        Toast.fail(e.msg || '提交失败');
        console.error(e);
      } finally {
        state.loading = false;
      }
    }

    return {
      state,
      formData,
      areaList,
      confirmAreaSelect,
      addressStr,
      toggleAreaShow,
      areaRef,
      submit,
      formRef,
      onClickLeft: () => router.replace('/'),
    };
  },
};

</script>

<style lang="stylus" scoped>
.form-container
  padding 16px
</style>

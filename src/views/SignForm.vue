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
      label="详细地址"
      placeholder="详细地址"
      :rules="[{ required: true, message: '请填写详细地址' }]"
    />
    <!-- 是否毕业生 -->
    <van-field label="是否毕业生">
      <template #input>
        <van-radio-group v-model="formData.isGraduate" direction="horizontal">
          <van-radio name="是">是</van-radio>
          <van-radio name="否">否</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <!-- 通知设置 -->
    <van-cell-group title="通知设置">
      <van-field label="接收通知">
        <template #input>
          <van-switch v-model="formData.message.status" size="20" />
        </template>
      </van-field>
      <!-- 邮箱填写 -->
      <template v-if="formData.message.status">
        <van-field label="通知类型">
          <template #input>
            <van-radio-group
              v-model="formData.message.type"
              direction="horizontal"
            >
              <van-radio name="always">总是通知</van-radio>
              <van-radio name="fail">仅接收失败通知</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="formData.message.email"
          required
          label="邮箱"
          placeholder="用于接收打卡状态通知"
          :rules="[{ validator: emailValidator }]"
        />
      </template>
    </van-cell-group>

    <van-button
      type="primary"
      block
      :loading="state.loading"
      style="margin: 20px 0"
      @click="submit"
    >
      保存
    </van-button>

    <span style="font-size: 12px">
      说明：上述表单只填写了部分必要信息，其余信息均自动应用了合理的默认值。
      首次填写信息将会自动打卡一次，之后系统将于每天早上8:00自动打卡，并以邮件的方式通知打卡结果。
      建议填写邮箱以接收通知，若未收到，请查看是否被拦截。为避免打扰，默认只在打卡失败时进行通知。
    </span>
  </van-form>
</template>

<script>
import { reactive, computed, ref, nextTick } from 'vue';
import { invert } from 'lodash-es';
import { useRouter } from 'vue-router';
import { areaList } from '@vant/area-data';
import { Toast } from 'vant';
import { cloud } from '@/main';
import { useUserInfo } from '@/hooks/useUserInfo';
import isEmail from 'is-email';

export default {
  name: 'SignForm',
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
      message: {
        status: true,
        email: '',
        type: 'fail',
      },
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
    const emailValidator = value => isEmail(value) || '请填写正确的邮箱地址';
    async function submit() {
      try {
        await formRef.value.validate();
      } catch (e) { return; }
      try {
        state.loading = true;
        const data = await cloud.run('setUserData', formData);
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
      areaRef,
      formRef,
      areaList,
      addressStr,
      confirmAreaSelect,
      toggleAreaShow,
      submit,
      emailValidator,
      onClickLeft: () => router.replace('/'),
    };
  },
};

</script>

<style lang="stylus" scoped>
.form-container
  padding 16px
  :deep(.van-cell-group__title)
    padding-left 0
</style>

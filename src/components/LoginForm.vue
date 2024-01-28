<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model.trim="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
        :disabled="isLoading"
      />
      <van-field
        v-model.trim="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
        :disabled="isLoading"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        :disabled="isLoading"
      >
        登录
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useToast } from 'vue-toastification';

import { postFetch } from '@/utils/fetchHelper';
import { setStorage } from '@/utils/storageHelper';

import { ref, type Ref } from 'vue';

const toast = useToast();

const username: Ref<string> = ref('');
const password: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);

const userStore = useUserStore();
const BASE_URL: string = import.meta.env.VITE_BASE_URL;

const onSubmit = async () => {
  isLoading.value = true;

  try {
    const token = await postFetch(`${BASE_URL}/auth/login`, {
      username: username.value,
      password: password.value,
    });
    setStorage(
      'anti-996-token',
      JSON.stringify({
        username: username.value,
        token: token.accessToken,
      }),
    );

    isLoading.value = false;
    userStore.setUser({ username: username.value, token: token.accessToken });

    toast.success(`登录成功，欢迎: ${username.value}!`);
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      toast.error('请求失败，请检查网络后重试!');
      return;
    }

    if (error.message === 'Unauthorized' || error.message === 'Not Found') {
      toast.warning('用户名或密码错误!');
      return;
    }

    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

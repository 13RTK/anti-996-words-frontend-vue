<template>
  <Navbar />

  <component :is="componentName" />
</template>

<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import Navbar from '@/components/ui/Navbar.vue';
import Home from '@/components/home/Home.vue';

import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { getStorage } from './utils/storageHelper';

const userStore = useUserStore();
const componentName = computed(() => (userStore.isLogin ? Home : LoginForm));

onMounted(() => {
  const tokenStr: string = getStorage('anti-996-token') || '';

  if (tokenStr) {
    const token = JSON.parse(tokenStr);

    userStore.user = {
      username: token.username,
      token: token.token,
    };
  }
});
</script>

<template>
  <ConditionFilter />

  <van-list
    v-model:loading="loading"
    :finished="finished"
    :finished-text="finishedText"
    @load="loadWord"
  >
    <WordItem tabName="overview" />
  </van-list>

  <van-back-top />
  <van-floating-bubble
    icon="plus"
    magnetic="x"
    axis="xy"
    v-model:offset="offset"
    @click="openAddWord"
  />
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

import ConditionFilter from './ConditionFilter.vue';
import { getFetch } from '@/utils/fetchHelper';

import { useWordStore } from '@/stores/word';
import { useUserStore } from '@/stores/user';
import WordItem from '@/components/word/WordItem.vue';
import { deleteStorage } from '@/utils/storageHelper';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const toast = useToast();
const wordStore = useWordStore();
const userStore = useUserStore();
const token = userStore.user?.token || '';
const { overviewWordList, randomOverviewWordList, reversedOverviewWordList } =
  storeToRefs(wordStore);

const curPage: Ref<number> = ref(1);
const loading: Ref<boolean> = ref(false);
const wordsLength: Ref<number> = ref(0);
const finished: Ref<boolean> = ref(false);
const finishedText: Ref<string> = ref('没有更多了');

// Floating bubble
const offset: Ref<{ x: number; y: number }> = ref({
  x: 0.8 * window.innerWidth,
  y: 0.8 * window.innerHeight,
});

const emits = defineEmits(['change-tab']);

const openAddWord = () => {
  emits('change-tab', 'AddWord');
};

const loadWord = async () => {
  if (!overviewWordList.value.length) {
    loading.value = false;
    return;
  }

  curPage.value = curPage.value + 1;
  loading.value = true;

  const data = await getFetch(`${BASE_URL}/words?page=${curPage.value}`, token);
  overviewWordList.value.push(...data);
  randomOverviewWordList.value.push(...data);
  reversedOverviewWordList.value.push(...data);

  loading.value = false;

  if (overviewWordList.value.length >= wordsLength.value) {
    overviewWordList.value = [...new Set(overviewWordList.value)];
    finished.value = true;
  }
};

onMounted(async () => {
  try {
    const wordsLengthData = await getFetch(`${BASE_URL}/words/count`, token);
    wordsLength.value = wordsLengthData;

    const wordsData = await getFetch(
      `${BASE_URL}/words?page=${curPage.value}`,
      token,
    );

    overviewWordList.value.push(...wordsData);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      toast.clear();
      toast.error('登录已过期，请重新登录');
      userStore.user = null;

      deleteStorage('anti-996-token');
      return;
    }

    if (error.message === 'Failed to fetch') {
      toast.error('请求失败，请检查网络后重试！');
    }
    finished.value = true;
    finishedText.value = '加载失败！';
  }
});
</script>

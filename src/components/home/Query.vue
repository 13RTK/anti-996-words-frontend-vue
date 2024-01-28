<template>
  <van-cell-group inset>
    <van-field
      v-model.lazy="queryWord"
      center
      label="单词"
      placeholder="请输入单词"
      :rules="[{ required: true, message: '请填写单词' }]"
      :disabled="loading"
      @update:model-value="loadComplete = false"
    >
      <template #button>
        <van-button
          size="small"
          type="primary"
          :disabled="loading"
          @click.prevent="searchWords"
        >
          查询
        </van-button>
      </template>
    </van-field>
  </van-cell-group>
  <Loader v-show="loading" />

  <div v-show="!loading && loadComplete">
    <van-divider />
    <h1 v-if="queryWordList.length === 0" style="text-align: center">
      没有找到单词: {{ queryWord }}
    </h1>
    <WordList :loading="loading" tabName="query" v-else />
  </div>
</template>

<script setup lang="ts">
import { getFetch } from '@/utils/fetchHelper';
import { type Ref, ref } from 'vue';
import { useWordStore } from '@/stores/word';
import { useUserStore } from '@/stores/user';

import Loader from '@/components/ui/Loader.vue';
import WordList from '@/components/word/WordList.vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

const emits = defineEmits(['change-tab']);
const { queryWordList } = storeToRefs(useWordStore());
const { setQueryWordList } = useWordStore();
const userStore = useUserStore();
const { user } = userStore;
const token = user?.token || '';

const toast = useToast();

const BASE_URL = import.meta.env.VITE_BASE_URL;

const queryWord: Ref<string> = ref('');
const loading: Ref<boolean> = ref(false);
const loadComplete: Ref<boolean> = ref(false);

const searchWords = async () => {
  if (queryWord.value.length <= 1) {
    toast.clear();
    toast.warning('单词长度至少为 2');
    return;
  }

  loading.value = true;
  loadComplete.value = false;

  const queryWords = await getFetch(
    `${BASE_URL}/words/query?word=${queryWord.value}`,
    token,
  );
  setQueryWordList(queryWords);

  loadComplete.value = true;
  loading.value = false;
};
</script>

<template>
  <van-list
    v-model:loading="localLoading"
    :finished="finished"
    :finished-text="finishedText"
    @load="loadWord"
  >
    <WordItem :tabName="tabName" />
  </van-list>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import WordItem from './WordItem.vue';

const props = withDefaults(
  defineProps<{
    loading: boolean;
    finished?: boolean;
    loadWord?: Function;
    tabName: string;
    finishedText?: string;
  }>(),
  {
    finished: true,
    finishedText: '没有更多了',
  },
);

const localLoading: Ref<boolean> = ref(props.loading);
</script>

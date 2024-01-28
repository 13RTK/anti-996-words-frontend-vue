<template>
  <van-tabs v-model:active="tabName" @click="handleClickTab">
    <van-tab title="总览" name="Overview"></van-tab>
    <van-tab title="查询" name="Query"></van-tab>
    <van-tab title="添加单词" name="AddWord"></van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { ref, watch } from 'vue';

const props = defineProps<{ componentName: string }>();
const emits = defineEmits(['change-tab']);
const tabName: Ref<string> = ref(props.componentName);

const handleClickTab = () => {
  emits('change-tab', tabName.value);
};

watch(
  () => props.componentName,
  () => {
    tabName.value = props.componentName;
  },
);
</script>

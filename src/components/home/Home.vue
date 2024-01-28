<template>
  <AppTab :componentName="componentName" @change-tab="switchTab" />

  <KeepAlive>
    <component :is="tabs[componentName]" @change-tab="switchTab"></component>
  </KeepAlive>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type Ref } from 'vue';

import AppTab from './Tab.vue';
import Query from './Query.vue';
import Overview from './overview/Overview.vue';
import AddWord from './AddWord.vue';

const componentName: Ref<string> = ref('Overview');
const tabs: Record<string, any> = {
  Query,
  Overview,
  AddWord,
};

const switchTab = (value: string) => {
  componentName.value = value;
};
</script>

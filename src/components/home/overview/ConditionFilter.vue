<template>
  <van-field
    v-model="fieldValue"
    is-link
    readonly
    label="排列方式"
    placeholder="选择排列方式"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      :columns="columns"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useWordStore } from '@/stores/word';
import { Condition } from '@/model/Condition';

const columns = [
  { text: '最早添加', value: 'ASC' },
  { text: '最近添加', value: 'DESC' },
  { text: '随机', value: 'Random' },
];
const fieldValue: Ref<string> = ref('');
const showPicker: Ref<boolean> = ref(false);

const wordStore = useWordStore();
const { setCondition, shuffleOverviewArray, condition, reverseOverviewArray } =
  wordStore;

const onConfirm = ({ selectedOptions }: any) => {
  showPicker.value = false;

  if (fieldValue.value === selectedOptions[0].text) {
    return;
  }

  // Random again
  if (selectedOptions[0].value === Condition.Random) {
    shuffleOverviewArray();

    if (condition !== Condition.Random) {
      setCondition(Condition.Random);
    }

    if (!fieldValue.value) {
      fieldValue.value = '随机.';
    }
    return;
  }

  if (selectedOptions[0].value === Condition.DESC) {
    reverseOverviewArray();
  }

  fieldValue.value = selectedOptions[0].text;
  setCondition(selectedOptions[0].value);
};
</script>

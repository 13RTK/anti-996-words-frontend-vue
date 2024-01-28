<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model.trim="word"
        name="单词"
        label="单词"
        required
        placeholder="请填写单词"
        :rules="[{ required: true, message: '单词不能为空！' }]"
      />
      <van-field
        v-model="description"
        rows="2"
        autosize
        label="单词解释"
        type="textarea"
        maxlength="180"
        placeholder="请输入单词解释"
        show-word-limit
      />
      <van-field
        v-model="descriptionCN"
        rows="2"
        autosize
        label="中文解释"
        type="textarea"
        maxlength="180"
        placeholder="请输入中文解释"
        show-word-limit
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        添加
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { postFetchWithToken, getFetch } from '@/utils/fetchHelper';
import { ref } from 'vue';
import { type Ref } from 'vue';
import { useToast } from 'vue-toastification';

const emits = defineEmits(['change-tab']);
const BASE_URL = import.meta.env.VITE_BASE_URL;

const word: Ref<string> = ref('');
const description: Ref<string> = ref('');
const descriptionCN: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);

const toast = useToast();

const { user } = useUserStore();
const token = user?.token || '';

const onSubmit = async () => {
  if (word.value.length <= 1) {
    toast.warning('单词长度至少为 2');
    return;
  }

  isLoading.value = true;
  toast.info('添加中...');

  // await getFetch(
  //   `${BASE_URL}/words/create?word=${word.value}&description=${description.value}&description_cn=${descriptionCN.value}`,
  //   token,
  // );

  await postFetchWithToken(
    `${BASE_URL}/words`,
    {
      word: word.value,
      description: description.value,
      description_cn: descriptionCN.value,
    },
    token,
  );
  toast.clear();

  toast.success('添加成功');
  word.value = '';
  description.value = '';
  descriptionCN.value = '';

  isLoading.value = false;
};
</script>

<style scoped></style>

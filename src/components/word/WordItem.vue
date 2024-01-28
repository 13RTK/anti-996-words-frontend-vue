<template>
  <van-swipe-cell v-for="(word, idx) in wordsListDisplay" :key="word.id">
    <template #left v-if="tabName === 'overview'">
      <van-button
        @click="hideWord(word.id)"
        square
        type="primary"
        text="隐藏"
      />
    </template>
    <van-cell
      :border="false"
      :title="word.word"
      @click="selectWord(word)"
      class="clickable"
    />
    <template #right>
      <van-button @click="deleteWord(word)" square type="danger" text="删除" />
      <!-- TODO: Mark the word -->
      <!-- <van-button square type="primary" text="收藏" /> -->
    </template>
    <van-divider v-if="idx > 0 && !(idx % 20)" />
  </van-swipe-cell>
  <van-overlay :show="showOverlay">
    <div class="wrapper">
      <van-collapse v-model="activeDescription">
        <van-collapse-item title="EN" name="1">
          {{ currentWord.description }}
        </van-collapse-item>
        <van-collapse-item title="中文" name="2" style="width: 100%">
          {{ currentWord.description_cn }}
        </van-collapse-item>
      </van-collapse>
      <div>
        <!-- Reset the active description -->
        <van-button class="btn" type="primary" @click="closeOverlay">
          关闭
        </van-button>
        <van-button class="btn" type="success" @click="showEditWord">
          修改
        </van-button>
      </div>
    </div>
  </van-overlay>

  <van-overlay :show="showEdit">
    <van-form @submit="updateWord(currentWord)" class="wrapper">
      <van-cell-group inset>
        <van-field
          v-model.trim="currentWord.word"
          name="单词"
          label="单词"
          required
          disabled
        />
        <van-field
          v-model="currentWord.description"
          rows="2"
          autosize
          label="单词解释"
          type="textarea"
          maxlength="180"
          placeholder="请输入单词解释"
          show-word-limit
        />
        <van-field
          v-model="currentWord.description_cn"
          rows="2"
          autosize
          label="中文解释"
          type="textarea"
          maxlength="180"
          placeholder="请输入中文解释"
          show-word-limit
        />
      </van-cell-group>
      <div style="margin: 16px; display: flex">
        <van-button round block type="primary" class="btn" native-type="submit">
          提交
        </van-button>
        <van-button round block type="default" class="btn" @click="closeEdit">
          返回
        </van-button>
      </div>
    </van-form>
  </van-overlay>
</template>

<script setup lang="ts">
import { type Word } from '@/model/Word';
import { ref, type Ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { deleteFetch, patchFetch } from '@/utils/fetchHelper';
import { useWordStore } from '@/stores/word';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const toast = useToast();

const props = defineProps<{
  tabName: string;
}>();

const currentWord: Ref<Word> = ref({} as Word);
const showOverlay: Ref<boolean> = ref(false);
const showEdit: Ref<boolean> = ref(false);
const activeDescription: Ref<string[]> = ref(['1']);
const wordStore = useWordStore();
const { setQueryWordList, setOverviewWordList } = wordStore;
const { queryWordList, overviewWordList, getOverviewList, hideIDArray } =
  storeToRefs(wordStore);
const { user } = useUserStore();
const token = user?.token || '';

const wordsListDisplay = computed(() => {
  if (props.tabName === 'overview') {
    return getOverviewList.value;
  } else {
    return queryWordList.value;
  }
});
const selectWord = (word: Word) => {
  currentWord.value = word;
  showOverlay.value = true;
};

const hideWord = (id: number) => {
  hideIDArray.value.push(id);

  toast.success(
    `单词: ${
      overviewWordList.value.find((word) => word.id === id)?.word
    } 已隐藏`,
  );
};

const closeOverlay = () => {
  showOverlay.value = false;
  activeDescription.value = ['1'];
};

const deleteWord = async (word: Word) => {
  hideIDArray.value.push(word.id);

  try {
    await deleteFetch(`${BASE_URL}/words/${word.id}`, token);

    // Delete success
    // FIXME: After delete one, the query list will be display empty
    if (props.tabName === 'overview') {
      setOverviewWordList(
        overviewWordList.value.filter((word) => word.id !== word.id),
      );
    } else {
      setQueryWordList(
        queryWordList.value.filter((word) => word.id !== word.id),
      );
    }

    toast.success(`单词: ${word.word} 已删除`);
  } catch (_error: any) {
    toast.error('删除失败！');
  }
};

const updateWord = async (word: Word) => {
  try {
    patchFetch(
      `${BASE_URL}/words/${word.id}`,
      {
        word: word.word,
        description: word.description,
        description_cn: word.description_cn,
      },
      token,
    );

    toast.success(`单词: ${word.word} 修改成功`);

    closeEdit();
  } catch (error: any) {
    toast.error('修改失败');
  }
};

const showEditWord = () => {
  showOverlay.value = false;
  showEdit.value = true;
};

const closeEdit = () => {
  showOverlay.value = true;
  showEdit.value = false;
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
}

.btn {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.clickable {
  cursor: pointer;
}
.clickable:hover {
  border-width: 2px;
  border-color: #1989fa;
  border-radius: 2px;
}
</style>

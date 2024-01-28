import { defineStore } from 'pinia';
import { type Word } from '@/model/Word';
import { Condition } from '@/model/Condition';

const shuffleArray = (array: Word[]): Word[] => {
  const res: Word[] = JSON.parse(JSON.stringify(array));

  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }

  return res;
};

export const useWordStore = defineStore('word', {
  state: () => {
    return {
      queryWordList: [] as Word[],
      overviewWordList: [] as Word[],
      randomOverviewWordList: [] as Word[],
      reversedOverviewWordList: [] as Word[],
      condition: 'ASC' as Condition,
      hideIDArray: [] as number[],
    };
  },

  getters: {
    getOverviewList(): Word[] {
      if (this.condition === 'Random') {
        return this.randomOverviewWordList.filter(
          (word) => !this.hideIDArray.includes(word.id),
        );
      }

      if (this.condition === 'DESC') {
        return this.reversedOverviewWordList.filter(
          (word) => !this.hideIDArray.includes(word.id),
        );
      }

      return this.overviewWordList.filter(
        (word) => !this.hideIDArray.includes(word.id),
      );
    },
  },

  actions: {
    setOverviewWordList(wordList: Word[]) {
      this.overviewWordList = wordList;
    },

    setQueryWordList(wordList: Word[]) {
      this.queryWordList = wordList;
    },

    shuffleOverviewArray() {
      this.randomOverviewWordList = shuffleArray(this.overviewWordList);
    },

    setCondition(condition: Condition) {
      this.condition = condition;
    },

    reverseOverviewArray() {
      this.reversedOverviewWordList = [...this.overviewWordList].sort(
        (word1, word2) =>
          new Date(word2.createdAt).getTime() -
          new Date(word1.createdAt).getTime(),
      );
    },
  },
});

import { defineStore } from 'pinia';

type User = {
  username: string;
  token: string;
};

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as User | null,
    };
  },

  getters: {
    isLogin(): boolean {
      return this.user !== null;
    },
  },

  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
});

import { createStore, createLogger } from 'vuex';

const plugins = [];

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger());
}

export default createStore({
  plugins,
  state: {
    user: null,
  },
  mutations: {
    initUser(state, user) {
      state.user = user;
    },
  },
});

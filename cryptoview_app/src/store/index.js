import { createStore } from 'vuex'

export default createStore({
  state: {
    quoteData: {"name": "crypto", "children": []},
    metaData: {},
    timeFrame: "change_1h"
  },

  getters: {
    getQuoteData(state) {
      return state.quoteData;
    },
    getTimeFrame(state) {
      return state.timeFrame;
    }
  },

  mutations: {
    setQuoteData(state, _newData) {
      state.quoteData.children.push(_newData);
    },
    resetQuoteData(state) {
      state.quoteData = {"name": "crypto", "children": []};
    },
    setMetaData(state, _newData) {
      state.metaData = _newData;
    },
    setTimeFrame(state, _newData) {
      state.timeFrame = _newData;
    }
  },

  actions: {
  },

  modules: {
  }
})

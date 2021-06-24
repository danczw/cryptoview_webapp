import { createStore } from 'vuex'

export default createStore({
  state: {
    quoteData: {"name": "crypto", "children": []},
    metaData: {}
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
    }
  },
  actions: {
  },
  modules: {
  }
})

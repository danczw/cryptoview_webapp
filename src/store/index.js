import { createStore } from 'vuex'

export default createStore({
  state: {
    quoteData: {},
    metaData: {},
    transfData: {"name": "crypto", "children": []}
  },
  mutations: {
    setQuoteData(state, _newData) {
      state.quoteData = _newData;
    },
    setMetaData(state, _newData) {
      state.metaData = _newData;
    },
    addTransfData(state, _newData) {
      state.transfData.children.push(_newData);
    },
    resetTransfData(state) {
      state.transfData = {"name": "crypto", "children": []};
    }
  },
  actions: {
  },
  modules: {
  }
})

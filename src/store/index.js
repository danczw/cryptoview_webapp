import { createStore } from 'vuex'

export default createStore({
  state: {
    quoteData: {},
    metaData: {},
    transfData: {"name": "crypto", "children": []},
    marketCapShown: 0
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
    },
    addMarketCapShown(state, _newData) {
      state.marketCapShown += _newData;
    },
    resetMarketCapShown(state) {
      state.marketCapShown = 0;
    }
  },
  actions: {
  },
  modules: {
  }
})

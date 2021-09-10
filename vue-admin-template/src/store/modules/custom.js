const state = {
  leftbarVisible: false,
  rightbarVisible: false
}

const mutations = {
  setLeftbarVisible: (state, visible) => {
    state.leftbarVisible = visible
  },
  setRightbarVisible: (state, visible) => {
    state.rightbarVisible = visible
  }
}

export default {
  namespaced: true,
  state,
  mutations
}


import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userEmail: "",
    key: "",
    setUserEmail(email) {
      this.userEmail = email;
    },
    setKey(key) {
      this.key = key;
    }
  },
})
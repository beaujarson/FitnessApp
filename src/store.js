import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userEmail: "",
    setUserEmail(email) {
      this.userEmail = email;
    }
  },
})
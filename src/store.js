import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedRobots: [],
    robots: {},
    online: false,
  },
  getters: {
    selectedRobots(state) {
      return Object.values(state.robots).filter(x => x.is_active && state.selectedRobots.indexOf(x.id))
    }
  },
  mutations: {
    addRobot(state, robot) {
      // NOT SAFE FOR PRODUCTION!
      // Only for test cases
      state.robots.push(robot)
    },
    updateRobots(state, robots) {
      state.robots = robots
    },
    changeOnlineStatus(state, isOnline) {
      state.online = isOnline
    },
    toggleSelectedRobot(state, robot_id) {
      if (!state.online) return

      if (state.selectedRobots.indexOf(robot_id) > -1) {
        state.selectedRobots = state.selectedRobots.filter(x => x !== robot_id)
      } else {
        state.selectedRobots.push(robot_id)
      }
    }
  },
  actions: {
    pollServer({ commit, state }) {
      console.log('polling server')
      axios({
        method: 'get',
        url: '/',
        baseURL: 'http://localhost:5000/',
        responseType: 'json',
        timeout: 1000,
        withCredentials: false
      }).then((resp) => {
          if (!state.online) commit('changeOnlineStatus', true)
          commit('updateRobots', resp.data.robots)
        })
        .catch((err) => {
          console.log(err)
          commit('changeOnlineStatus', false)
        })
    }
  }
})

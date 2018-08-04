<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Joystick</router-link> |
      <router-link to="/calibrate">Navigation</router-link> |
      <router-link to="/about">Config</router-link>
      <div style="margin: 10px 0">the server is now <b v-if="$store.state.online" style="color: #2ecc71">online</b><b style="color: #aaa" v-else>offline</b></div>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <robot-list/>
  </div>
</template>

<script>
import RobotList from './RobotList'
import { mapActions } from 'vuex'

export default {
  data: () => {
    return { pollingHandle: 0 }
  },
  components: { RobotList },
  mounted() {
    this.pollingHandle = setInterval(this.pollServer, 50)
  },
  beforeDestroy() {
    clearInterval(this.pollingHandle)
  },
  methods: {
    ...mapActions(['pollServer'])
  }
}
</script>


<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

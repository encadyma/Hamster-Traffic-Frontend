<template>
  <div class="home">
    <div v-if="$store.state.selectedRobots.length" id="home-cpanel">
      <joystick/>
      <div>
        <robot-informlet v-for="robot in robots" :key="robot.id" :robot="robot"/>
      </div>
    </div>
    <div v-else>
      <h1>Manual Controller</h1>
      <p>Select robots from the menu to control.</p>
    </div>
  </div>
</template>

<script>
import Joystick from './Joystick'
import RobotInformlet from '../components/RobotInformlet'

export default {
  name: 'home',
  components: { Joystick, RobotInformlet },
  computed: {
    robots() {
      return Object.values(this.$store.state.robots).filter(x => x.is_active)
    }
  }
}
</script>

<style lang="scss">
#home-cpanel {
  display: flex;
  align-items: flex-start;
  max-width: 700px;
  margin: 0 auto;
  margin-bottom: 200px;
}
</style>

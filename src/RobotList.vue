<template>
    <div id="robot-list-footer" :class="{disabled: !robots.length || shouldHideBar}">
        <h1 style="cursor: pointer">
            <span @click="shouldHideBar = !shouldHideBar">My Robots </span>
            <span @click="hideInactive = !hideInactive">({{robots.length}})</span>
        </h1>
        <div id="robot-list-footer-list" v-if="robots">
            <transition-group name="list-animate" tag="div">
                <robot-tablet v-for="robot in robots" 
                    :key="robot.id" :robot="robot" 
                    :class="{selected: $store.state.selectedRobots.indexOf(robot.id) > -1}"
                    @click.native="toggleSelected(robot.id)"/>
            </transition-group>
        </div>
    </div>    
</template>
<style lang="scss">
#robot-list-footer {
    box-sizing: border-box;
    padding: 20px 40px;
    width: 100%;
    min-height: 250px;
    position: fixed;
    bottom: 0;

    background-color: #efefef;
    transition: 300ms ease;

    &.disabled {
        opacity: 0.6;
        bottom: -170px;
    }

    &.disabled:hover {
        opacity: 0.8;
    }

    h1 {
        font-size: 28px;
        padding: 0;
        margin: 0;
        text-align: left;
        margin: 0 10px;
    }
}

#robot-list-footer-list {
    display: flex;
    margin: 16px 0;

    & > div {
        display: flex;
        align-items: flex-end;
    }
}

.list-animate-enter-active, .list-animate-leave-active {
  transition: all 800ms;
}
.list-animate-enter, .list-animate-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

</style>
<script>
import RobotTablet from './components/RobotTablet'

export default {
    components: { RobotTablet },
    data: function() {
        return {
            hideInactive: true,
            shouldHideBar: false
        }
    },
    methods: {
        toggleSelected(id) {
            this.$store.commit('toggleSelectedRobot', id)
        }
    },
    computed: {
        robots() {
            if (this.hideInactive) return Object.values(this.$store.state.robots).filter(x => x.is_active)
            return Object.values(this.$store.state.robots)
        }
    }
}
</script>


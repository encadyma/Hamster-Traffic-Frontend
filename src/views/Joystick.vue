<template>
    <div id="joystick">
        <div id="joystick-grid">
            <div style="visibility: hidden;"></div>
            <div @mousedown="addModifier(KEY_UP)" @mouseup="removeModifier(KEY_UP)"
                :class="{ pressed: modifiers.indexOf(KEY_UP) > -1 }">&#8593;</div>
            <div style="visibility: hidden;"></div>
            <div @mousedown="addModifier(KEY_LEFT)" @mouseup="removeModifier(KEY_LEFT)"
                :class="{ pressed: modifiers.indexOf(KEY_LEFT) > -1 }">&#8592;</div>
            <div @mousedown="addModifier(KEY_DOWN)" @mouseup="removeModifier(KEY_DOWN)"
                :class="{ pressed: modifiers.indexOf(KEY_DOWN) > -1 }">&#8595;</div>
            <div @mousedown="addModifier(KEY_RIGHT)" @mouseup="removeModifier(KEY_RIGHT)"
                :class="{ pressed: modifiers.indexOf(KEY_RIGHT) > -1 }">&#8594;</div>
            <div @mousedown="addModifier(KEY_SPACE)" @mouseup="removeModifier(KEY_SPACE)"
                :class="{ pressed: modifiers.indexOf(KEY_SPACE) > -1 }"
                style="grid-column-start: 1; grid-column-end: 4;">Honk</div>
        </div>
        <global-events
            @keydown.87="addModifier(KEY_UP)" @keyup.87="removeModifier(KEY_UP)"
            @keydown.65="addModifier(KEY_LEFT)" @keyup.65="removeModifier(KEY_LEFT)"
            @keydown.83="addModifier(KEY_DOWN)" @keyup.83="removeModifier(KEY_DOWN)"
            @keydown.68="addModifier(KEY_RIGHT)" @keyup.68="removeModifier(KEY_RIGHT)"
            @keydown.space="addModifier(KEY_SPACE)" @keyup.space="removeModifier(KEY_SPACE)"/>
    </div>
</template>
<script>
import axios from 'axios'
import GlobalEvents from 'vue-global-events'

export default {
    components: { GlobalEvents },
    data: function () {
        return {
            KEY_LEFT: -1,
            KEY_DOWN: -2,
            KEY_UP: 2,
            KEY_RIGHT: 1,
            KEY_SPACE: -4,
            modifiers: []
        }
    },
    methods: {
        addModifier(m) {
            this.modifiers = this.modifiers.filter(x => x !== m)
            this.modifiers.push(m)
        },
        removeModifier(m) {
            this.modifiers = this.modifiers.filter(x => x !== m)
        },
        issueCommand(cmd, speed) {
            for (let selectedRobotId of this.$store.state.selectedRobots) {
                axios({
                    method: 'get',
                    url: '/post/' + selectedRobotId + '/' + cmd + '/' + speed,
                    baseURL: 'http://localhost:5000/',
                    responseType: 'json',
                    timeout: 1000,
                    withCredentials: false
                }).then(console.log)
            }
        }
    },
    watch: {
        modifiers(modifiers, _m) {
            if (modifiers.length == _m.length) return
            
            if (modifiers.indexOf(this.KEY_UP) > -1) {
                this.issueCommand('a_motor', 50)
            } else if (modifiers.indexOf(this.KEY_DOWN) > -1) {
                this.issueCommand('a_motor', -50)
            } else {
                this.issueCommand('a_motor', 0)
            }

            if (modifiers.indexOf(this.KEY_LEFT) > -1) {
                this.issueCommand('l_motor', 50)
                this.issueCommand('r_motor', 72)
            }
            
            if (modifiers.indexOf(this.KEY_RIGHT) > -1) {
                this.issueCommand('l_motor', 55)
                this.issueCommand('r_motor', 30)
            }

            if (modifiers.indexOf(this.KEY_SPACE) > -1) {
                this.issueCommand('t_tone', 30)
            } else {
                this.issueCommand('t_tone', 0)
            }
        }
    }
}
</script>
<style lang="scss">
#joystick {
    padding: 40px;
}

#joystick-grid {
    display: grid;
    grid-template-columns: repeat(3, 80px);
    grid-template-rows: repeat(2, 80px);
    grid-gap: 10px;
    margin: 0 auto;
    max-width: 260px;

    & > div {
        border-radius: 16px;
        cursor: pointer;
        font-size: 36px;
        font-weight: 600;
        box-shadow: 0 6px 12px 4px rgba(100, 100, 100, 0.05);
        padding: 12px 0;
        transition: 300ms ease;

        &:hover {
            background-color: #fafafa;
            transform: translateY(4px);
            box-shadow: 0 2px 12px 4px rgba(100, 100, 100, 0.1);
        }

        &.pressed {
            background-color: #9dc5d8;
            transform: translateY(4px);
            box-shadow: 0 2px 12px 4px rgba(100, 100, 100, 0.1);
        }
    }
}
</style>

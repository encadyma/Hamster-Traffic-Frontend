<template>
    <div id="calibrate">
        <div id="calibrate-log">
            <h3>Event Log</h3>
            <div class="log-inner">
                <div class="log-item">
                    <h1>{{currentStateName}}</h1>
                    <span v-if="selectedCalibratorId">ID #{{selectedCalibratorId}}</span>
                    <span v-else>Robot not connected</span>
                </div>
            </div>
            <br/>
            <button @click="calibrateRobot">Start Calibration</button>
            <button @click="stopRobot">Reset Calibration</button>
        </div>
    </div>
</template>

<style lang="scss">
#calibrate {
    display: flex;
    max-width: 500px;
    margin: 0 auto;
}

button {
    cursor: pointer;
    min-width: 240px;
    padding: 12px;
    border: none;
    font-size: 16px;
    margin: 8px;
    border-radius: 24px;
    background-color: #2ecc71;
    color: #cdffe1;
    font-weight: 700;
}

#calibrate-log {
}
</style>

<script>
import axios from 'axios'

export default {
    data: function () {
        return {
            selectedCalibratorId: null,
            currentState: 0,
            STATE_STOPPED: 0,
            STATE_FOLLOW_WHITE: 1,
            STATE_INTERCEPT_BLACK: 2,
            STATE_BACKOUT: 3,
            STATE_TURNING_LEFT: 4,
            STATE_TURNING_RIGHT: 5,
            STATE_TILT_LEFT: 6,
            STATE_TILT_RIGHT: 7,
            OBJECT_PATH: 0,
            OBJECT_STOP_SIGN: 1,
            OBJECT_BORDER: 2,
            objectQueue: [],
            nextDirection: 'left',
            calibrationInterval: 0,
            lastTick: 0,
            turningTimeout: 0,
            turningDelay: 3000
        }
    },
    methods: {
        calibrateRobot() {
            if (!this.$store.state.selectedRobots.length) return

            this.currentState = this.STATE_FOLLOW_WHITE
            this.selectedCalibratorId = this.$store.state.selectedRobots[0]
            this.lastTick = this.$store.state.robots[this.selectedCalibratorId].tick

            this.calibrationInterval = setInterval(this.analyzeMapTick, 10)
        },
        analyzeMapTick() {
            if (!this.$store.state.robots[this.selectedCalibratorId]) return
            const robot = this.$store.state.robots[this.selectedCalibratorId]

            if (this.currentState == this.STATE_STOPPED) return
            if (robot.left_floor < 20 && robot.right_floor < 20 && !(this.currentState == this.STATE_TURNING_LEFT || this.currentState == this.STATE_TURNING_RIGHT)) {
                this.currentState = this.STATE_INTERCEPT_BLACK
            } else if (!(robot.left_floor < 20 && robot.right_floor < 20) && this.currentState == this.STATE_INTERCEPT_BLACK) {
                this.currentState = this.STATE_FOLLOW_WHITE
            } else if (robot.right_floor < 20 && !(this.currentState == this.STATE_TURNING_LEFT || this.currentState == this.STATE_TURNING_RIGHT)) {
                this.currentState = this.STATE_TILT_LEFT
            } else if (robot.left_floor < 20 && !(this.currentState == this.STATE_TURNING_LEFT || this.currentState == this.STATE_TURNING_RIGHT)) {
                this.currentState = this.STATE_TILT_RIGHT
            }
        },
        makeLeftTurn() {
            this.currentState = this.STATE_TURNING_LEFT
            clearTimeout(this.turningTimeout)
            this.turningTimeout = setTimeout(() => {
                this.currentState = this.STATE_FOLLOW_WHITE
            }, this.turningDelay)
        },
        makeRightTurn() {
            this.currentState = this.STATE_TURNING_RIGHT
            this.turningTimeout = setTimeout(() => {
                this.currentState = this.STATE_FOLLOW_WHITE
            }, this.turningDelay)
        },
        issueCommand(cmd, speed) {
            axios({
                method: 'get',
                url: '/post/' + this.selectedCalibratorId + '/' + cmd + '/' + speed,
                baseURL: 'http://localhost:5000/',
                responseType: 'json',
                timeout: 1000,
                withCredentials: false
            }).then(console.log)
        },
        stopRobot() {
            clearTimeout(this.turningTimeout)
            clearInterval(this.calibrationInterval)
            this.currentState = this.STATE_STOPPED
            this.issueCommand('a_motor', 0)
            this.selectedCalibratorId = null
        }
    },
    watch: {
        currentState(robot_state, _robot_state) {
            if (robot_state == this.STATE_STOPPED) return
            if (robot_state == this.STATE_FOLLOW_WHITE) {
                this.issueCommand('a_motor', 50)
            } else if (robot_state == this.STATE_INTERCEPT_BLACK) {
                this.issueCommand('a_motor', 0)
                setTimeout(() => {
                    if (this.nextDirection == 'left') this.makeLeftTurn()
                    else if (this.nextDirection == 'right') this.makeRightTurn()
                    else this.currentState = this.STATE_FOLLOW_WHITE
                }, 400)
            } else if (robot_state == this.STATE_TURNING_LEFT) {
                this.issueCommand('l_motor', 50)
                this.issueCommand('r_motor', 72)
            } else if (robot_state == this.STATE_TURNING_RIGHT) {
                this.issueCommand('l_motor', 55)
                this.issueCommand('r_motor', 30)
            } else if (robot_state == this.STATE_BACKOUT) {
                this.issueCommand('a_motor', -50)
            } else if (robot_state == this.STATE_TILT_LEFT) {
                this.issueCommand('l_motor', 30)
                this.issueCommand('r_motor', 60)

                clearTimeout(this.turningTimeout)
                this.turningTimeout = setTimeout(() => {
                    this.issueCommand('l_motor', 60)
                    this.issueCommand('r_motor', 50)

                    this.turningTimeout = setTimeout(() => {
                        this.currentState = this.STATE_FOLLOW_WHITE
                    }, 100)
                }, 100)
            } else if (robot_state == this.STATE_TILT_RIGHT) {
                this.issueCommand('l_motor', 60)
                this.issueCommand('r_motor', 30)

                clearTimeout(this.turningTimeout)
                this.turningTimeout = setTimeout(() => {
                    this.issueCommand('l_motor', 50)
                    this.issueCommand('r_motor', 60)

                    this.turningTimeout = setTimeout(() => {
                        this.currentState = this.STATE_FOLLOW_WHITE
                    }, 100)
                }, 100)
            } else {
                this.issueCommand('a_motor', 0)
            }

            this.lastTick = this.$store.state.robots[this.selectedCalibratorId].tick
        }
    },
    computed: {
        currentStateName() {
            if (this.currentState == this.STATE_FOLLOW_WHITE) return 'Follow White'
            else if (this.currentState == this.STATE_INTERCEPT_BLACK) return 'Black Line'
            else if (this.currentState == this.STATE_BACKOUT) return 'Backing out'
            else if (this.currentState == this.STATE_STOPPED) return 'Stopped'
            else if (this.currentState == this.STATE_TURNING_LEFT) return 'Turning left'
            else if (this.currentState == this.STATE_TURNING_RIGHT) return 'Turning right'
            else if (this.currentState == this.STATE_TILT_LEFT) return 'Tilting left'
            else if (this.currentState == this.STATE_TILT_RIGHT) return 'Tilting right'
            return 'Unknown'
        }
    }
}
</script>

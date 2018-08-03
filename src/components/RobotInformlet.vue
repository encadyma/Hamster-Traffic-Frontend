<template>
    <div class="robot-tablet">
        <div class="subtext">ID #{{robot.id}} | TICK {{robot.tick}}</div>
        <div class="divider"></div>
        <div class="info-bubble-flex">
            <div class="info-bubble">
                <div class="ib-name">LEFT MOTOR</div>
                <div class="ib-value">{{robot.left_motor}}</div>
            </div>
            <div class="info-bubble">
                <div class="ib-name">RIGHT MOTOR</div>
                <div class="ib-value">{{robot.right_motor}}</div>
            </div>
        </div>
        <div class="info-bubble-flex">
            <div class="info-bubble">
                <div class="ib-name">LEFT LED</div>
                <div class="ib-value">{{robot.left_led}}</div>
            </div>
            <div class="info-bubble">
                <div class="ib-name">RIGHT LED</div>
                <div class="ib-value">{{robot.right_led}}</div>
            </div>
        </div>
        <div class="info-bubble-flex">
            <div class="info-bubble">
                <div class="ib-name">FLOOR LEFT</div>
                <div class="ib-value">{{robot.left_floor}}</div>
            </div>
            <div class="info-bubble">
                <div class="ib-name">FLOOR RIGHT</div>
                <div class="ib-value">{{robot.right_floor}}</div>
            </div>
        </div>
        <div class="info-bubble-flex">
            <div class="info-bubble">
                <div class="ib-name">PROXIMITY LEFT</div>
                <div class="ib-value">{{robot.left_proximity}}</div>
            </div>
            <div class="info-bubble">
                <div class="ib-name">PROXIMITY RIGHT</div>
                <div class="ib-value">{{robot.right_proximity}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['robot'],
    methods: {
        remapValue(val, localMax, fullRange) {

        }
    }
}
</script>
<style lang="scss" scoped>
.robot-tablet {
    background-color: rgb(231, 231, 231);
    text-align: left;
    padding: 20px;
    margin: 8px;
    min-width: 250px;
    transition: 200ms ease;

    .title {
        font-size: 20px;
        font-weight: 600;
    }

    .subtext {
        font-size: 14px;
        font-weight: 400;
        margin: 4px 0;
        color: rgba(0, 0, 0, .6);
    }

    .divider {
        padding: 5px 0;
    }

    .info-bubble {
        margin: 5px 0;
        .ib-name { font-size: 12px; }
        .ib-value { font-size: 24px; }
    }

    .info-bubble-flex {
        margin: 5px 0;
        .info-bubble {
            display: inline-block;
            margin: 5px 0;
            margin-right: 20px;
            min-width: 90px;
        }
    }
}
</style>

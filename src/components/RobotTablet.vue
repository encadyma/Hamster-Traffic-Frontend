<template>
    <div class="robot-tablet">
        <div class="title">Robot {{robot.id}}</div>
        <div class="subtext">ID #{{robot.id}}</div>
        <div class="divider"></div>
        <div class="status" :class="{inactive: !robot.is_active}">
            <span v-if="robot.is_active">ACTIVE</span>
            <span v-else>INACTIVE</span>
        </div>
    </div>
</template>
<script>
export default {
    props: ['robot']
}
</script>
<style lang="scss" scoped>
.robot-tablet {
    background-color: #fff;
    box-shadow: 0 2px 16px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: left;
    padding: 20px;
    margin: 8px;
    min-width: 250px;
    transition: 200ms ease;

    &:hover {
        background-color: #f8f8f8;
        cursor: pointer;
    }

    &.selected {
        background-color: #3498db;
        color: #fff;
        padding: 30px 20px;

        .subtext {
            color: rgba(255, 255, 255, .6)
        }
    }

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

    .status {
        display: inline-block;
        font-size: 14px;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 600;
        background-color: #2ecc71;
        color: #fff;
        transition: 300ms ease;

        &.inactive {
            background-color: #888;
        }
    }
}
</style>

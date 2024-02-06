<template>
    <main-container/>
</template>

<script lang="ts">
import MainContainer from './components/main-container.vue';
import settings from './game/settings';
require('./images/favicon.png');
import {defineComponent} from 'vue';

export default defineComponent({
    data() {
        return {
            showHud: settings.get('showHud') as boolean,
            showMenu: true,
            showDeathScreen: false,
            deathStats: null
        }
    },
    components: {
        mainContainer: MainContainer
    }
});
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Hind+Madurai:500|Nunito|Ubuntu:700);

#canvas {
    width: 100%;
    height: 100%;
    outline: none;
}

* {
    font-family: 'Nunito', sans-serif;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.fade-box {
    background: linear-gradient(to right bottom,#273b5e,#0f1724);
    border-radius: 4px;
}
</style>
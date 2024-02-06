<template>
    <div class="main-container">
        <skins class="fade-box"></skins>
        <playerContainer class="fade-box two"></playerContainer>
    </div>
</template>
<script lang="ts">
    import gameObject from '@/game';
    import settings from '@/game/settings';

    import PlayerContainer from './player-container.vue';
    import Skins from './skins.vue';

    import {defineComponent} from 'vue';

    /* TODO: servers, player-container, account, skins */

    export default defineComponent({
        data() {
            return {
                cursorStyleElem: null as HTMLStyleElement
            }
        },
        methods: {
            setCursorUrl(url?: string) {
                let style = !!url ? `#canvas, #hud > * { cursor: url('${url}'), auto !important; }` : null;
                let element = this.cursorStyleElem as HTMLStyleElement;
                if (!style && !!element) {
                    element.remove();
                    element = null;
                } else if (style && !element) {
                    element = document.createElement('style');
                    document.head.appendChild(element);
                }
                if (element) {
                    element.innerHTML = style;
                }
            }
        },
        components: {
            // servers: p,
            // playerContainer: Ve,
            // account: at,
            skins: Skins,
            playerContainer: PlayerContainer
        },
        created() {
            gameObject.on('set-cursor-url', (url?: string) => this.setCursorUrl(url));
        },
        mounted() {
            this.setCursorUrl(settings.get('cursorImageUrl') as string);
        }
    });
</script>
<style>
    .main-container {
        position: absolute;
        margin-left: -481px;
        margin-top: -240px;
        left: 50%;
        top: 38%;
        display: grid;
        grid-template-columns: 300px 330px 300px;
        grid-template-rows: 110px 146px 300px;
        grid-gap: 16px;
    }
</style>
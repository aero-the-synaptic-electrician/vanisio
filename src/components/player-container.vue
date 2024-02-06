<template>
    <div class="player-container">
        <div class="player-data">
            <input class="name" type="text" spellcheck="false" placeholder="Nickname" maxlength="15" :value="name" @change="onNameChanged()" @input="captureInput($event, 'name')"/>
            <input class="tag" type="text" spellcheck="false" placeholder="Tag" maxlength="15" :value="tag" @change="onTagChanged()" @input="captureInput($event, 'tag')"/>
            <input type="text" spellcheck="false" placeholder="https://skins.vanis.io/s/" maxlength="31" :value="skinUrl" @change="onSkinUrlChanged()" @input="captureInput($event, 'skinUrl')"/>
            <div class="game-buttons">
                <button class="play-button" v-bind:disabled="true" @click="play($event)">
                    <i class="fas fa-play" style="margin-right:4px;font-size:0.8rem">{{ gameState.playButtonText }}</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import gameObject from '@/game';
    import gameState from '@/game/state';
    import {logEvent} from '@/game/utils';
    import actionManager from '@/game/action-manager';

    import {defineComponent} from 'vue';
    
    export default defineComponent({
        data() {
            return {
                showSettings: false,
                showHotkeys: false,
                gameState: gameState,
                name: localStorage.getItem('nickname') || '',
                tag: localStorage.getItem('teamtag') || '',
                skinUrl: typeof localStorage.skinUrl == 'string' ? localStorage.getItem('skinUrl') : 'https://skins.vanis.io/s/vanis1'
            }
        },
        created() {
            gameObject.on('skin-click', (url: string) => {
                this.skinUrl = url;
            });
        },
        methods: {
            play(e: MouseEvent) {
                console.log(e);
                if (!(e instanceof MouseEvent) || !e.isTrusted) return;
                console.log('hi');
                if (!gameState.alive) {
                    actionManager.join();
                }
                gameObject.showMenu(false);
            },

            spectate() {
                if (gameState.alive) return;
                actionManager.spectate();
                gameObject.showMenu(false);
            },

            onNameChanged() {
                localStorage.setItem('nickname', this.name);
            },
            
            onTagChanged() {
                localStorage.setItem('teamtag', this.tag)
            },

            onSkinUrlChanged() {
                gameObject.emit('skin-url-edit', this.skinUrl);
            },
            
            captureInput(event, name?: string) {
                // TODO:
                if (!event.target.composing) {
                    /** @type {string?} */
                    const value = event.target.value;
                    
                    logEvent(0, 'capturing input for', name, '=', value);

                    switch (name) {
                        case 'name': {
                            this.name = value;
                            return;
                        }

                        case 'tag': {
                            this.tag = value;
                            return;
                        }

                        case 'skin-url': {
                            this.skinUrl = value;
                            return;
                        }
                    }
                }
            }
        }
    });
</script>

<style>
    .player-container {
        position: relative;
    }

    .player-data {
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 15px 15px;
        margin-bottom: 10px;
    }

    .row {
        display: flex;
    }

    .player-data.name {
        margin-right: 10px;
        flex: 2;
    };

    .player-data.tag {
        flex: 1;
    }
    
    .player-data> { margin-bottom: 10px; }
    
    .player-data .game-buttons{ display: flex; }
    
    .player-data .game-buttons .play-button {
        background: #b1700f;
        cursor: pointer;
        outline: none;
        border: 0;
        padding: 5px;
        color: #dadada;
        box-shadow: 0 0 1px 1px #000;
        border-radius: 4px;
        font-size: 16px;
        text-shadow: 1px 1px 2px #000;
        flex: 9;
        margin-right: 7px;
    }
    
    .player-data .game-buttons .spectate-button {
        background: #b1700f;
        cursor: pointer;
        outline: none;
        border:0;
        padding:5px;
        color:#dadada;
        box-shadow:0 0 1px 1px #000;
        border-radius:4px;
        font-size:16px;
        text-shadow:1px 1px 2px #000;
        flex:1;
    }

    .tabs {
        display:flex;
        font-size:20px;
        border-bottom:2px solid #000;
    }

    .tab {
        flex: 1;
        cursor: pointer;
        text-align: center;
        width: 55px;
        padding: 9px;
    }

    .tab:hover {
        background: rgba(0, 0, 0, .15);
    }

    .tab:not(:last-child) {
        border-right: 2px solid #000;
    }

    .tab.active {
        background: rgba(0,0,0,.5);
        color: #e08e13;
    }



</style>
<template>
    <div class="customization">
        <div class="skins">
            <li v-for="(skin, index) in skins" :key="index">
                <span class="skin-container">
                    <img :class="['skin', {selected:selectedSkinIndex === index}]" v-bind:src="skin" alt="" @click="selectSkin(index)" @contextmenu="removeSkin(index)" />
                    <i class="fas fa-times skin-remove-button" @click="removeSkin(index)"></i>
                </span>
            </li>
            <img class="skin add-skin" src="../images/skin-add.png" alt="" @click="addSkin()" />
        </div>
    </div>
</template>

<script lang="ts">
    import gameObject from '@/game';
    import {logEvent} from '@/game/utils';

    import {defineComponent} from 'vue';

    export default defineComponent({
        data() {
            return {
                selectedSkinIndex: 0 as number,
                skins: [] as string[]
            }
        },
        created() {
            gameObject.on('skin-url-edit', this.onSkinUrlChanged);
            this.skins = this.loadSkins() || this.getDefaultSkins();
            const index = +localStorage.getItem('selectedSkinIndex') || 0;
            this.selectSkin(index);
        },
        methods: {
            loadSkins(): string[] | null {
                try {
                    if (!('skins' in localStorage)) return null;
                    const skins = JSON.parse(localStorage.getItem('skins')) as string[];
                    if (!Array.isArray(skins)) {
                        logEvent(2, '\'localStorage.skins\' is not an array!');
                        return null;
                    }
                    for (let i = skins.length; i < 2; i++) {
                        skins.push('https://skins.vanis.io/s/vanis1');
                    }
                    return skins;
                } catch (e) {
                    logEvent(2, 'Error parsing saved skins', e.message);
                    return null;
                }
            },            
            getDefaultSkins() {
                return (new Array<string>(8)).fill('https://skins.vanis.io/s/vanis1');
            },
            onSkinUrlChanged(newSkinUrl: string) {
                this.$set(this.skins, this.selectedSkinIndex, newSkinUrl);
                this.saveSkins();
            },
            selectSkin(index: number) {
                this.selectedSkinIndex = index;
                localStorage.setItem('selectedSkinIndex', index.toString());
                const skinUrl = this.skins[index];
                gameObject.emit('skin-click', skinUrl);
            },
            removeSkin(index: number) {
                this.skins.splice(index, 1);
                if (this.skins.length < 2) {
                    this.skins.push('https://skins.vanis.io/s/vanis1');
                }
                this.saveSkins();
                const newIndex = Math.max(0, this.selectedSkinIndex - 1);
                this.selectSkin(newIndex);
            },
            addSkin() {
                const index: number = this.skins.length;
                this.skins.push('https://skins.vanis.io/s/vanis1');
                this.selectSkin(index);
                this.saveSkins();
            },
            saveSkins() {
                localStorage.setItem('skins', JSON.stringify(this.skins));
            }
        },
    });
</script>

<style>
    .customization {
        overflow: auto;
    }

    .skins {
        grid-gap: 15px;
        box-sizing: border-box;
        display: grid;
        grid-auto-rows: 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        min-width: 100%;
        padding: 16px;
    }

    .skin-container {
        display: flex;
        position: relative;
    }

    .skin {
        cursor: pointer;
        width: 100%;
        border-radius: 50%;
        box-shadow: 0 0 6px 2px #000;
        box-sizing: border-box;
        border: 1px solid transparent;
    }

    .skin-remove-button {
        display: none;
    }

    .skin-container:hover .skin-remove-button {
        display: inline;
        cursor: pointer;
        position: absolute;
        top: -3px;
        right: -3px;
        border-radius: 50%;
        font-size: 15px;
    }

    .skin.add-skin {
        background: radial-gradient(transparent, rgba(0, 0, 0, .54902));
    }

    .selected {
        box-shadow: 0 0 3px 1px orange;
    }
</style>
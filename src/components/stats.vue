<template>
    <div v-show="visible" class="stats">
        <div v-show="showFPS">
            FPS: {{ fps || '-' }}
        </div>        
        <div v-show="showPing">
            Ping: {{ ping || '-' }}
        </div>
        <div v-show="showPlayerMass && mass">
            Mass: {{ mass || '-' }}
        </div>
        <div v-show="showPlayerScore && score">
            Score: {{ score || '-' }}        
        </div>
        <div v-show="showCellCount && cells">
            Cells: {{ cells }}        
        </div>        
    </div>
</template>

<script lang="ts">
    import gameObject from '@/game';
    import settings from '@/game/settings';
    
    interface ChangedData {
        ping?: number;
        fps?: number;
        mass?: number;
        score?: number;
    };

    export default {
        data() {
            return {
                showFPS: false as boolean,
                showPing: false as boolean,
                showPlayerMass: false as boolean,
                showPlayerScore: false as boolean,
                showCellCount: false as boolean,
                visible: false as boolean,
                ping: 0 as number,
                fps: 0 as number,
                mass: 0 as number,
                score: 0 as number,
                cells: 0 as number
            }
        },
        methods: {
            invalidateStats() {
                this.showFPS = settings.get('showFPS') as boolean;
                this.showPlayerMass = settings.get('showPlayerMass') as boolean;
                this.showPlayerScore = settings.get('showPlayerScore') as boolean;
                this.showCellCount = settings.get('showCellCount') as boolean;
            }
        },
        created() {
            gameObject.on('stats-visible', (state: boolean) => {
                this.visible = state;
            });

            gameObject.on('stats-invalidate-shown', this.invalidateStats);
            this.invalidateStats();

            gameObject.on('cells-changed', (count: number) => {
                this.cells = count;
            });

            gameObject.on('stats-changed', (data: ChangedData) => {
                const {ping, fps, mass, score} = data;
                this.ping = ping || 0;
                this.fps = fps || 0;
                this.mass = mass ? gameObject.getMassText(mass) : 0;
                this.score = score ? gameObject.getMassText(score) : 0;
            });
        }
    };
</script>

<style>
    .stats {
        color: #fff;
        padding: 10px;
        transform-origin: top left;
    }
</style>
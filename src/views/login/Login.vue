<template>
    <div class="main">
        <rtc-header :is-logo="true" :is-login="true" @connect="toConnect()"></rtc-header>
        <div class="humanBody">
            <img class="openHuman" src="@/assets/images/image_onOpen.png" />
        </div>
        <div class="startContain" @click="startExplore()">
            <span class="startBtn">{{ $t('beginToExplore') }}</span>
        </div>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
export default {
    components: { rtcHeader },
    data() {
        return {
            connectState: true
        }
    },
    methods: {
        startExplore() {
            this.$router.push({
                name: 'loading'
            })
        },
        toConnect() {
            this.$router.push({
                name: "connect"
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/images/image_bkg.png");
    background-repeat: no-repeat;
    background-size: cover;
}

.humanBody {
    position: absolute;
    bottom: 0;
    left: 16.667vw;
}

.openHuman {
    height: 32.1875vw;
    width: 22.9167vw;
}

.startContain {
    position: absolute;
    bottom: 5.7292vw;
    right: 13.0208vw;
    width: 29.5313vw;
    height: 4.1667vw;
    background: #0075B8;
    border-radius: 2.0833vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

.startBtn {
    font-size: 1.7188vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
    line-height: 2.3438vw;
}
</style>
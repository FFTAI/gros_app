<template>
    <div class="main">
        <rtc-header :isInitialization="true" @connect="toConnect()">
            <div class="headState">
                <span class="headTxt">{{ $t('initialization') }}</span>
            </div>
        </rtc-header>
        <div class="picBox">

        </div>
        <div class="tipBox">
            <div class="item">
                <div class="point"></div>
                <span>机器人如左侧状态</span>
            </div>
            <div class="item">
                <div class="point"></div>
                <span>长按电源键3秒，等待开机自检完成</span>
            </div>
            <div class="item">
                <div class="point"></div>
                <span>待机器背部灯光蓝色呼吸闪烁后，完成初始化</span>
            </div>
        </div>
        <div class="btn">
            {{ $t('initialization') }}
        </div>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
import { mapState } from "vuex";
export default {
    components: { rtcHeader },
    computed: {
        ...mapState(["connected"])
    },
}
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    height: 100vh;
    background: #121E29;
    position: relative;
}

.headState {
    position: absolute;
    top: .875vw;
    left: 17.375vw;
    z-index: 99;

    .headTxt {
        font-size: 1.9583vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 2.7083vw;
    }
}

.picBox {
    position: absolute;
    left: 2.5833vw;
    top: 7.0833vw;
    width: 51.4167vw;
    height: 34.5vw;
    background: #D8D8D8;
    opacity: 0.31;
    border: .0417vw solid #979797;
}

.tipBox {
    position: absolute;
    right: 5.5417vw;
    top: 12.625vw;
    // width: 35.2917vw;
    height: 11.7083vw;
    font-size: 1.7083vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;

    .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 1.7083vw;

        .point {
            width: 13px;
            height: 13px;
            background: #FFFFFF;
            border-radius: 50%;
            margin-right: .75vw;
        }
    }
}

.btn {
    position: absolute;
    right: 12.5vw;
    top: 37.375vw;
    width: 28.3333vw;
    height: 4.1667vw;
    background: #0075B8;
    border-radius: 2.0833vw;
    font-size: 1.7083vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
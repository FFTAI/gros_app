<template>
    <div class="main">
        <rtc-header :isLogin="true">
            <div class="headState">
                <span class="headTxt">{{ $t('systemSettings') }}</span>
            </div>
        </rtc-header>
        <div class="tabBox">
            <div class="txt1" :class="{ 'activeTab': isActivated == 'connect' }" @click="changeTab('connect')">
                <div class="tab" :class="{ 'opt': isActivated != 'connect' }">
                    <img class="iconConnect" src="@/assets/images/icon_connect.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('connect') }}
                    </div>
                </div>
            </div>
            <div class="txt2" :class="{ 'activeTab': isActivated == 'status' }" @click="changeTab('status')">
                <div class="tab" :class="{ 'opt': isActivated != 'status' }">
                    <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('systemStatus') }}
                    </div>
                </div>
            </div>
        </div>
        <div class="listBox" v-if="isActivated == 'connect'">
            <div class="item" v-if="connected">
                <span>{{ $t('connectionStatus') }}</span>
                <span>{{ $t('connected') }}</span>
            </div>
            <div class="item" v-if="!connected">
                <span>{{ $t('connectionStatus') }}</span>
                <div>
                    <span class="itemTxt">{{ $t('notConnected') }}</span>
                    <img class="iconTo" src="@/assets/images/icon_to.png" />
                </div>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('robotIP') }}</span>
                <span>192.168.2.1</span>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('wifiName') }}</span>
                <span>GR1-230001</span>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('wifiPwd') }}</span>
                <span>66668888</span>
            </div>
        </div>
        <div class="listBox" v-if="isActivated == 'status'">
            <div class="item">
                <span>{{ $t('robotVersion') }}</span>
                <span>V1.0.0</span>
            </div>
            <div class="item">
                <span>{{ $t('appVersion') }}</span>
                <span>V1.2.1</span>
            </div>
            <div class="item">
                <span>{{ $t('appLanguage') }}</span>
                <div>
                    <span class="itemTxt">简体中文</span>
                    <img class="iconTo" src="@/assets/images/icon_to.png" />
                </div>
            </div>
            <div class="item">
                <span>{{ $t('logRecording') }}</span>
                <el-switch v-model="logOpen"></el-switch>
            </div>
        </div>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
export default {
    components: { rtcHeader },
    data() {
        return {
            isActivated: 'connect',
            logOpen: false,
            connected: true
        }
    },
    methods: {
        changeTab(e) {
            this.isActivated = e
        }
    }
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
    top: 1vw;
    left: 10.9375vw;
    z-index: 99;

    .headTxt {
        font-size: 1.9792vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 2.7083vw;
    }
}

.tabBox {
    position: absolute;
    left: 0;
    top: 13vh;
    width: 23.3854vw;
    height: 17.0833vw;

    .tab {
        position: absolute;
        left: 20%;
        width: 23.3854vw;
        height: 6.1458vw;
        font-size: 1.8229vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .txt1 {
        top: 0;
        width: 23.3854vw;
        height: 6.1458vw;
    }

    .txt2 {
        top: 47%;
        width: 23.3854vw;
        height: 6.1458vw;
    }

    .activeTab {
        background: linear-gradient(274deg, rgba(26, 25, 25, 0.4) 0%, rgba(0, 76, 129, 0.4) 100%);
    }

    .activeTab::after {
        position: absolute;
        content: " ";
        left: 0;
        border-width: 6.1vw 3.3021vw 2.3021vw 0;
        border-style: solid;
        border-color: #44D8FB transparent transparent transparent;
    }

    .iconConnect {
        width: 1.5625vw;
        height: 1.5625vw;
    }

    .iconSysState {
        width: 1.4063vw;
        height: 1.5625vw;
    }

    .opt {
        opacity: 0.3;
    }
}

.listBox {
    position: absolute;
    right: 10%;
    top: 13vh;
    width: 61.5625vw;
    height: 72.13vh;

    .item {
        width: 56.6667vw;
        height: 15.93vh;
        background-color: rgba(255, 255, 255, 0.08);
        margin-bottom: 1.5219vw;
        padding: 0 2.4479vw;
        font-size: 1.7188vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .iconTo {
        width: .625vw;
        height: 1.1979vw;
    }

    .itemTxt {
        color: #44D8FB;
        margin-right: .625vw;
    }
}
</style>
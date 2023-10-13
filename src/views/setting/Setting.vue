<template>
    <div class="main">
        <rtc-header :isSetting="true" @connect="toConnect()">
            <div class="headState">
                <span class="headTxt">{{ $t('systemSettings') }}</span>
            </div>
        </rtc-header>
        <!-- 左侧Tab标签栏 -->
        <div class="tabBox">
            <!-- 连接 -->
            <div class="txt" :class="{ 'activeTab': isActivated == 'connect' }" @click="changeTab('connect')">
                <div class="tab" :class="{ 'opt': isActivated != 'connect' }">
                    <img class="iconConnect" src="@/assets/images/icon_connect.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('connect') }}
                    </div>
                </div>
            </div>
            <!-- 设备设置 -->
            <!-- <div class="txt" :class="{ 'activeTab': isActivated == 'deviceSettings' }" style="top: 47%;"
                @click="changeTab('deviceSettings')">
                <div class="tab" :class="{ 'opt': isActivated != 'deviceSettings' }">
                    <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('deviceSettings') }}
                    </div>
                </div>
            </div> -->
            <!-- 系统状态 -->
            <div class="txt" :class="{ 'activeTab': isActivated == 'status' }" style="top: 94%;"
                @click="changeTab('status')">
                <div class="tab" :class="{ 'opt': isActivated != 'status' }">
                    <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('systemStatus') }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 连接标签页 -->
        <div class="listBox" v-if="isActivated == 'connect'">
            <div class="item" v-if="connected">
                <span>{{ $t('connectionStatus') }}</span>
                <span>{{ $t('connected') }}</span>
            </div>
            <div class="item" v-if="!connected" @click="toConnect()">
                <span>{{ $t('connectionStatus') }}</span>
                <div>
                    <span class="itemTxt">{{ $t('notConnected') }}</span>
                    <img class="iconTo" src="@/assets/images/icon_to.png" />
                </div>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('robotIP') }}</span>
                <span>192.168.12.1</span>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('wifiName') }}</span>
                <span>gr123ot0002</span>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('wifiPwd') }}</span>
                <span>66668888</span>
            </div>
        </div>
        <!-- 设备设置标签页 -->
        <!-- <div class="listBox" v-if="isActivated == 'deviceSettings'">
            <div class="item">
                <span>{{ $t('defaultNickname') }}</span>
                <span>小傅小傅</span>
            </div>
            <div class="item">
                <span>{{ $t('customNickname') }}</span>
                <div>
                    <span style="margin-right: .625vw;">当前唤醒词：小傅小傅</span>
                    <el-switch v-model="nickname"></el-switch>
                </div>
            </div>
            <div class="item">
                <span>{{ $t('volumeAdjustment') }}</span>
                <el-slider style="width: 25vw;" v-model="volume"></el-slider>
            </div>
            <div class="item">
                <span>{{ $t('microphone') }}</span>
                <el-switch v-model="microphone"></el-switch>
            </div>
            <div class="item">
                <span>{{ $t('speechRecognition') }}</span>
                <el-switch v-model="speechs"></el-switch>
            </div>
        </div> -->
        <!-- 系统状态标签页 -->
        <div class="listBox" v-if="isActivated == 'status'">
            <div class="item">
                <span>{{ $t('robotVersion') }}</span>
                <span>V1.0.0</span>
            </div>
            <div class="item">
                <span>{{ $t('appVersion') }}</span>
                <span>V1.0.0</span>
            </div>
            <div class="item" :class="{ 'languageActivated': languageActivated }" @click="languageExpand()">
                <span>{{ $t('appLanguage') }}</span>
                <div>
                    <span class="itemTxt" v-if="currLanguage == 'zh'">简体中文</span>
                    <span class="itemTxt" v-if="currLanguage == 'tw'">繁体中文</span>
                    <span class="itemTxt" v-if="currLanguage == 'en'">English</span>
                    <img class="iconTo" src="@/assets/images/icon_to.png" />
                </div>
            </div>
            <!-- 多语言选择 -->
            <div class="item" v-if="languageActivated">
                <div class="languageItem" :class="{ 'chosedLanguage': currLanguage == 'zh' }" @click="changeLanguage('zh')">
                    <span>简体中文</span>
                    <img class="iconChose" src="@/assets/images/icon_chose.png" v-if="currLanguage == 'zh'" />
                </div>
                <div class="languageItem" :class="{ 'chosedLanguage': currLanguage == 'tw' }" @click="changeLanguage('tw')">
                    <span>繁体中文</span>
                    <img class="iconChose" src="@/assets/images/icon_chose.png" v-if="currLanguage == 'tw'" />
                </div>
                <div class="languageItem" :class="{ 'chosedLanguage': currLanguage == 'en' }" @click="changeLanguage('en')">
                    <span>English</span>
                    <img class="iconChose" src="@/assets/images/icon_chose.png" v-if="currLanguage == 'en'" />
                </div>
            </div>
            <!-- 是否开启日志 -->
            <div class="item">
                <span>{{ $t('logRecording') }}</span>
                <el-switch v-model="logOpen"></el-switch>
            </div>
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
    data() {
        return {
            isActivated: 'status',//当前活动Tab
            logOpen: true,
            nickname: false,
            microphone: false,
            speech: false,
            currLanguage: 'zh',
            languageActivated: false,
            volume: 70
        }
    },
    mounted() {
        this.currLanguage = localStorage.getItem('lang');
    },
    methods: {
        changeTab(e) {
            this.isActivated = e
        },
        languageExpand() {
            this.languageActivated = !this.languageActivated
        },
        changeLanguage(e) {
            this.currLanguage = e
            this.$i18n.locale = e
            localStorage.setItem('lang', e)
            this.languageActivated = false
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

    .txt {
        top: 0;
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
    width: 63.5625vw;
    height: 39.5vw;
    overflow-y: auto;

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

    .languageActivated {
        margin-bottom: 0;
    }

    .iconTo {
        width: .625vw;
        height: 1.1979vw;
    }

    .itemTxt {
        color: #44D8FB;
        margin-right: .625vw;
    }

    .languageItem {
        width: 17.2396vw;
        height: 4.1667vw;
        background: rgba(255, 255, 255, 0.1);
        border-radius: .2604vw;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .chosedLanguage {
        background: rgba(68, 216, 251, 0.1);
        border: .1042vw solid #44D8FB;
    }

    .iconChose {
        width: 1.25vw;
        height: 1.25vw;
    }
}

.listBox::-webkit-scrollbar {
    width: 0;
}
</style>
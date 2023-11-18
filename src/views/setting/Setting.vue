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
            <!-- 系统信息 -->
            <div class="txt" :class="{ 'activeTab': isActivated == 'status' }" style="top: 94%;"
                @click="changeTab('status')">
                <div class="tab" :class="{ 'opt': isActivated != 'status' }">
                    <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
                    <div style="margin-left: 1.25vw;">
                        {{ $t('systemInfo') }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 连接标签页 -->
        <div class="listBox" v-if="isActivated == 'connect'">
            <div class="item">
                <span>{{ $t('connectionStatus') }}</span>
                <span>{{ $t('connected') }}</span>
            </div>
            <!-- <div class="item" v-if="!connected" @click="toConnect()">
                <span>{{ $t('connectionStatus') }}</span>
                <span class="itemTxt">{{ $t('notConnected') }}</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div> -->
            <div class="item" v-if="connected">
                <span>{{ $t('robotIP') }}</span>
                <span>192.168.12.1</span>
            </div>
            <div class="item" v-if="connected">
                <span>{{ $t('wifiName') }}</span>
                <span>gr1********</span>
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
                <span class="itemTxt">小傅小傅</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
            <div class="item">
                <span>{{ $t('volumeAdjustment') }}</span>
                <div style="display: flex;align-items: center;justify-content: space-between;">
                    <el-slider class="splider" v-model="volume"></el-slider>
                    <span style="font-size: 1.4583vw;">{{ volume }}</span>
                </div>
            </div>
            <div class="item" :class="{ 'expandLabel': microphoneOpen }">
                <span>{{ $t('microphone') }}</span>
                <div class="switch" :class="{ 'isChecked': microphoneOpen }" @click="openMicrophone()">
                    <span class="switchCore"></span>
                </div>
            </div>
            <div class="item" style="border-radius: 0 0 .25vw .25vw;" v-if="microphoneOpen">
                <span>{{ $t('speechRecognition') }}</span>
                <div class="switch" :class="{ 'isChecked': speechOpen }" @click="openSpeech()">
                    <span class="switchCore"></span>
                </div>
            </div>
            <div class="item" :class="{ 'expandLabel': selfCheckActivated }" @click="selfCheckExpand()">
                <span>{{ $t('selfCheck') }}</span>
                <span class="itemTxt">{{ $t('normal') }}</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
            <div class="item scItem" v-if="selfCheckActivated">
                <div class="scChild">
                    <span>{{ $t('visionCamera') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('controlModule') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('actuator') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('battery') }}</span>
                    <span style="color: #DC4253;">{{ $t('anomaly') }}</span>
                </div>
                <div class="scChild">
                    <span>{{ $t('screen') }}</span>
                    <span>{{ $t('normal') }}</span>
                </div>
            </div>
            <div class="powerBtn">
                <div>
                    {{ $t('powerOff') }}
                </div>
            </div>
        </div> -->
        <!-- 系统信息标签页 -->
        <div class="listBox" v-if="isActivated == 'status'">
            <div class="item">
                <span>{{ $t('productModel') }}</span>
                <span>GR-1R</span>
            </div>
            <div class="item">
                <span>{{ $t('serialNumber') }}</span>
                <span>GR1R23OT0001</span>
            </div>
            <div class="item">
                <span>{{ $t('robotVersion') }}</span>
                <span>V1.0.0</span>
            </div>
            <div class="item">
                <span>{{ $t('appVersion') }}</span>
                <span>V1.0.0</span>
            </div>
            <div class="item" :class="{ 'expandLabel': languageActivated }" @click="languageExpand()">
                <span>{{ $t('appLanguage') }}</span>
                <span class="itemTxt" v-if="currLanguage == 'zh'">简体中文</span>
                <span class="itemTxt" v-if="currLanguage == 'tw'">繁体中文</span>
                <span class="itemTxt" v-if="currLanguage == 'en'">English</span>
                <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
            <!-- 多语言选择 -->
            <div class="item" style="border-radius: 0 0 .25vw .25vw;" v-if="languageActivated">
                <div class="languageItem" :class="{ 'chosedLanguage': currLanguage == 'zh' }" @click="changeLanguage('zh')">
                    <span>简体中文</span>
                    <img class="iconChose" :class="{ 'visibility': currLanguage != 'zh' }"
                        src="@/assets/images/icon_chose.png" />
                </div>
                <div class="languageItem" :class="{ 'chosedLanguage': currLanguage == 'tw' }" @click="changeLanguage('tw')">
                    <span>繁体中文</span>
                    <img class="iconChose" :class="{ 'visibility': currLanguage != 'tw' }"
                        src="@/assets/images/icon_chose.png" />
                </div>
                <div class="languageItem" :class="{ 'chosedLanguage': currLanguage == 'en' }" @click="changeLanguage('en')">
                    <span>English</span>
                    <img class="iconChose" :class="{ 'visibility': currLanguage != 'en' }"
                        src="@/assets/images/icon_chose.png" />
                </div>
            </div>
            <!-- 是否开启日志 -->
            <div class="item">
                <span>{{ $t('logRecording') }}</span>
                <div class="switch" :class="{ 'isChecked': logOpen }" @click="openLog">
                    <span class="switchCore"></span>
                </div>
            </div>
        </div>
        <prompt-box :prompt="'reconnect'" v-if="!connected" @reconnect="reconnect"></prompt-box>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
import promptBox from '@/components/promptBox.vue';
import { mapState } from "vuex";
import Heartbeat from '@/mixin/Heartbeat';
export default {
    mixins: [Heartbeat],
    components: { rtcHeader,promptBox },
    computed: {
        ...mapState(["connected"])
    },
    data() {
        return {
            isActivated: 'connect',//当前活动Tab
            logOpen: true,
            nickname: false,
            microphone: false,
            speech: false,
            currLanguage: 'zh',
            languageActivated: false,
            volume: 70,
            microphoneOpen: true,
            speechOpen: false,
            selfCheckActivated: false
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
        },
        openLog() {
            this.logOpen = !this.logOpen
        },
        openMicrophone() {
            this.microphoneOpen = !this.microphoneOpen
        },
        openSpeech() {
            this.speechOpen = !this.speechOpen
        },
        selfCheckExpand() {
            this.selfCheckActivated = !this.selfCheckActivated
        },
        reconnect() {

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
    top: 6.9167vw;
    width: 23.4167vw;
    height: 17.0833vw;

    .tab {
        position: absolute;
        left: 20%;
        width: 23.4167vw;
        height: 6.1667vw;
        font-size: 1.8229vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .txt {
        width: 23.3854vw;
        height: 6.1458vw;
        margin-bottom: 1.9167vw;
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
    right: 3.625vw;
    top: 6.2917vw;
    width: 65.2083vw;
    height: 38vw;
    overflow-y: auto;

    .item {
        width: 55.625vw;
        height: 7.375vw;
        background-color: rgba(255, 255, 255, 0.08);
        margin-bottom: 1.25vw;
        padding: 0 3.5vw 0 2.4583vw;
        font-size: 1.7188vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #FFFFFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: .25vw;
    }

    .expandLabel {
        margin-bottom: 0;
        border-radius: .25vw .25vw 0 0;
    }

    .iconTo {
        position: absolute;
        right: 5.4167vw;
        width: .625vw;
        height: 1.1979vw;
    }

    .itemTxt {
        color: #44D8FB;
        // margin-right: .625vw;
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

    .visibility {
        visibility: hidden;
    }

    .splider {
        width: 24.625vw;
        font-size: initial;
        display: inline-block;
        margin-right: 1.25vw;
        position: absolute;
        right: 9vw;
    }

    .powerBtn {
        width: 34.5vw;
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
        margin-left: 14.8333vw;
        margin-top: 2.4583vw;
    }

    .scItem {
        height: 25.3333vw;
        flex-direction: column;
        justify-content: space-around;
        align-items: normal;
        border-radius: 0 0 .25vw .25vw;
        .scChild{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
    }
}

.listBox::-webkit-scrollbar {
    width: .25vw;
}

.listBox::-webkit-scrollbar-track {
    background-color: rgba(81, 82, 85, 0.2);
}

.listBox::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: .125vw;
}

.listBox::-webkit-scrollbar-corner {
    background-color: transparent;
}

// .listBox::-webkit-scrollbar {
//     width: 0;
// }

.switch {
    display: inline-flex;
    align-items: center;
    position: relative;
    font-size: .5833vw;
    line-height: .8333vw;
    height: 2.7083vw;
    vertical-align: middle;

    .switchCore {
        margin: 0;
        position: relative;
        width: 5.1667vw;
        height: 2.7083vw;
        border: .0417vw solid #DCDFE6;
        outline: 0;
        border-radius: 1.5vw;
        box-sizing: border-box;
        background: #DCDFE6;
        transition: border-color .3s, background-color .3s;
        vertical-align: middle;
    }

    .switchCore::after {
        content: "";
        position: absolute;
        top: .2083vw;
        left: .0417vw;
        border-radius: 100%;
        transition: all .3s;
        width: 2.1667vw;
        height: 2.1667vw;
        background-color: #FFF;
    }
}

.switch.isChecked .switchCore {
    border-color: #44D8FB;
    background-color: #44D8FB;
}

.switch.isChecked .switchCore::after {
    left: 100%;
    margin-left: -2.1667vw;
}

.el-slider__button {
    width: 32px;
    height: 32px;
}</style>
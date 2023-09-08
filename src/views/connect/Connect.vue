<template>
    <div class="container">
        <rtc-header :isLoading="true">
            <div class="headState">
                <span class="headTxt">{{ $t('deviceConnection') }}</span>
            </div>
        </rtc-header>
        <div class="humanBody">
            <img class="connectHuman" src="@/assets/images/image_wifi.png" />
        </div>
        <div class="content">
            <div class="contentHead">
                <img class="robot" src="@/assets/images/icon_robot.png" />
                <span class="point">. . .</span>
                <img class="phone" src="@/assets/images/icon_phone.png" />
            </div>
            <div class="contentTxt connectTxt">
                {{ $t('connectRobot') }}
            </div>
            <!-- 初始账号密码 -->
            <div class="connectBox">
                <div class="connectTxt txtFlex">
                    <div>{{ $t('initialAccount') }}</div>
                    <div>RMS1-XXXXXX</div>
                </div>
                <div class="line">
                </div>
                <div class="connectTxt txtFlex">
                    <span>{{ $t('initialPassword') }}</span>
                    <span>12344321</span>
                </div>
            </div>
            <div class="toConnect" @click="openDialog">
                {{ $t('toConnect') }}
            </div>
        </div>
        <!-- 连接提示弹框 -->
        <div class="connectDialog" ref="tipsDialog" v-if="showDialog">
            <img class="dialogPhone" src="@/assets/images/image_phone.png" />
            <div class="connectTxt" style="font-size: 1.4583vw;">{{ $t('connectTips') }}</div>
        </div>
        <!-- 返回主界面及连接失败弹框 -->
        <r-dialog class="connectTxt" v-if="returnMain || connectFail">
            <div>
                {{ $t('tip') }}
            </div>
            <div style="font-size: 1.4583vw;" v-if="returnMain">
                {{ $t('returnToMain') }}?
            </div>
            <div style="font-size: 1.4583vw;" v-if="connectFail">
                <img class="warning" src="@/assets/images/icon_warning.png" />
                {{ $t('connectionFailed') }}
            </div>
            <div class="btnBox">
                <div class="btn white">{{ $t('cancel') }}</div>
                <div class="btn blue">{{ $t('confirm') }}</div>
            </div>
        </r-dialog>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
import rDialog from '@/components/rDialog.vue';
import { mapState } from "vuex";
export default {
    components: { rtcHeader, rDialog },
    computed: {
        ...mapState(["connected"])
    },
    data() {
        return {
            showDialog: false,
            connectFail: false,
            returnMain: false
        }
    },
    mounted() {
        document.addEventListener(
            "click",
            (e) => {
                let tipsDialog = this.$refs.tipsDialog;
                if (tipsDialog && !tipsDialog.contains(e.target)) {
                    this.showDialog = false;
                }
            },
            true
        );
    },
    methods: {
        //打开/关闭弹窗
        openDialog() {
            this.showDialog = !this.showDialog
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/images/image_bkg.png");
    background-repeat: no-repeat;
    background-size: cover;
}

.connectTxt {
    font-size: 1.7188vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
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

.humanBody {
    position: absolute;
    bottom: 0;
    left: 12.5vw;
}

.connectHuman {
    height: 68.98vh;
    width: 34.1146vw;
}

.content {
    position: absolute;
    bottom: 20vh;
    right: 12.5vw;
    width: 30.7813vw;
    height: 30.7813vw;

    .contentHead {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .robot {
            width: 2.6042vw;
            height: 2.4479vw;
        }

        .phone {
            width: 1.875vw;
            height: 2.3958vw;
        }

        .point {
            color: #FFFFFF;
            font-size: 1.7708vw;
            line-height: 1vh;
            margin: 0 .7vw;
        }
    }

    .contentTxt {
        margin: 2.2917vw 0;
    }

    .connectBox {
        width: 26.09vw;
        height: 12.2vw;
        padding: 1.9271vw 2.3438vw 1.8229vw 2.3438vw;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: .2604vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .line {
            width: 27.0833vw;
            height: .1042vw;
            background: #FFFFFF;
            opacity: 0.2;
        }

        .txtFlex {
            display: flex;
            justify-content: space-between;
            width: 26.09vw;
        }
    }

    .toConnect {
        margin-top: 2.2917vw;
        font-size: 1.9792vw;
        font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #44D8FB;
    }
}

.dialogPhone {
    width: 12.0833vw;
    height: 11.5625vw;
}

.warning {
    width: 1.25vw;
    height: 1.1458vw;
}

.btnBox {
    display: flex;
    justify-content: space-around;
    width: 30.2083vw;
    font-size: 1.3542vw;
}

.btn {
    width: 9.8375vw;
    height: 3.3333vw;
    border-radius: 2.2396vw;
    line-height: 3.3333vw;
    text-align: center;
}

.blue {
    background: #44D8FB;
}

.white {
    background-color: rgba(255, 255, 255, 0.1);
}

.connectDialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    width: 30.2083vw;
    height: 17.9167vw;
    background-image: url("../../assets/images/image_dialog.png");
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
}
</style>
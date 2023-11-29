<template>
    <div class="dialog-wrapper">
        <div class="prompt">
            <div class="title" v-if="prompt == 'returnMain'">
                {{ $t('tip') }}
            </div>
            <div class="promptContent" :style="contentStyle">
                <img v-if="prompt != 'returnMain'" class="warningIcon" src="@/assets/images/warning1.png" />
                <div class="promptTxt" :style="txtStyle">
                    <span v-if="prompt == 'closeSh'">{{ $t('closeShPrompt') }}</span>
                    <span v-else-if="prompt == 'reconnect'">{{ $t('reconnectPrompt') }}</span>
                    <span v-else-if="prompt == 'returnMain'">{{ $t('returnMain') }}</span>
                    <span v-else-if="prompt == 'calibration'">{{ $t('calibrationTips') }}</span>
                </div>
            </div>
            <div v-if="prompt != 'reconnect'" class="btnBox">
                <div class="btn blue" @click="cancel()">{{ $t('cancel') }}</div>
                <div class="btn white" @click="confirm()">{{ $t('confirm') }}</div>
            </div>
            <div v-else class="btnBox" style="left: 11.7083vw;">
                <div class="btn blue" @click="reconnect()">{{ $t('reconnect') }}</div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "promptBox",
    props: {
        prompt: {
            type: String,
            default: ""
        }
    },
    computed: {
        contentStyle() {
            let style = { left: '9.5417vw' }
            if (this.prompt == 'returnMain')
                style.left = '13.9167vw'
            if (this.prompt == 'calibration')
                style.left = '5.1667vw'
            return style
        },
        txtStyle() {
            let style = { width: '10.2083vw '}
            if (this.prompt == 'calibration')
                style.width = '16vw'
            return style
        }
    },
    data() {
        return {

        }
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        confirm() {
            this.$emit('confirm')
        },
        reconnect() {
            this.$emit('reconnect')
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    /* 半透明黑色背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    width: 35.7083vw;
    height: 20.9167vw;
    background-image: url("../assets/images/image_card.png");
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 1.7083vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
}

.title {
    position: absolute;
    top: 1.7917vw;
    left: 15.875vw;
}

.promptContent {
    display: flex;
    position: absolute;
    bottom: 11.2083vw;

    .promptTxt {
        font-size: 1.4583vw;
        display: inline-block;
    }
}

.warningIcon {
    width: 4.9167vw;
    height: 4.5417vw;
    margin-right: 1.4583vw;
}

.btnBox {
    display: flex;
    justify-content: space-between;
    width: 27.125vw;
    font-size: 1.7083vw;
    position: absolute;
    left: 4.2917vw;
    bottom: 2.7083vw;
}

.btn {
    width: 12.3333vw;
    height: 4.1667vw;
    border-radius: 2.2083vw;
    line-height: 4.1667vw;
    text-align: center;
}

.blue {
    background: #0075B8;
}

.white {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
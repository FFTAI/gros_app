<template>
    <div class="dialog-wrapper">
        <div class="prompt">
            <div class="promptContent">
                <img class="warningIcon" src="@/assets/images/warning1.png"/>
                <div style="font-size: 1.4583vw;width: 10.2083vw;display: inline-block;">
                    确定是否关闭 机器人算法程序
                </div>
            </div>
            <div class="btnBox">
                <div class="btn blue" @click="cancel()">{{ $t('cancel') }}</div>
                <div class="btn white" @click="confirm()">{{ $t('confirm') }}</div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "promptBox",
    props: {

    },
    data(){
        return{

        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm')
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
.promptContent{
    display: flex;
    position: absolute;
    left: 9.5417vw;
    bottom: 11.2083vw;
}
.warningIcon{
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
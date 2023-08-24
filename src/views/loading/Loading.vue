<template>
    <div class="container">
        <rtc-header :isLoading="true">
            <div class="headState">
                <span class="headTxt">Loading...</span>
            </div>
        </rtc-header>
        <div class="loadingMain">
            <img class="imgLoading" src="@/assets/images/image_loading.png"/>
        </div>
        <div class="progress">
            <el-progress :stroke-width="20" :show-text="false" :percentage="progress"></el-progress>
        </div>
    </div>
</template>

<script>
import rtcHeader from '@/components/rtcHeader.vue';
export default {
    components: { rtcHeader },
    mounted() {
        this.progressInterval = setInterval(() => {
            console.log(this.progress)
            if(this.progress == 100) {
                clearInterval(this.progressInterval)
                this.$router.push({
                    name: 'controller'
                })
            }
            this.progress = this.progress + 1
        }, 30);
    },
    data(){
        return{
            progress: 0,
            progressInterval: undefined
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

.loadingMain{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .imgLoading{
        width: 64.5833vw;
        height: 17.7604vw;
    }
}
.progress{
    position: absolute;
    left: 50%;
    bottom: 10vh;
    width: 70%;
    transform: translate(-50%,-50%);
}
</style>
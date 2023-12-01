<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">Loading...</span>
      </div>
    </rtc-header>
    <div class="loadingMain">
      <img class="imgLoading" src="@/assets/images/image_loading.png" />
    </div>
    <div class="progress">
      <el-progress
        :stroke-width="20"
        :show-text="false"
        :percentage="progress"
        :color="'#44D8FB'"
      ></el-progress>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { rtcHeader },
  mounted() {
    this.progressInterval = setInterval(() => {
      if (this.progress == 100) {
        clearInterval(this.progressInterval);
        setTimeout(() => {
          this.$router.push({
            name: "controller",
          });
        }, 1000);
      } else {
        this.progress = this.progress + 2;
      }
    }, 10);
  },
  data() {
    return {
      progress: 0,
      progressInterval: undefined,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #121e29;
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
    color: #ffffff;
    line-height: 2.7083vw;
  }
}

.loadingMain {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .imgLoading {
    width: 85.9167vw;
    height: 28.8333vw;
  }
}

.progress {
  position: absolute;
  left: 50%;
  bottom: 4vw;
  width: 73%;
  transform: translate(-50%, -50%);
}
</style>

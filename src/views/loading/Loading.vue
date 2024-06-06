<template>
  <div class="black-bkg">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt common-font">{{ $t('loading') }}...</span>
      </div>
    </rtc-header>
    <div class="vertically-centered">
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
        // this.getStartup();
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
  methods: {
    getStartup() {
      let data = {
        "command": 'program_start'
      }
      this.robotWs.robot.send(JSON.stringify(data));
    },
  }
};
</script>

<style lang="scss" scoped>

.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;

  .headTxt {
    font-size: $size-47;
    color: $white;
    line-height: 2.7083vw;
  }
}
.imgLoading {
  width: 85.9167vw;
  height: 28.8333vw;
}
.progress {
  position: absolute;
  left: 50%;
  bottom: 4vw;
  width: 73%;
  transform: translate(-50%, -50%);
}
</style>

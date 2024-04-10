<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">{{ $t("wifiConnected") }}</span>
      </div>
    </rtc-header>
    <img class="wifiImg" src="@/assets/images/image_wifiMode.png" />
    <div class="bubbleBox">
      <div class="bubblePop">
        <div class="tips">{{ $t("wifiTips") }}</div>
        <el-input
          class="wifiMsg"
          v-model="wifiName"
          :placeholder="$t('wifiNameTips')"
        ></el-input>
        <el-input
          class="wifiMsg" style="top: 17.9167vw"
          v-model="wifiPwd"
          :placeholder="$t('wifiPwdTips')"
        ></el-input>
        <img
          v-if="cansee"
          @click="seePassword()"
          class="seeImg"
          src="@/assets/images/icon_see.png"
        />
        <img
          v-else
          @click="seePassword()"
          class="seeImg"
          src="@/assets/images/icon_nosee.png"
        />
      </div>
      <div class="toCreate common-font flex-center">{{ $t("generate") }}</div>
    </div>
  </div>
</template>
  
  <script>
import rtcHeader from "@/components/rtcHeader.vue";
import { mapState } from "vuex";
export default {
  components: { rtcHeader },
  computed: {
    ...mapState(["connected"]),
  },
  data() {
    return {
      cansee: true,
      seeImgUrl: "@/assets/images/icon_see.png",
      noseeImgUrl: "@/assets/images/icon_nosee.png",
      wifiName: "",
      wifiPwd: ""
    };
  },
  mounted() {},
  methods: {
    seePassword() {
      this.cansee = !this.cansee;
    },
  },
};
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
    color: #ffffff;
    line-height: 2.7083vw;
  }
}

.wifiImg {
  position: absolute;
  left: 2.7917vw;
  top: 50%;
  transform: translateY(-50%);
  height: 35.6667vw;
  width: 35.6667vw;
}

.toCreate {
  margin-top: 2.4479vw;
  width: 24.625vw;
  height: 4.1667vw;
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  border-radius: 2.0833vw;
  font-size: $size-41;
  color: $white;
}
.bubbleBox {
  position: absolute;
  right: 3.125vw;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
}
.bubblePop {
  width: 54.9167vw;
  height: 28.3333vw;
  background-image: url("../../assets/images/image_wifiConnect.png");
  background-repeat: no-repeat;
  background-size: contain;
  .tips {
    position: absolute;
    left: 3.7083vw;
    top: 3vw;
    font-family: AlibabaPuHuiTiR;
    font-size: 1.4583vw;
    color: #ffffff;
  }
  .wifiMsg {
    position: absolute;
    left: 9.9479vw;
    top: 10.5208vw;
    width: 41.3021vw;
    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
    font-weight: normal;
    opacity: 0.6;
  }
  .seeImg {
    width: 1.6667vw;
    height: 1.6667vw;
    position: absolute;
    right: 6.1667vw;
    bottom: 15.1vw;
  }
}
.bubblePop ::v-deep .el-input {
  font-size: 1.4583vw;
}
.bubblePop ::v-deep .el-input .el-input__inner {
  height: 2.3333vw;
  padding: 0;
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  border: none;
}
</style>
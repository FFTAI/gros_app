<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">Wi-Fi 连接</span>
      </div>
    </rtc-header>
    <img class="wifiImg" src="@/assets/images/image_wifiMode.png" />
    <div class="bubbleBox">
      <div class="tips">输入当前Wi-Fi密码，生成二维码</div>
      <span class="wifiMsg">gr1-XXXXXX</span>
      <span class="wifiMsg" style="top: 17.75vw;opacity: 0.5;">请输入Wi-Fi 密码</span>
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
    <div class="toCreate common-font flex-center">生成</div>
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
  top: 5.0417vw;
  height: 35.6667vw;
  width: 35.6667vw;
}

.toCreate {
  width: 24.625vw;
  height: 4.1667vw;
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  border-radius: 2.0833vw;
  position: absolute;
  right: 17.625vw;
  bottom: 3.6667vw;
  font-size: $size-41;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
  color: $white;
}
.bubbleBox {
  width: 54.9167vw;
  height: 28.3333vw;
  position: absolute;
  right: 2.4583vw;
  top: 6.375vw;
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
    left: 9.8333vw;
    top: 10.25vw;
    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
    font-weight: normal;
    font-size: 1.7083vw;
    color: #ffffff;
  }
  .seeImg {
    width: 1.6667vw;
    height: 1.6667vw;
    position: absolute;
    right: 6.1667vw;
    bottom: 8.6667vw;
  }
}
</style>
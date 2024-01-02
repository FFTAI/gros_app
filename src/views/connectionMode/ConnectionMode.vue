<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">{{ $t("connectionMode") }}</span>
      </div>
    </rtc-header>
    <div class="humanBody">
      <img class="connectHuman" src="@/assets/images/image_onOpen.png" />
    </div>
    <div class="bubbleBox">
      <div class="phone">
        <img class="dialogPhone" src="@/assets/images/image_phone.png" />
      </div>
      <span class="connectionTips">{{ $t("connectionTips") }}</span>
      <div class="connectionBox">
        <div class="connectTxt txtFlex common-font">
          <div>{{ $t("initialAccount") }}</div>
          <div>gr1-XXXXXX</div>
        </div>
        <div class="line"></div>
        <div class="connectTxt txtFlex common-font">
          <span>{{ $t("initialPassword") }}</span>
          <span>66668888</span>
        </div>
      </div>
    </div>
    <div class="toConnect common-font flex-center">
      {{ $t("toConnect") }}
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
        
    };
  },
  mounted() {
    // document.addEventListener(
    //   "click",
    //   (e) => {
    //     let tipsDialog = this.$refs.tipsDialog;
    //     if (tipsDialog && !tipsDialog.contains(e.target)) {
    //       this.showDialog = false;
    //     }
    //   },
    //   true
    // );
  },
  methods: {
    
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

.humanBody {
  position: absolute;
  bottom: 0;
  left: 4vw;
  height: 38.3562vw;
  width: 29.0938vw;
  overflow: hidden;
}

.connectHuman {
  height: 38.3562vw;
  width: 29.0938vw;
}

.toConnect {
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
  background-image: url("../../assets/images/image_connectBk.png");
  background-repeat: no-repeat;
  background-size: contain;
  .phone {
    position: absolute;
    top: 3.875vw;
    left: 4.25vw;
  }
  .dialogPhone {
    width: 19.3333vw;
    height: 18.4583vw;
  }
  .connectionTips {
    font-size: $size-35;
    font-family: AlibabaPuHuiTiR;
    color: #44d8fb;
    position: absolute;
    top: 7.625vw;
    right: 6.0417vw;
  }
  .connectionBox {
    width: 20.2083vw;
    height: 7.6667vw;
    padding: 1.8333vw 2.2083vw 1.5833vw 2.2083vw;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.25vw;
    position: absolute;
    right: 4.25vw;
    bottom: 6.2917vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .line {
      width: 20.2083vw;
      height: .125vw;
      background: $white;
      opacity: 0.2;
    }
    .txtFlex {
      display: flex;
      justify-content: space-between;
      width: 20.2083vw;
    }
    .connectTxt {
      font-size: $size-35;
      color: $white;
    }
  }
}
</style>
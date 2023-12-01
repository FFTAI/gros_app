<template>
  <div class="container">
    <rtc-header :isLoading="true">
      <div class="headState">
        <span class="headTxt">{{ $t("deviceConnection") }}</span>
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
        {{ $t("connectRobot") }}
      </div>
      <!-- 初始账号密码 -->
      <div class="connectBox">
        <div class="connectTxt txtFlex">
          <div>{{ $t("initialAccount") }}</div>
          <div>gr1********</div>
        </div>
        <div class="line"></div>
        <div class="connectTxt txtFlex">
          <span>{{ $t("initialPassword") }}</span>
          <span>66668888</span>
        </div>
      </div>
      <div class="toConnect" @click="openDialog">
        {{ $t("toConnect") }}
      </div>
    </div>
    <!-- 连接提示弹框 -->
    <div class="connectDialog" ref="tipsDialog" v-if="showDialog">
      <img class="dialogPhone" src="@/assets/images/image_phone.png" />
      <div class="connectTxt" style="font-size: 1.4583vw">
        {{ $t("connectTips") }}
      </div>
    </div>
    <!-- 返回主界面及连接失败弹框 -->
    <r-dialog v-if="returnMain || connectFail">
      <div>
        {{ $t("tip") }}
      </div>
      <div style="font-size: 1.4583vw" v-if="returnMain">
        {{ $t("returnToMain") }}?
      </div>
      <div style="font-size: 1.4583vw" v-if="connectFail">
        <img class="warning" src="@/assets/images/icon_warning.png" />
        {{ $t("connectionFailed") }}
      </div>
      <div class="btnBox">
        <div class="btn white">{{ $t("cancel") }}</div>
        <div class="btn blue">{{ $t("confirm") }}</div>
      </div>
    </r-dialog>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import rDialog from "@/components/rDialog.vue";
import { mapState } from "vuex";
export default {
  components: { rtcHeader, rDialog },
  computed: {
    ...mapState(["connected"]),
  },
  data() {
    return {
      showDialog: false,
      connectFail: false,
      returnMain: false,
    };
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
      // console.log(JSON.stringify(navigator))
      // console.log(JSON.stringify(navigator.getGamepads()))
      return;
      var main = plus.android.runtimeMainActivity();
      var Intent = plus.android.importClass("android.content.Intent");
      var mIntent = new Intent("android.settings.WIFI_SETTINGS");
      main.startActivity(mIntent);
      // this.showDialog = !this.showDialog
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

.connectTxt {
  font-size: 1.7083vw;
  font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
  font-weight: normal;
  color: #ffffff;
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
  left: 0;
  width: 53.5vw;
  height: 41.75vw;
  overflow: hidden;
}

.connectHuman {
  height: 41.75vw;
  width: 53.5vw;
}

.content {
  position: absolute;
  bottom: 10vh;
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
      color: #ffffff;
      font-size: 1.7708vw;
      line-height: 1vh;
      margin: 0 0.7vw;
    }
  }

  .contentTxt {
    margin: 2.2917vw 0;
  }

  .connectBox {
    width: 27.125vw;
    height: 8.5833vw;
    padding: 1.9167vw 1.8333vw 1.8333vw 1.8333vw;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.2604vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .line {
      width: 27.0833vw;
      height: 0.1042vw;
      background: #ffffff;
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
    font-size: 1.9583vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #44d8fb;
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
  justify-content: space-between;
  width: 27.125vw;
  font-size: 1.7083vw;
}

.btn {
  width: 12.3333vw;
  height: 4.1667vw;
  border-radius: 2.2396vw;
  line-height: 4.1667vw;
  text-align: center;
}

.blue {
  background: #0075b8;
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
  width: 35.7083vw;
  height: 20.9167vw;
  background-image: url("../../assets/images/image_dialog.png");
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
</style>

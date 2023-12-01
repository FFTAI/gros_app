<template>
  <div class="main">
    <rtc-header :isStartup="true" @connect="toConnect()">
      <div class="headState">
        <span class="headTxt">{{ $t("robotStartup") }}</span>
      </div>
    </rtc-header>
    <!-- 开机校准 -->
    <div v-if="step == 'calibration' && !calibrationDialog">
      <img
        class="openCalibration"
        src="@/assets/images/image_openCalibration.png"
      />
      <div class="tips tip1" @click="openDialog()">
        <span class="circleTxt ct1">3</span>
        <span>{{ $t("startupTip1") }}</span>
      </div>
      <div class="tips tip2">
        <span class="circleTxt ct2">4</span>
        <span>{{ $t("startupTip2") }}</span>
      </div>
      <div class="tips tip3">
        <span class="circleTxt ct2">1</span>
        <span>{{ $t("startupTip3") }}</span>
      </div>
      <div class="tips tip4">
        <span class="circleTxt ct2">2</span>
        <span>{{ $t("startupTip4") }}</span>
      </div>
      <div class="warning">
        {{ $t("startupWarning") }}
      </div>
    </div>
    <!-- 设备连接 -->
    <div v-else-if="step == 'connect' && !calibrationDialog">
      <img
        class="openCalibration"
        src="@/assets/images/image_deviceConnect.png"
      />
      <div class="connectBox">
        <div class="txtFlex">
          <div>{{ $t("initialAccount") }}</div>
          <div>gr1********</div>
        </div>
        <div class="line"></div>
        <div class="txtFlex">
          <span>{{ $t("initialPassword") }}</span>
          <span>66668888</span>
        </div>
      </div>
      <div class="connectTip">
        {{ $t("connectTip") }}
      </div>
    </div>
    <!-- 程序启动 -->
    <div class="startupBox" v-else-if="step == 'startup' && !calibrationDialog">
      <div v-if="!isReady">
        <img class="startupImg1" src="@/assets/images/image_robotStart1.png" />
        <img class="startupImg2" src="@/assets/images/image_robotStart2.png" />
        <img class="iconRight" src="@/assets/images/icon_right.png" />
        <div class="logTips">
          {{ $t("initializing") }}
        </div>
      </div>
      <div v-else>
        <img class="startupImg3" src="@/assets/images/image_robotStart3.png" />
        <div class="logTips">
          {{ $t("initSuccessfully") }}
        </div>
      </div>
    </div>
    <!-- 校准提示 -->
    <div class="calibrationDialog" v-if="calibrationDialog">
      <img
        class="calibrationImg"
        src="@/assets/images/image_calibrationPose1.png"
      />
      <img
        class="calibrationImg"
        style="left: 35.0417vw"
        src="@/assets/images/image_calibrationPose2.png"
      />
      <img
        class="calibrationImg"
        style="left: 63.375vw"
        src="@/assets/images/image_calibrationPose3.png"
      />
      <img
        class="closeImg"
        src="@/assets/images/btn_close.png"
        @click="closeDialog()"
      />
      <div class="dialogTips">
        <span class="circleTxt ct2">1</span>
        <span>{{ $t("calibrationTip1") }}</span>
      </div>
      <div class="circleTxt ct2 circle2">2</div>
      <div class="dialogTips dialogTip2">
        <span>
          {{ $t("calibrationTip2") }}
        </span>
      </div>
      <div class="dialogTips dialogTip3">
        <span class="circleTxt ct2">3</span>
        <span>{{ $t("calibrationTip3") }}</span>
      </div>
    </div>
    <!-- 右侧操作按钮 -->
    <div class="operateArea" v-if="!calibrationDialog">
      <div
        :class="{ startBtn: step == 'calibration' }"
        class="btn"
        @click="changeStep('connect')"
      >
        <span v-if="step == 'calibration'" class="circleTxt ct1">1</span>
        <img v-else class="finishImg" src="@/assets/images/icon_finish.png" />
        <span>{{ $t("bootCalibration") }}</span>
      </div>
      <div
        :class="{
          disableBtn: step == 'calibration',
          startBtn: step == 'connect',
        }"
        class="btn"
        @click="changeStep('startup')"
      >
        <img
          v-if="step == 'connect' && connected"
          class="finishImg"
          src="@/assets/images/icon_finish2.png"
        />
        <img
          v-else-if="step == 'startup' && connected"
          class="finishImg"
          src="@/assets/images/icon_finish.png"
        />
        <span
          v-else
          :class="step == 'connect' ? 'ct1' : 'ct4'"
          class="circleTxt"
          >2</span
        >
        <span v-if="connected && step != 'calibration'">{{
          $t("deviceConnected")
        }}</span>
        <span v-else>{{ $t("deviceConnection") }}</span>
      </div>
      <div
        v-if="!isReady"
        :class="{
          startBtn: step == 'startup',
          disableBtn: step == 'calibration' || step == 'connect',
        }"
        class="btn"
      >
        <span :class="step == 'startup' ? 'ct1' : 'ct4'" class="circleTxt"
          >3</span
        >
        <span>{{ $t("programStartup") }}</span>
      </div>
      <div v-else class="btn finishBtn noIconBtn" @click="promptBoxOpen()">
        <span>{{ $t("programShutdown") }}</span>
      </div>
      <div
        v-if="isReady"
        class="btn startBtn noIconBtn"
        @click="startExplore()"
      >
        <span>{{ $t("beginToExplore") }}</span>
      </div>
    </div>
    <prompt-box
      v-if="promptVisible"
      :prompt="'closeSh'"
      @cancel="promptBoxOpen()"
      @confirm="shutDown()"
    ></prompt-box>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import Heartbeat from "@/mixin/Heartbeat";
import { mapState } from "vuex";
import promptBox from "@/components/promptBox.vue";
export default {
  mixins: [Heartbeat],
  components: { rtcHeader, promptBox },
  computed: {
    ...mapState(["connected", "robot"]),
  },
  data() {
    return {
      step: "calibration",
      calibrationDialog: false,
      isReady: false,
      promptVisible: false,
    };
  },
  created() {},
  mounted() {},
  destroyed() {
    this.stateOff();
  },
  methods: {
    stateOn() {
      this.robot.enable_debug_state(2);
      this.robot.on_message((data) => {
        let currData = JSON.parse(data.data);
        console.log("enable_debug_state===all_init", currData.data.all_init);
        if (currData.data.all_init) this.isReady = true;
      });
    },
    stateOff() {
      this.robot.disable_debug_state();
      this.robot.removeAllListeners();
    },
    closeDialog() {
      this.calibrationDialog = false;
    },
    //切换步骤
    changeStep(e) {
      if (e == "connect" && this.step == "calibration") this.step = "connect";
      if (e == "startup" && this.step == "connect") {
        if (this.connected) {
          this.step = "startup";
          this.getStartup();
        } else {
          let main = plus.android.runtimeMainActivity();
          let Intent = plus.android.importClass("android.content.Intent");
          let mIntent = new Intent("android.settings.WIFI_SETTINGS");
          main.startActivity(mIntent);
        }
      }
    },
    //程序启动
    getStartup() {
      let _this = this;
      fetch(process.env.VUE_APP_URL + "/robot/sdk_ctrl/start")
        .then((response) => {
          const reader = response.body.getReader();
          let result = "";
          function process() {
            reader.read().then(({ done, value }) => {
              if (done) {
                console.log("处理结束");
                return;
              }
              result = new TextDecoder().decode(value);
              console.log(result);
              if(result.includes("init!")){
                setTimeout(() => {
                  _this.stateOn();
                }, 1000);
              }
              process();
            });
          }
          process();
        })
        .catch((error) => {
          console.error(error);
        });
      // this.$http.request({
      //     timeout: 60000,
      //     baseURL: process.env.VUE_APP_URL,
      //     method: "GET",
      //     url: "/robot/sdk_ctrl/start"
      // }).then(response => {
      //     console.log('start-response', response)
      // }).catch(error => {
      //     console.log('start-error', error)
      // })
    },
    //打开开机校准示例图
    openDialog() {
      this.calibrationDialog = true;
    },
    //开始探索
    startExplore() {
      this.$router.push({
        name: "loading",
      });
    },
    //弹出提示框
    promptBoxOpen() {
      this.promptVisible = !this.promptVisible;
    },
    //程序关闭
    shutDown() {
      this.stateOff();
      this.robot
        .control_svr_close()
        .then((response) => {
          console.log("close...", response);
        })
        .catch((error) => {
          console.error(error);
        });
      this.promptBoxOpen();
      this.step = "calibration";
      this.isReady = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
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

.openCalibration {
  position: absolute;
  top: 6.4167vw;
  left: 2.6667vw;
  width: 61.5833vw;
  height: 35.7083vw;
}

.tips {
  position: absolute;
  left: 46.0417vw;
  top: 13.3333vw;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10.5833vw;
  height: 2.9583vw;
  font-size: 1.25vw;
  font-family: AlibabaPuHuiTiR;
}

.circleTxt {
  width: 1.375vw;
  height: 1.375vw;
  font-size: 0.7083vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5vw;
  font-weight: 900;
}

.ct1 {
  background: #ffffff;
  color: #0086d1;
}

.ct2 {
  background: #44d8fb;
  color: #17303d;
}

.ct3 {
  background: #ffffff;
  color: #17303d;
}

.ct4 {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(18, 30, 41, 0.2);
}

.tip1 {
  background: #0086d1;
  border-radius: 1.4583vw;
  color: #ffffff;
  top: 26.5vw;
}

.tip2 {
  top: 31.2vw;
  color: #44d8fb;
}

.tip3 {
  color: #44d8fb;
  width: 11.8vw;
  top: 11.1vw;
}

.tip4 {
  color: #44d8fb;
  width: 14.3vw;
  top: 15.3vw;
}

.warning {
  position: absolute;
  left: 27.4583vw;
  top: 38.75vw;
  font-size: 1.25vw;
  font-family: AlibabaPuHuiTiR;
  color: #ffffff;
}

.connectTitle {
  position: absolute;
  top: 16.7083vw;
  left: 36.5vw;
  font-size: 1.4583vw;
  font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
  font-weight: normal;
  color: #ffffff;
}

.connectBox {
  position: absolute;
  top: 28vw;
  left: 36.5vw;
  width: 24.625vw;
  height: 8.25vw;
  padding-top: 2.1667vw;
  padding-bottom: 1.9167vw;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.25vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .line {
    width: 22.1667vw;
    height: 0.125vw;
    background: #ffffff;
    opacity: 0.2;
  }

  .txtFlex {
    display: flex;
    justify-content: space-between;
    width: 21.6667vw;
    font-size: 1.4583vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #ffffff;
  }
}

.connectTip {
  position: absolute;
  top: 24.7083vw;
  left: 39.5vw;
  font-size: 1.25vw;
  font-family: AlibabaPuHuiTiR;
  color: #44d8fb;
}

.calibrationDialog {
  position: absolute;
  top: 6.4167vw;
  left: 2.6667vw;
  width: 94.8333vw;
  height: 35.7083vw;
  background: rgba(68, 216, 251, 0.1);

  .calibrationImg {
    position: absolute;
    top: 2.0417vw;
    left: 6.7083vw;
    width: 24.625vw;
    height: 27.7083vw;
  }

  .closeImg {
    position: absolute;
    top: -0.9167vw;
    right: -0.9167vw;
    width: 2.9583vw;
    height: 2.9583vw;
  }

  .dialogTips {
    position: absolute;
    top: 30.7083vw;
    left: 15.0833vw;
    height: 1.6667vw;
    font-size: 1.25vw;
    font-family: AlibabaPuHuiTiR;
    color: #44d8fb;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialogTip2 {
    left: 42.7917vw;
    width: 12.7917vw;
    height: 3.3333vw;
  }

  .dialogTip3 {
    left: 70vw;
  }

  .circle2 {
    position: absolute;
    left: 40.9583vw;
    top: 30.7083vw;
  }
}

.startupBox {
  position: absolute;
  top: 6.4167vw;
  left: 2.6667vw;
  width: 61.5833vw;
  height: 35.7083vw;
  background: rgba(68, 216, 251, 0.1);

  // .logBox {
  //     position: absolute;
  //     top: 1.8333vw;
  //     left: 1.8333vw;
  //     width: 55.375vw;
  //     height: 27.0417vw;
  //     padding: 1.25vw;
  //     background: rgba(255, 255, 255, 0.1);
  //     overflow: auto;
  //     font-size: 1vw;
  //     color: #FFFFFF;
  // }
  .startupImg1 {
    position: absolute;
    left: 2.7917vw;
    top: 1.8333vw;
    width: 23.4167vw;
    height: 27.7083vw;
  }

  .startupImg2 {
    position: absolute;
    right: 2.7917vw;
    top: 1.8333vw;
    width: 26.4583vw;
    height: 27.7083vw;
  }

  .startupImg3 {
    position: absolute;
    left: 6.1667vw;
    top: 1.8333vw;
    width: 49.25vw;
    height: 27.7083vw;
  }

  .iconRight {
    position: absolute;
    left: 28.5vw;
    top: 15.0833vw;
    width: 1.5vw;
    height: 1.25vw;
  }

  .logTips {
    position: absolute;
    top: 32.625vw;
    left: 3.375vw;
    font-size: 1.25vw;
    font-family: AlibabaPuHuiTiR;
    color: #44d8fb;
  }
}

.operateArea {
  position: absolute;
  top: 12.2083vw;
  right: 8.625vw;
  height: 24.125vw;
  width: 18.4583vw;

  .btn {
    width: 14.5vw;
    height: 4.1667vw;
    padding-left: 3.9583vw;
    border-radius: 2.0833vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.7083vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    margin-bottom: 2.4583vw;
    color: #ffffff;
  }

  .startBtn {
    font-weight: normal;
    background: #0075b8;
  }

  .finishBtn {
    color: #44d8fb;
    background: rgba(68, 216, 251, 0.1);
  }

  .disableBtn {
    color: rgba(255, 255, 255, 0.2);
  }

  .noIconBtn {
    justify-content: center;
    padding-left: initial;
    width: 18.4583vw;
  }
}

.finishImg {
  width: 1.4583vw;
  height: 1.4583vw;
  margin-right: 0.5vw;
}
</style>

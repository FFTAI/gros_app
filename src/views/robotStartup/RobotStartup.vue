<template>
  <div class="main common-bkg">
    <rtc-header :isStartup="true" @connect="toConnect()">
      <div class="headState">
        <span class="headTxt common-font">{{ $t("robotStartup") }}</span>
      </div>
    </rtc-header>
    <!-- 开机初始 -->
    <div v-if="step == 'calibration' && !calibrationDialog">
      <img
        class="openCalibration"
        src="@/assets/images/image_openCalibration.png"
      />
      <div class="tips">
        <div class="flex-center tip1">
          <span class="circleTxt flex-center ct2">1</span>
          <span>{{ $t("startupTip3") }}</span>
        </div>
        <div class="flex-center tip2" :style="tip2Style">
          <span class="circleTxt flex-center ct2">2</span>
          <span :style="tip2SpanStyle">{{ $t("startupTip4") }}</span>
        </div>
        <div class="flex-center tip3" :style="tip3Style" @click="openDialog()">
          <span class="circleTxt flex-center ct1">3</span>
          <span>{{ $t("startupTip1") }}</span>
        </div>
        <div class="flex-center tip4">
          <span class="circleTxt flex-center ct2">4</span>
          <span>{{ $t("startupTip2") }}</span>
        </div>
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
      <div class="connectBox flex-column white01-bkg">
        <div class="txtFlex flex-between common-font">
          <div>{{ $t("initialAccount") }}</div>
          <div>gr1********</div>
        </div>
        <div class="line"></div>
        <div class="txtFlex flex-between common-font">
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
    <!-- 初始提示 -->
    <div class="calibrationDialogSty" v-if="calibrationDialog">
      <div class="calibrationItem">
        <img
          class="calibrationImg"
          src="@/assets/images/image_calibrationPose1.png"
        />
        <div class="dialogTips flex-center">
          <span class="circleTxt flex-center ct2">1</span>
          <span>{{ $t("calibrationTip1") }}</span>
        </div>
      </div>
      <div class="calibrationItem" style="left: 35.0417vw">
        <img
          class="calibrationImg"
          src="@/assets/images/image_calibrationPose2.png"
        />
        <div class="dialogTips dialog2">
          <span class="circleTxt flex-center ct2">2</span>
          <span :style="dialog2Style">
            {{ $t("calibrationTip2") }}
          </span>
        </div>
      </div>
      <div class="calibrationItem" style="left: 63.375vw">
        <img
          class="calibrationImg"
          src="@/assets/images/image_calibrationPose3.png"
        />
        <div class="dialogTips flex-center">
          <span class="circleTxt flex-center ct2">3</span>
          <span>{{ $t("calibrationTip3") }}</span>
        </div>
      </div>
      <img
        class="closeImg"
        src="@/assets/images/btn_close.png"
        @click="closeDialog()"
      />
    </div>
    <!-- 右侧操作按钮 -->
    <div class="operateArea" v-if="!calibrationDialog">
      <div
        :class="{ startBtn: step == 'calibration' }"
        class="btn"
        @click="changeStep('connect')"
      >
        <span v-if="step == 'calibration'" class="circleTxt flex-center ct1"
          >1</span
        >
        <img v-else class="finishImg" src="@/assets/images/icon_finish.png" />
        <span>{{ $t("Calibration") }}</span>
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
          class="circleTxt flex-center"
          >2</span
        >
        <span v-if="connected && step != 'calibration'">{{
          $t("deviceConnected")
        }}</span>
        <span v-else>{{ $t("connection") }}</span>
      </div>
      <div
        v-if="!isReady"
        :class="{
          startBtn: step == 'startup',
          disableBtn: step == 'calibration' || step == 'connect',
        }"
        class="btn"
      >
        <span
          :class="step == 'startup' ? 'ct1' : 'ct4'"
          class="circleTxt flex-center"
          >3</span
        >
        <span>{{ $t("startup") }}</span>
      </div>
      <div v-else class="btn finishBtn noIconBtn" @click="promptBoxOpen()">
        <span>{{ $t("powerOff") }}</span>
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
      :prompt="'powerOff'"
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
import { Human } from "rocs-client";
import Bus from "@/utils/bus.js";
export default {
  mixins: [Heartbeat],
  components: { rtcHeader, promptBox },
  computed: {
    ...mapState(["connected","robotInit"]),
    tip3Style() {
      let style = { left: "-0.5vw" };
      if (this.$i18n.locale == "en") {
        style.left = "-1.1vw";
      }
      return style;
    },
    tip2Style() {
      let style = { top: "4.2vw", left: "-3.3vw" };
      if (this.$i18n.locale == "en") {
        style.top = "3.4vw";
        style.left = "-1vw";
      }
      return style;
    },
    dialog2Style() {
      let style = { width: "12.125vw" };
      if (this.$i18n.locale == "en") {
        style.width = "24.75vw";
      }
      return style;
    },
    tip2SpanStyle() {
      let style = { };
      if (this.$i18n.locale == "en") {
        style.width = "15.75vw";
      }
      return style;
    }
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
  destroyed() {},
  methods: {
    closeDialog() {
      this.calibrationDialog = false;
    },
    //切换步骤
    changeStep(e) {
      if (e == "connect" && this.step == "calibration") this.step = "connect";
      if (e == "startup" && this.step == "connect") {
        if (this.connected) {
          this.robotWs.robot
            .control_svr_status()
            .then((res) => {
              if (res.data.data) {
                this.isReady = true;
              } else {
                this.getStartup();
              }
            })
            .catch((err) => {})
            .finally((f) => {
              this.step = "startup";
            });
        } else {
          let main = plus.android.runtimeMainActivity();
          let Intent = plus.android.importClass("android.content.Intent");
          let mIntent = new Intent("android.settings.WIFI_SETTINGS");
          main.startActivity(mIntent);
        }
      }
    },
    initRobotWs() {
      var robot = new Human({
        host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
      });
      this.robotWs.setWs(robot);
      robot.on_connected(() => {
        console.log('robotWs成功！')
        Bus.$emit("robotOnconnected");
      });
      robot.on_message((data) => {
        var currData = JSON.parse(data.data);
        Bus.$emit("robotOnmessage", currData);
      });
      robot.on_close(() => {
        console.log('robotWs关闭！')
      });
      robot.on_error(() => {
        console.log('robotWs出错！')
      });
    },
    //程序启动
    async getStartup() {
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
              console.log("reader---result", result);
              if (result.includes("init!")&&!result.includes("start json init")) {
                reader.cancel();
                setTimeout(() => {
                  _this.initRobotWs()
                }, 2000);
                setTimeout(() => {
                  _this.isReady = true;
                  _this.$store.commit("setRobotInit", true);
                }, 3000);
              } else {
                process();
              }
            });
          }
          process();
        })
        .catch((error) => {
          console.error(error);
        });

      // await this.$http.request({
      //   // timeout: 30000,
      //   baseURL: process.env.VUE_APP_URL,
      //   method: "GET",
      //   url: "/robot/sdk_ctrl/start",
      // });
      // setTimeout(() => {
      //   this.robotWs.robot
      //     .control_svr_status()
      //     .then((res) => {
      //       if (res.data.data) {
      //         _this.isReady = true;
      //       } else {

      //       }
      //     })
      //     .catch((err) => {

      //     });
      // }, 10000);
    },
    //打开开机初始示例图
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
      this.robotWs.robot
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
  background-image: url("../../assets/images/image_bkg.png");
}

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

.openCalibration {
  position: absolute;
  top: 6.4167vw;
  left: 2.6667vw;
  width: 61.5833vw;
  height: 35.7083vw;
}

.tips {
  position: relative;
  left: 46.25vw;
  top: 11.6667vw;
  width: 16.6667vw;
  height: 22.5vw;
  font-size: $size-30;
}

.circleTxt {
  width: 1.375vw;
  height: 1.375vw;
  font-size: 0.7083vw;
  border-radius: 50%;
  margin-right: 0.5vw;
  font-weight: 900;
}

.ct1 {
  background: $white;
  color: #0086d1;
}

.ct2 {
  background: $light-blue;
  color: #17303d;
}

.ct3 {
  background: $white;
  color: #17303d;
}

.ct4 {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(18, 30, 41, 0.2);
}

.tip1 {
  color: $light-blue;
  position: absolute;
}

.tip2 {
  color: $light-blue;
  position: absolute;
  width: 19.75vw;
}

.tip3 {
  background: #0086d1;
  border-radius: 1.4583vw;
  width: 10.4167vw;
  height: 3vw;
  color: $white;
  position: absolute;
  top: 15.5vw;
}

.tip4 {
  position: absolute;
  top: 20.1vw;
  color: $light-blue;
}

.warning {
  position: absolute;
  left: 27.4583vw;
  top: 37.75vw;
  width: 36.75vw;
  font-size: $size-30;
  color: $white;
}

.connectBox {
  position: absolute;
  top: 28vw;
  left: 36.5vw;
  width: 24.625vw;
  height: 8.25vw;
  padding-top: 2.1667vw;
  padding-bottom: 1.9167vw;
  border-radius: 0.25vw;
  justify-content: space-between;
  align-items: center;

  .line {
    width: 22.1667vw;
    height: 0.125vw;
    background: $white;
    opacity: 0.2;
  }

  .txtFlex {
    width: 21.6667vw;
    font-size: $size-35;
    color: $white;
  }
}

.connectTip {
  position: absolute;
  top: 24.7083vw;
  left: 39.5vw;
  font-size: $size-30;
  color: $light-blue;
}

.calibrationDialogSty {
  position: absolute;
  top: 6.4167vw;
  left: 2.6667vw;
  width: 94.8333vw;
  height: 35.7083vw;
  background: rgba(68, 216, 251, 0.1);
  .calibrationItem {
    position: absolute;
    top: 2.0417vw;
    left: 6.7083vw;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .calibrationImg {
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
    margin-top: 1.125vw;
    height: 1.6667vw;
    width: 24.625vw;
    font-size: $size-30;
    color: $light-blue;
  }
  .dialog2 {
    display: flex;
    justify-content: center;
    align-items: flex-start;
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
    font-size: $size-30;
    color: $light-blue;
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
    font-size: $size-41;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    margin-bottom: 2.4583vw;
    color: $white;
  }

  .startBtn {
    font-weight: normal;
    background: $base-bkg;
  }

  .finishBtn {
    color: $light-blue;
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

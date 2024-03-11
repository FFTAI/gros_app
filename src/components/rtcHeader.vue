<template>
  <div class="main">
    <div class="headBk"></div>
    <div class="headBkIn">
      <!-- Logo -->
      <div class="headLogo" v-if="isLogin">
        <img class="leftSlot" src="@/assets/images/image_logo.png" />
      </div>
      <div class="headAfter" v-if="isLogin"></div>
      <!-- 返回 -->
      <div class="headReturn" v-else @click="routerReturn()">
        <img class="return" src="@/assets/images/icon_return.png" />
      </div>
    </div>
    <slot></slot>
    <div
      class="headButtonIn flex-between"
      v-if="(connected || isController || isDevelopment) && !isLoading && !isStartup"
    >
      <div class="divider" v-if="isController || isDevelopment"></div>
      <!-- 机器人温度 -->
      <div
        class="flex-center"
        style="padding: 0 1.375vw;"
        v-if="isController || isDevelopment"
      >
        <img class="inImg" src="@/assets/images/icon_robotTem.png" />
        <span class="inTxt title-font">{{ robotTemp }}°C</span>
      </div>
      <div class="divider" v-if="isController || isDevelopment"></div>
      <!-- 芯片温度 -->
      <div
        class="flex-center"
        style="padding: 0 1.375vw;"
        v-if="isController || isDevelopment"
      >
        <img class="inImg" src="@/assets/images/icon_chipTem.png" />
        <span class="inTxt title-font">{{ actuatorTemp }}°C</span>
      </div>
      <div class="divider" v-if="isController || isDevelopment"></div>
      <!-- 电量 -->
      <div class="flex-center" style="padding: 0 1.375vw;">
        <img class="inImg" src="@/assets/images/icon_battery2.png" />
        <span class="inTxt title-font">{{ batteryLevel }}%</span>
      </div>
      <div class="divider"></div>
      <!-- wifi -->
      <div class="iconBox flex-center">
        <img
          class="inImg"
          style="height: 1.7917vw"
          src="@/assets/images/icon_Wifi.png"
        />
      </div>
      <div class="divider"></div>
      <!-- 视频显示开关 -->
      <!-- <div class="spacing" @click="openCamera()" v-if="camera">
        <img
          class="inImg"
          src="@/assets/images/icon_cameraOn.png"
          v-if="cameraOn"
        />
        <img class="inImg" src="@/assets/images/icon_cameraOff.png" v-else />
      </div> -->
      <!-- <div class="divider spacing" v-if="!isSetting"></div> -->
      <!-- 设置 -->
      <div
        class="iconBox flex-center"
        v-if="!isSetting && !isController && !isDevelopment"
        @click="setting()"
      >
        <img class="inImg" src="@/assets/images/icon_setting.png" />
      </div>
      <div class="divider" v-if="isLogin"></div>
      <!-- 设置 -->
      <div class="iconBox flex-center" v-if="isController" @click="more()">
        <img class="inImg" src="@/assets/images/icon_more.png" />
      </div>
      <div class="divider" v-if="isLogin"></div>
      <!-- 关机 -->
      <div
        class="iconBox flex-center"
        v-if="isLogin || isSetting"
        @click="shutDown()"
      >
        <img class="inImg" src="@/assets/images/btn_shutDown.png" />
      </div>
    </div>
    <!-- 连接 -->
    <div
      class="rightSlot flex-center"
      @click="toConnect()"
      v-if="!connected && (isLogin || isSetting) && !isLoading && !isStartup"
    >
      <span class="connect common-font">{{ $t("connect") }}</span>
    </div>
    <!-- 更多设置--侧边栏菜单 -->
    <div class="drawer" v-if="drawerVisible">
      <div class="side">
        <div
          class="sideItem flex-center"
          :class="{ chosed: chosedBar == 1 }"
          @click="choseBar(1)"
        >
          <div class="bar" v-if="chosedBar == 1"></div>
          <img class="sideImg" src="@/assets/images/icon_control.png" />
        </div>
        <div
          class="sideItem flex-center"
          :class="{ chosed: chosedBar == 2 }"
          @click="choseBar(2)"
        >
          <div class="bar" v-if="chosedBar == 2"></div>
          <img class="sideImg" src="@/assets/images/icon_perception.png" />
        </div>
        <div
          class="sideItem flex-center"
          :class="{ chosed: chosedBar == 3 }"
          @click="choseBar(3)"
        >
          <div class="bar" v-if="chosedBar == 3"></div>
          <img class="sideImg" src="@/assets/images/icon_power.png" />
        </div>
      </div>
      <div class="operation">
        <div class="operationContent common-font" v-if="chosedBar == 2">
          <div class="itemTitle flex-between">
            <div></div>
            <div>
              {{ $t("perceptualInteraction") }}
            </div>
            <div @click="closeDrawer()">
              <img class="closeImg" src="@/assets/images/icon_close.png" />
            </div>
          </div>
          <div class="operationDivider"></div>
          <div class="itemChild flex-between">
            <div>
              {{ $t("voice") }}
            </div>
            <div
              class="switch"
              :class="{ isChecked: voiceOpen }"
              @click="openVoice"
            >
              <span class="switchCore"></span>
            </div>
          </div>
          <div class="operationDivider"></div>
          <div class="itemChild flex-between">
            <div>
              {{ $t("volume") }}
            </div>
            <div class="flex-center">
              <span style="margin-right: 1.1667vw">{{ volume }}</span>
              <el-slider
                class="splider"
                v-model="volume"
                :show-tooltip="false"
              ></el-slider>
            </div>
          </div>
          <div class="operationDivider"></div>
          <div style="height: 11.5833vw">
            <div class="itemDb flex-between">
              <div>
                {{ $t("perceptualPointCloud") }}
              </div>
              <div
                class="switch"
                :class="{ isChecked: pointCloudOpen }"
                @click="openPointCloud()"
              >
                <span class="switchCore"></span>
              </div>
            </div>
            <div class="itemDb flex-between">
              <div>
                {{ $t("obstacleAvoidance") }}
              </div>
              <div
                class="switch"
                :class="{ isChecked: obstacleAvoidanceOpen }"
                @click="openObstacleAvoidance()"
              >
                <span class="switchCore"></span>
              </div>
            </div>
          </div>
          <div class="operationDivider"></div>
          <div class="itemChild flex-between">
            <div>
              {{ $t("imageTransmission") }}
            </div>
            <div
              class="switch"
              :class="{ isChecked: imageOpen }"
              @click="openImage()"
            >
              <span class="switchCore"></span>
            </div>
          </div>
        </div>
        <div class="operationContent common-font" v-if="chosedBar == 3">
          <div class="itemTitle flex-between">
            <div></div>
            <div>
              {{ $t("powerManagement") }}
            </div>
            <div @click="closeDrawer()">
              <img class="closeImg" src="@/assets/images/icon_close.png" />
            </div>
          </div>
          <div class="operationDivider"></div>
          <div class="itemChild flex-between">
            <div>
              {{ $t("lowPowerMode") }}
            </div>
            <div
              class="switch"
              :class="{ isChecked: lowPowerOpen }"
              @click="openLowPower()"
            >
              <span class="switchCore"></span>
            </div>
          </div>
          <div class="operationDivider"></div>
          <div class="itemChild flex-between">
            <div>
              {{ $t("lowBatteryAlert") }}
            </div>
            <div class="flex-center">
              <span style="margin-right: 1.1667vw">{{ batteryLimit }}</span>
              <el-slider
                class="splider"
                v-model="batteryLimit"
                :show-tooltip="false"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "rtcHeader",
  props: {
    currentSpeed: Number,
    camera: {
      type: Boolean,
      default: false,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isController: {
      type: Boolean,
      default: false,
    },
    isSetting: {
      type: Boolean,
      default: false,
    },
    isStartup: {
      type: Boolean,
      default: false,
    },
    isDevelopment: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState(["connected", "robotInit", "enableBasicState"]),
  },
  data() {
    return {
      cameraOn: true,
      drawerVisible: false,
      chosedBar: 2,
      voiceOpen: false,
      volume: 60,
      pointCloudOpen: false,
      obstacleAvoidanceOpen: false,
      imageOpen: false,
      lowPowerOpen: false,
      batteryLimit: 20,
      actuatorTemp: 0,
      batteryLevel: 0,
      robotTemp: 0,
    };
  },
  mounted() {
    if (this.robotInit && !this.enableBasicState) {
      this.$http
        .request({
          baseURL: process.env.VUE_APP_URL,
          method: "GET",
          url: "/robot/enable_basic_state",
          params: {
            frequence: 2,
          },
        })
        .then((response) => {
          console.log("success---enable_basic_state", response.data);
          this.$store.commit("setEnableBasicState", true);
        })
        .catch((error) => {
          console.log("error---enable_basic_state", error);
          this.$store.commit("setEnableBasicState", false);
        });
    }
    this.$bus.$on("basicStateMsg", (data) => {
      console.log("basicStateMsg===========", data);
      this.actuatorTemp = data.data.actuator_temp;
      this.batteryLevel = data.data.battery_level;
      this.robotTemp = data.data.robot_temp;
    });
  },
  destroyed() {
    this.$bus.$off("basicStateMsg");
  },
  methods: {
    toConnect() {
      this.$emit("connect");
    },
    setting() {
      this.$router.push({
        name: "setting",
      });
    },
    more() {
      this.drawerVisible = !this.drawerVisible;
    },
    routerReturn() {
      //如果是控制页跳过loading返回
      if (this.isController) {
        this.$emit("returnMain");
      } else {
        this.$router.go(-1);
      }
    },
    openCamera() {
      this.cameraOn = !this.cameraOn;
      this.$emit("cameraOn");
    },
    shutDown() {
      this.$emit("shutDown");
    },
    choseBar(e) {
      this.chosedBar = e;
    },
    openVoice() {
      this.voiceOpen = !this.voiceOpen;
    },
    openPointCloud() {
      this.pointCloudOpen = !this.pointCloudOpen;
    },
    openObstacleAvoidance() {
      this.obstacleAvoidanceOpen = !this.obstacleAvoidanceOpen;
    },
    openImage() {
      this.imageOpen = !this.imageOpen;
    },
    openLowPower() {
      this.lowPowerOpen = !this.lowPowerOpen;
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
}

.headBk {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 4.4444vw;
  z-index: 10;
  background: linear-gradient(
    274deg,
    rgba(26, 25, 25, 0.4) 0%,
    rgba(0, 76, 129, 0.4) 100%
  );
}

.headBkIn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4.4444vw;
  z-index: 99;

  .leftSlot {
    width: 9.97vw;
    height: 2.604vw;
    position: absolute;
    left: 1.8333vw;
    top: 0.9167vw;
  }

  .headLogo {
    height: 4.4167vw;
    width: 13.25vw;
    background: #004b85;
  }

  .headAfter {
    width: 0;
    height: 0;
    border-right: 2vw solid transparent;
    border-top: 4.45vw solid #004b85;
    position: absolute;
    left: 13.2083vw;
    top: 0;
  }

  .return {
    width: 2.0833vw;
    height: 1.7708vw;
    margin-left: 0.9375vw;
  }

  .headReturn {
    height: 4.4444vw;
    width: 5.24vw;
    background: #004c81;
    padding-left: 1.24vw;
    line-height: 5.8vw;
  }

  .headReturn::after {
    position: absolute;
    content: " ";
    left: 4.218vw;
    border-width: 4.4444vw 2.3021vw;
    border-style: solid;
    border-color: #004c81 transparent transparent transparent;
  }
}

.headButtonIn {
  position: absolute;
  top: 0;
  right: 0;
  line-height: 4.4vw;
  z-index: 99;

  .divider {
    width: 0.1042vw;
    height: 4.4271vw;
    background: $white;
    opacity: 0.1;
  }

  .iconBox {
    width: 6.1667vw;
    // height: 4.2917vw;
    // z-index: 99;
  }

  .inImg {
    width: 2.4583vw;
    height: 2.4583vw;
  }

  .inTxt {
    font-size: $size-41;
    color: $white;
  }

  .spacing {
    margin-right: 2.6042vw;
  }
}

.rightSlot {
  position: absolute;
  top: 0;
  right: 0;
  width: 7.5vw;
  height: 4.375vw;
  background: #0075b8;
  float: right;

  .connect {
    font-size: $size-35;
    color: $white;
    z-index: 99;
  }
}
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 9999;
  display: flex;
  .side {
    width: 6.7917vw;
    background: rgba(27, 26, 26, 0.9);
    .sideItem {
      width: 6.7917vw;
      height: 6.7917vw;
    }
    .bar {
      position: absolute;
      left: 0;
      width: 0.625vw;
      height: 6.7917vw;
      background: #44d8fb;
    }
    .chosed {
      background: linear-gradient(
        274deg,
        rgba(0, 76, 129, 0.2) 0%,
        #004c81 100%
      );
    }
    .sideImg {
      width: 2.4583vw;
      height: 2.4583vw;
    }
  }
  .operation {
    width: 34.5vw;
    padding: 0 2.4583vw;
    background: linear-gradient(
      274deg,
      rgba(27, 26, 26, 0.7) 0%,
      rgba(27, 37, 45, 0.7) 100%
    );
    .operationContent {
      color: $white;
      font-size: $size-35;
      .itemTitle {
        font-size: $size-41;
        height: 6.7083vw;
        align-items: center;
      }
      .operationDivider {
        width: 34.5vw;
        height: 0.0417vw;
        background: rgba(255, 255, 255, 0.2);
      }
      .itemChild {
        height: 7.375vw;
        align-items: center;
      }
      .itemDb {
        height: 5.7917vw;
        align-items: center;
      }
    }
  }
  .closeImg {
    width: 2.0833vw;
    height: 2.0833vw;
  }
}
.switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 0.5833vw;
  line-height: 0.8333vw;
  height: 2.7083vw;
  vertical-align: middle;

  .switchCore {
    margin: 0;
    position: relative;
    width: 5.1667vw;
    height: 2.5833vw;
    outline: 0;
    border-radius: 1.2917vw;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.2);
    transition: border-color 0.3s, background-color 0.3s;
    vertical-align: middle;
  }

  .switchCore::after {
    content: "";
    position: absolute;
    top: 0.2083vw;
    left: 0.0417vw;
    border-radius: 100%;
    transition: all 0.3s;
    width: 2.1667vw;
    height: 2.1667vw;
    background-color: #fff;
  }
}

.switch.isChecked .switchCore {
  border-color: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
}

.switch.isChecked .switchCore::after {
  left: 100%;
  margin-left: -2.1667vw;
}
.splider {
  width: 13.9583vw;
}
.splider ::v-deep .el-slider__runway {
  height: 0.5vw;
  background-color: rgba(216, 216, 216, 0.2);
}
.splider ::v-deep .el-slider__bar {
  height: 0.5vw;
}
.splider ::v-deep .el-slider__button-wrapper {
  top: -0.8333vw;
}
.splider ::v-deep .el-slider__button {
  width: 2.0833vw;
  height: 2.0833vw;
  box-shadow: 0 .125vw .2917vw 0 rgba(63, 63, 63, 0.5);
  border: 0;
}
</style>

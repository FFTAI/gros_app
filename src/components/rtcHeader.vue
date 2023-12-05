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
      v-if="(connected || isController) && !isLoading && !isStartup"
    >
      <!-- 电量和wifi -->
      <div class="spacing">
        <!-- <img class="inImg" src="@/assets/images/icon_battery2.png" />
        <span class="inTxt title-font">43%</span> -->
        <img
          class="inImg"
          style="height: 1.6667vw; width: 2.2917vw"
          src="@/assets/images/icon_Wifi.png"
        />
      </div>
      <div class="divider spacing" v-if="camera"></div>
      <!-- 视频显示开关 -->
      <div class="spacing" @click="openCamera()" v-if="camera">
        <img
          class="inImg"
          src="@/assets/images/icon_cameraOn.png"
          v-if="cameraOn"
        />
        <img class="inImg" src="@/assets/images/icon_cameraOff.png" v-else />
      </div>
      <div class="divider spacing" v-if="!isSetting"></div>
      <!-- 设置 -->
      <div class="spacing" v-if="!isSetting" @click="setting()">
        <img class="inImg" src="@/assets/images/icon_setting.png" />
      </div>
      <div class="divider spacing" v-if="isLogin"></div>
      <div class="spacing" v-if="isLogin" @click="shutDown()">
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
  },
  computed: {
    ...mapState(["connected"]),
  },
  data() {
    return {
      cameraOn: true,
    };
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
  },
};
</script>

<style lang="scss">
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
    opacity: 0.3;
  }

  .inImg {
    width: 2.2222vw;
    height: 2.2222vw;
    z-index: 99;
    vertical-align: middle;
  }

  .inTxt {
    font-size: $size-41;
    color: $white;
    margin-right: 1.9444vw;
    margin-left: 0.6944vw;
    vertical-align: middle;
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
</style>

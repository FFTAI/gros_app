<template>
  <div class="main">
    <div class="headBk"></div>
    <div class="headBkIn">
      <!-- Logo -->
      <div class="headLogo" v-if="isInitialization||isLogin">
        <img class="leftSlot" src="@/assets/images/image_logo.png" />
      </div>
      <div class="headAfter" v-if="isInitialization||isLogin"></div>
      <!-- 返回 -->
      <div class="headReturn" v-else @click="routerReturn()">
        <img class="return" src="@/assets/images/icon_return.png" />
      </div>
    </div>
    <slot></slot>
    <div class="headButtonIn" v-if="(connected || isController) && !isLoading">
      <!-- 电量和wifi -->
      <div class="spacing">
        <!-- <img class="inImg" src="@/assets/images/icon_battery2.png" />
        <span class="inTxt">43%</span> -->
        <img class="inImg" style="height: 1.6667vw;width: 2.2917vw;" src="@/assets/images/icon_Wifi.png" />
      </div>
      <div class="divider spacing" v-if="camera"></div>
      <!-- 视频显示开关 -->
      <div class="spacing" @click="openCamera()" v-if="camera">
        <img class="inImg" src="@/assets/images/icon_cameraOn.png" v-if="cameraOn" />
        <img class="inImg" src="@/assets/images/icon_cameraOff.png" v-else />
      </div>
      <div class="divider spacing" v-if="!isSetting"></div>
      <!-- 设置 -->
      <div class="spacing" v-if="!isSetting" @click="setting()">
        <img class="inImg" src="@/assets/images/icon_setting.png" />
      </div>
    </div>
    <!-- 连接 -->
    <div class="rightSlot" @click="toConnect()" v-if="!connected && (isLogin || isInitialization || isSetting) && !isLoading">
      <span class="connect">{{ $t('connect') }}</span>
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
      default: false
    },
    isInitialization: {
      type: Boolean,
      default: false
    },
    isLogin: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isController: {
      type: Boolean,
      default: false
    },
    isSetting: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["connected"])
  },
  data() {
    return {
      cameraOn: true
    }
  },
  methods: {
    toConnect() {
      this.$emit('connect')
    },
    setting() {
      this.$router.push({
        name: 'setting'
      })
    },
    routerReturn() {
      //如果是控制页跳过loading返回
      if (this.isController) {
        this.$router.go(-2)
      } else {
        this.$router.go(-1)
      }
    },
    openCamera() {
      this.cameraOn = !this.cameraOn
      this.$emit('cameraOn')
    }
  }
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
  // background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
  background: linear-gradient(274deg, rgba(26, 25, 25, 0.4) 0%, rgba(0, 76, 129, 0.4) 100%);
  // opacity: 0.4;
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
    top: .9167vw;
  }

  .headLogo {
    height: 4.4167vw;
    width: 13.25vw;
    background: #004B85;
    // line-height: 5.8vw;
  }

  // .headLogo::after {
  //   position: absolute;
  //   content: " ";
  //   border-width: 106px 64px;
  //   border-style: solid;
  //   border-color: #004c81 transparent transparent transparent;
  // }

  .headAfter{
    width: 0;
    height: 0;
    border-right: 2vw solid transparent; /* 左边长 */
    border-top: 4.45vw solid #004B85; /* 底边长，可以更改颜色 */
    position: absolute;
    left: 13.2083vw;
    top: 0;
  }

  // .headTitle {
  //   font-size: 1.9444vw;
  //   font-family: Roboto-Bold, Roboto;
  //   color: #ffffff;
  //   width: 13.0556vw;
  //   height: 2.3611vw;
  //   line-height: 4.4444vw;
  //   z-index: 999;
  // }

  .return {
    width: 2.0833vw;
    height: 1.7708vw;
    margin-left: .9375vw;
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
  display: flex;
  justify-content: space-between;
  line-height: 4.4vw;
  z-index: 99;

  .divider {
    width: 0.1042vw;
    height: 4.4271vw;
    background: #ffffff;
    opacity: 0.3;
  }

  .inImg {
    width: 2.2222vw;
    height: 2.2222vw;
    z-index: 99;
    vertical-align: middle;
  }

  .inTxt {
    font-size: 1.7361vw;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #ffffff;
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
  background: #0075B8;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;

  .connect {
    font-size: 1.4583vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
    z-index: 99;
  }
}
</style>
  
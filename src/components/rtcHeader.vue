<template>
  <div class="main">
    <div class="headBkIn fullWidth">
      <div class="headReturn" @click="routerReturn()" v-if="!connection">
        <img class="return" src="@/assets/images/icon_return.png" />
      </div>
      <div class="headLogo" v-else>
        <img class="logo" src="@/assets/images/logo.png" />
      </div>
      <div class="headState" v-if="!connection">
        <span class="headTxt common-font">{{ $t("remoteMode") }}</span>
        <div class="cDivider"></div>
        <span class="actionTxt">{{ mode ? $t(mode) : '闲置' }}{{ $t("ing") }}…</span>
      </div>
      <div class="headState" style="left: 13.6458vw;" v-else>
        <span class="headTxt common-font">连接管理</span>
      </div>s
      <div class="spacing flex-center" v-if="!connection">
        <div class="divider spacing"></div>
        <div>
          <img class="inImg" style="width: 1.4583vw;height: 1.3542vw;" src="@/assets/images/icon_sRob.png" />
          <span class="inTxt title-font">80°C</span>
        </div>
        <div class="divider spacing"></div>
        <div>
          <img class="inImg" src="@/assets/images/icon_chipTem.png" />
          <span class="inTxt title-font">60°C</span>
        </div>
        <div class="divider spacing"></div>
        <div>
          <img class="inImg" src="@/assets/images/icon_battery2.png" />
          <span class="inTxt title-font">43%</span>
        </div>
        <div class="divider spacing"></div>
        <div>
          <img class="inImg" style="height: 1.25vw; width: 1.6667vw;" src="@/assets/images/icon_Wifi.png" />
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "rtcHeader",
  props: {
    currentSpeed: Number,
    connection: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    }
  },
  computed: {
    ...mapState(["connected"]),
  },
  data() {
    return {

    };
  },
  methods: {
    routerReturn() {
      //如果是控制页跳过loading返回
      if (this.isController) {
        this.$emit("returnMain");
      } else {
        this.$router.go(-1);
      }
    }
  },
};
</script>

<style lang="scss">
.main {
  position: relative;
}

.headBkIn {
  position: absolute;
  top: 0;
  left: 0;
  height: 3.125vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  background: linear-gradient(274deg, rgba(25, 0, 73, 0) 0%, rgba(122, 36, 253, 0.2) 100%);



  .headReturn {
    height: 3.125vw;
    width: 6.8229vw;
    background: #542C89;
    display: flex;
    justify-content: center;
    align-items: center;

    .return {
      width: 1.6667vw;
      height: 1.4167vw;
    }
  }

  .headReturn::after {
    position: absolute;
    content: " ";
    left: 5.73vw;
    top: 0.0vw;
    border-width: 3.125vw 1.0938vw;
    border-style: solid;
    border-color: #542C89 transparent transparent transparent;
  }

  .headLogo {
    height: 3.125vw;
    width: 10.8854vw;
    background: #7A24FD;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
      width: 8.75vw;
      height: 1.0417vw;
    }
  }

  .headLogo::after {
    position: absolute;
    content: " ";
    left: 9.8vw;
    top: 0.0vw;
    border-width: 3.125vw 1.0938vw;
    border-style: solid;
    border-color: #7A24FD transparent transparent transparent;
  }

  .spacing {
    margin-right: 1.1458vw;
  }

  .divider {
    width: .1042vw;
    height: 3.125vw;
    background: $white;
    opacity: 0.1;
  }

  .inTxt {
    font-size: 1.25vw;
    color: $white;
    margin-right: 1.1458vw;
    margin-left: 0.6944vw;
    vertical-align: middle;
  }
}

.headState {
  position: absolute;
  top: .7292vw;
  left: 10.9375vw;
  z-index: 99;
  display: flex;
  align-items: center;

  .headTxt {
    font-size: 1.25vw;
    color: $white;
    font-style: normal;
  }

  .cDivider {
    width: .0521vw;
    height: 1.25vw;
    background: #FFFFFF;
    margin-left: 1.4583vw;
  }

  .actionTxt {
    font-size: 1.0417vw;
    color: #FFFFFF;
    margin-left: 1.4583vw;
  }
}

.fullWidth {
  width: 100%;
}

.inImg {
  width: 1.3542vw;
  height: 1.3542vw;
  z-index: 99;
  vertical-align: middle;
}
</style>

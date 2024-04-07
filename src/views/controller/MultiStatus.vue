<template>
  <div class="mainBox black-bkg">
    <rtc-header>
      <div class="headState">
        <span class="headTxt">多人模式</span>
      </div>
    </rtc-header>
    <div class="sideTab">
      <div
        class="tabItem"
        :class="activatedTab == 'control' ? 'activated' : ''"
        @click="changeTab('control')"
      >
        <img class="tabIcon" src="@/assets/images/icon_controller.png" />
      </div>
      <div
        class="tabItem"
        :class="activatedTab == 'status' ? 'activated' : ''"
        @click="changeTab('status')"
      >
        <img class="tabIcon" src="@/assets/images/icon_status.png" />
      </div>
    </div>
    <div class="statusCard">
      <div class="statusItem">
        <div class="statusContent">
          <img class="statusIcon" src="@/assets/images/icon_battery4.png" />
          <span style="font-size: 1.4583vw">{{ $t("electricityLevel") }}</span>
        </div>
        <div class="statusDes">
          <div class="green point"></div>
          <span class="txt1">{{ $t("sufficientBattery") }}</span>
          <span style="margin-right: 3.2292vw">5台</span>
          <div class="red point"></div>
          <span class="txt1">{{ $t("InsufficientBattery") }}</span>
          <span>12台</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="statusItem">
        <div class="statusContent">
          <img class="statusIcon" src="@/assets/images/icon_robotTem.png" />
          <span style="font-size: 1.4583vw">{{ $t("temperature") }}</span>
        </div>
        <div class="statusDes">
          <div class="green point"></div>
          <span class="txt1">{{ $t("normalTemperature") }}</span>
          <span style="margin-right: 3.2292vw">5台</span>
          <div class="red point"></div>
          <span class="txt1">{{ $t("abnormalTemperature") }}</span>
          <span>12台</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="statusItem">
        <div class="statusContent">
          <img class="statusIcon" src="@/assets/images/icon_wifi.png" />
          <span style="font-size: 1.4583vw">{{ $t("connect") }}</span>
        </div>
        <div class="statusDes">
          <div class="green point"></div>
          <span class="txt1">{{ $t("onlineDevice") }}</span>
          <span style="margin-right: 3.2292vw">5台</span>
          <div class="red point"></div>
          <span class="txt1">{{ $t("offlineDevice") }}</span>
          <span>12台</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { RtcHeader },
  data() {
    return {
      activatedTab: "status",
    };
  },
  created() {},
  mounted() {},
  methods: {
    changeTab(e) {
      console.log(e);
      this.activatedTab = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.mainBox {
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
.sideTab {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 6.25vw;
  height: calc(100% - 4.4444vw);
  background: rgba(32, 59, 87, 0.3);
  .tabItem {
    width: 6.25vw;
    height: 6.25vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .activated {
    background: linear-gradient(274deg, rgba(0, 76, 129, 0.2) 0%, #004c81 100%);
  }
  .activated::after {
    content: "";
    position: absolute;
    left: 0;
    width: 0.5729vw;
    height: 6.25vw;
    background: #44d8fb;
  }
  .tabIcon {
    width: 2.6042vw;
    height: 2.6042vw;
  }
}
.statusCard {
  position: absolute;
  left: 8.8542vw;
  top: 6.7708vw;
  width: 88.5417vw;
  height: 9.375vw;
  background: rgba(0, 75, 133, 0.3);
  border-radius: 0.5208vw;
  border: 0.0521vw solid #0075b8;
  display: flex;
  align-items: center;
  font-size: 1.0417vw;
  color: #ffffff;
  .divider {
    width: 0.1042vw;
    height: 4.7917vw;
    background: #ffffff;
    opacity: 0.1;
  }
  .statusItem {
    width: 25.3125vw;
    padding: 2.2917vw 0 2.2917vw 4.1667vw;
    .statusContent {
      display: flex;
      align-items: center;
      margin-bottom: 1.1979vw;
    }
    .statusDes {
      display: flex;
      align-items: center;
      .txt1 {
        opacity: 0.5;
        margin-left: 0.7292vw;
        margin-right: 1.1458vw;
      }
    }
  }
  .statusIcon {
    width: 2.0833vw;
    height: 2.0833vw;
    margin-right: 0.625vw;
  }
}
.point {
  width: 0.625vw;
  height: 0.625vw;
  border-radius: 50%;
}
.green {
  background: #5db673;
}
.red {
  background: #ff6656;
}
</style>
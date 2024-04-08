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
        @click="changeTab()"
      >
        <img class="tabIcon" src="@/assets/images/icon_controller.png" />
      </div>
      <div
        class="tabItem activated"
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
    <div class="robotContent">
      <div
        class="robotCard"
        v-for="(item, index) in robotList"
        :key="index"
        @click="choseCard(item)"
      >
        <div class="cardTop">
          <img
            v-if="item.connected"
            class="connectImg"
            src="@/assets/images/image_connectedAvatar.png"
          />
          <img
            v-else
            class="connectImg"
            src="@/assets/images/image_disconnected.png"
          />
          <div
            style="margin-left: 1.1979vw"
            :class="{ opacity02: !item.connected }"
          >
            <div>
              {{ item.name }}
            </div>
            <div
              v-if="item.connected"
              style="display: flex; align-items: center; gap: 0.625vw"
            >
              <div class="green point"></div>
              <img
                style="height: 1.0938vw; width: 1.5625vw"
                src="@/assets/images/icon_Wi-Fi.png"
              />
              <span style="font-size: 1.0417vw; opacity: 0.5">Wi-Fi连接</span>
            </div>
            <div
              v-else
              style="display: flex; align-items: center; gap: 0.625vw"
            >
              <div class="red point"></div>
              <span style="font-size: 1.0417vw; opacity: 0.5">已断开</span>
            </div>
          </div>
        </div>
        <div class="cardMid flex-center" :class="{ opacity02: !item.connected }">
          <div
            v-if="item.currentStatus == 'stand'"
            class="midContent flex-between"
          >
            <img class="img" src="@/assets/images/icon_handshake.png" />
            <span>原地站立中</span>
          </div>
          <div
            v-else-if="item.currentStatus == 'walk'"
            class="midContent flex-between"
          >
            <img class="img" src="@/assets/images/icon_walk.png" />
            <span>步态运动中</span>
          </div>
          <div
            v-else-if="item.currentStatus == 'none'"
            class="midContent flex-between"
          >
            <div class="flex-center img">
              <div class="noneStatus"></div>
            </div>
            <span>无运动</span>
          </div>
        </div>
        <div class="cardBottom flex-between" :class="{ opacity02: !item.connected }">
          <div class="flex-column">
            <img class="img" src="@/assets/images/icon_battery.png" />
            <span>{{ item.battery }}%</span>
          </div>
          <div class="flex-column">
            <img class="img" src="@/assets/images/icon_robotTem.png" />
            <span>{{ item.robotTemp }}°C</span>
          </div>
          <div class="flex-column">
            <img class="img" src="@/assets/images/icon_chipTem.png" />
            <span>{{ item.motorTemp }}°C</span>
          </div>
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
      robotList: [
        {
          name: "GR-0001",
          connected: true,
          currentStatus: "stand",
          battery: 80,
          robotTemp: 40,
          motorTemp: 60,
        },
        {
          name: "GR-0002",
          connected: true,
          currentStatus: "walk",
          battery: 80,
          robotTemp: 40,
          motorTemp: 60,
        },
        {
          name: "GR-0003",
          connected: true,
          currentStatus: "none",
          battery: 80,
          robotTemp: 40,
          motorTemp: 60,
        },
        {
          name: "GR-0004",
          connected: false,
          currentStatus: "none",
          battery: 80,
          robotTemp: 40,
          motorTemp: 60,
        },
        {
          name: "GR-0005",
          connected: false,
          currentStatus: "none",
          battery: 80,
          robotTemp: 40,
          motorTemp: 60,
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    changeTab(e) {
      this.$router.push({
        name: "controller",
      })
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
.robotContent {
  position: absolute;
  left: 8.8542vw;
  top: 18.2292vw;
  width: 88.6458vw;
  height: calc(100% - 18.2292vw);
  overflow: scroll;
  display: flex;
  gap: 2.0833vw;
  flex-wrap: wrap;
  .robotCard {
    width: 18.0729vw;
    height: 23.0729vw;
    padding: 2.0833vw 0 1.9271vw 2.0833vw;
    background: linear-gradient(
      180deg,
      rgba(0, 130, 187, 0.9) 0%,
      rgba(0, 75, 133, 0.8) 100%
    );
    border-radius: 0.8333vw;
    border: 0.0521vw solid #0075b8;
    font-size: 1.4583vw;
    color: #ffffff;
    .cardTop {
      height: 4.1667vw;
      display: flex;
      align-items: center;
      .connectImg {
        width: 3.9583vw;
        height: 3.9583vw;
      }
    }
    .cardMid {
      width: 16.4063vw;
      height: 11.0938vw;
      margin-top: 2.0833vw;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.5208vw;
      .midContent {
        width: 8.2292vw;
        height: 6.875vw;
        flex-direction: column;
        align-items: center;
        .noneStatus {
          width: 1.0417vw;
          border: 0.2083vw solid #ffffff;
        }
        .img {
          height: 4.1667vw;
          width: 4.1667vw;
        }
      }
    }
    .cardBottom {
      width: 15.8854vw;
      height: 3.4375vw;
      margin-top: 2.2917vw;
      font-size: 1.0417vw;
      .img {
        width: 2.0833vw;
        height: 2.0833vw;
      }
    }
  }
}
.robotContent::-webkit-scrollbar {
  width: 0;
}
.opacity02 {
  opacity: 0.2;
}
</style>
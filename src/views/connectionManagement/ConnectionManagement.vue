<template>
  <div class="mainBox">
    <rtc-header>
      <div class="headStateSr">
        <span class="headTxtSr common-font">{{
          $t("connectionManagement")
        }}</span>
      </div>
    </rtc-header>
    <div class="cmContent flex-center">
      <div v-if="moreRobot">
        
      </div>
      <div v-else class="robotBox">
        <el-carousel
          indicator-position="none"
          :autoplay="false"
          arrow="nerver"
          height="28.125vw"
        >
          <el-carousel-item v-for="(list, i) in carouselList" :key="i">
            <!-- 添加机器人 -->
            <div class="carouselItem">
              <div class="addCard" v-if="i == 0">
                <div class="add">
                  <img class="addImg" src="@/assets/images/icon_add.png" />
                </div>
                <div class="addContent">{{ $t("addRobot") }}</div>
              </div>
              <!-- 机器人列表 -->
              <div
                class="robotCard"
                :class="{
                  checkedCard: item.isChosed,
                  uncheckedCard: !item.isChosed,
                  top: item.isMasterControl,
                }"
                v-for="(item, index) in list"
                :key="index"
                @click="choseCard(item)"
              >
                <div class="cardTitle common-font flex-between">
                  <div v-if="item.connectMode == 'wifi'" class="flex-center">
                    <img
                      style="
                        width: 1.5417vw;
                        height: 1.125vw;
                        margin-right: 0.375vw;
                      "
                      src="@/assets/images/icon_Wi-Fi.png"
                    />
                    <span>{{ $t("wifiConnected") }}</span>
                  </div>
                  <div v-else-if="item.connectMode == 'ap'" class="flex-center">
                    <img
                      style="
                        width: 1.3542vw;
                        height: 1.25vw;
                        margin-right: 0.375vw;
                      "
                      src="@/assets/images/icon_ap.png"
                    />
                    <span>{{ $t("APconnection") }}</span>
                  </div>
                  <div v-else class="flex-center">
                    <div class="redPoint"></div>
                    <span style="color: #ff6656">{{ $t("notConnected") }}</span>
                  </div>
                  <span
                    v-if="item.isMasterControl && item.connectMode != 'none'"
                    >{{ $t("masterControl") }}</span
                  >
                  <img
                    v-else-if="
                      !item.isMasterControl && item.connectMode != 'none'
                    "
                    style="width: 1vw; height: 1.125vw"
                    src="@/assets/images/btn_topping.png"
                    @click.stop="toTop(item)"
                  />
                </div>
                <div class="cardDivider"></div>
                <div class="cardContent">
                  <img
                    v-if="item.connectMode != 'none'"
                    class="img"
                    src="@/assets/images/image_connectedAvatar.png"
                  />
                  <img
                    v-else
                    class="img"
                    src="@/assets/images/image_disconnected.png"
                  />
                  <div :class="{ opacity02: item.connectMode == 'none' }">
                    <span class="name">{{ item.name }}</span>
                    <span class="type">GR-1 Lite</span>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="completeBtn flex-center" @click="completeChose()">
        {{ $t("completeSelection") }}
      </div>
    </div>
    <div class="wrapper" v-if="dialogVisible">
      <div class="modeChoseDialog">
        <span class="title">{{ $t("selectConnection") }}</span>
        <div class="content">
          <div class="mode left">
            <span class="modeTxt">通过路由器连接机器人</span>
            <span class="modeName">Wi-Fi直接模式</span>
          </div>
          <div class="mode right">
            <span class="modeTxt">连接机器人热点</span>
            <span class="modeName">Wi-Fi直接模式</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import rtcHeader from "@/components/rtcHeader.vue";
export default {
  components: { rtcHeader },
  data() {
    return {
      masterControl: true,
      dialogVisible: false,
      robotList: [
        {
          name: "GR-0001",
          isMasterControl: true,
          isChosed: true,
          connectMode: "wifi",
        },
        {
          name: "GR-0002",
          isMasterControl: false,
          isChosed: true,
          connectMode: "ap",
        },
        {
          name: "GR-0003",
          isMasterControl: false,
          isChosed: true,
          connectMode: "ap",
        },
        {
          name: "GR-0004",
          isMasterControl: false,
          isChosed: false,
          connectMode: "wifi",
        },
        {
          name: "GR-0005",
          isMasterControl: false,
          isChosed: false,
          connectMode: "wifi",
        },
        {
          name: "GR-0006",
          isMasterControl: false,
          isChosed: false,
          connectMode: "none",
        },
        {
          name: "GR-0007",
          isMasterControl: false,
          isChosed: false,
          connectMode: "none",
        },
        {
          name: "GR-0008",
          isMasterControl: false,
          isChosed: true,
          connectMode: "wifi",
        },
        {
          name: "GR-0009",
          isMasterControl: false,
          isChosed: false,
          connectMode: "ap",
        },
      ],
      carouselList: [],
      moreRobot: false
    };
  },
  created() {},
  mounted() {
    for (let i = 0; i < this.robotList.length; i += 8) {
      if (i == 0) {
        this.carouselList.push(this.robotList.slice(0, 7));
      } else {
        this.carouselList.push(this.robotList.slice(i - 1, i + 7));
      }
    }
    console.log(this.carouselList);
  },
  methods: {
    choseCard(e) {
      if (e.connectMode != "none") e.isChosed = !e.isChosed;
    },
    toTop(e) {
      this.robotList.forEach((i) => {
        if (i.isMasterControl) i.isMasterControl = false;
      });
      e.isMasterControl = true;
    },
    completeChose() {},
  },
};
</script>
  
<style lang="scss" scoped>
.mainBox {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/images/image_bkg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.headStateSr {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;
  .headTxtSr {
    font-size: 1.9583vw;
    color: #ffffff;
    line-height: 2.7083vw;
  }
}
.addCard {
  width: 21.5417vw;
  height: 12.3333vw;
  border-radius: 0.625vw;
  border: 0.0417vw dashed #0075b8;
  order: -2;
  .add {
    width: 8.625vw;
    height: 7.0833vw;
    background: rgba(68, 216, 251, 0.1);
    border-radius: 0 0 100% 0;
    .addImg {
      position: absolute;
      left: 2.1667vw;
      top: 1.5833vw;
      width: 2.9583vw;
      height: 2.9583vw;
    }
  }
  .addContent {
    position: absolute;
    left: 9.1667vw;
    top: 5.5417vw;
    font-family: AlibabaPuHuiTiM;
    font-size: 1.9583vw;
    color: #ffffff;
  }
}
.cmContent {
  position: absolute;
  left: 0;
  top: 4.4444vw;
  width: 100%;
  height: calc(100% - 4.4444vw);
  flex-direction: column;
}
.robotBox {
  width: 93.875vw;
  height: 27.125vw;
  .carouselItem {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4583vw;
  }
  .robotCard {
    width: 21.5417vw;
    height: 12.25vw;
    border-radius: 0.625vw;
    .cardTitle {
      width: 17vw;
      padding: 0.875vw 2.0833vw 0.7917vw 2.4583vw;
      font-size: 1vw;
      color: #ffffff;
    }
    .cardDivider {
      width: 21.5417vw;
      height: 0.0417vw;
      background: #44d8fb;
      opacity: 0.3;
    }
    .cardContent {
      position: relative;
      height: 9.25vw;
      width: 19.0833vw;
      padding-left: 2.4583vw;
      .img {
        position: absolute;
        top: 2.4583vw;
        left: 2.4583vw;
        width: 3.9583vw;
        height: 3.9583vw;
      }
      .name {
        position: absolute;
        top: 2.4583vw;
        left: 7.625vw;
        font-family: AlibabaPuHuiTiM;
        font-size: 1.9583vw;
        color: #ffffff;
      }
      .type {
        position: absolute;
        top: 5.1667vw;
        left: 7.625vw;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        font-size: 1vw;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .uncheckedCard {
    background: rgba(0, 75, 133, 0.3);
    border: 0.0417vw solid #0075b8;
  }
  .checkedCard {
    background: linear-gradient(
      180deg,
      rgba(0, 130, 187, 0.9) 0%,
      rgba(0, 75, 133, 0.8) 100%
    );
    border: 0.0417vw solid #0075b8;
  }
  .top {
    order: -1;
  }
}
.completeBtn {
  // position: absolute;
  // bottom: 3.9583vw;
  // left: 50%;
  // transform: translate(
  //   -50%,
  //   0
  // );
  margin-top: 8.6458vw;
  width: 18.4583vw;
  height: 4.1667vw;
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  border-radius: 2.0833vw;
  font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
  font-weight: normal;
  font-size: 1.7083vw;
  color: #ffffff;
}
@media screen and (min-width: 2400px) {
  .completeBtn {
    margin-top: 5.2083vw;
  }
}
.redPoint {
  width: 0.4688vw;
  height: 0.4688vw;
  background: #ff6656;
  border-radius: 50%;
  margin-right: 0.625vw;
}
.modeChoseDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 62.5vw;
  height: 39.0625vw;
  background-image: url("../../assets/images/image_modeBkg.png");
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 999;
  display: flex;
  justify-content: center;
  font-family: AlibabaPuHuiTiM;
  font-size: 1.4583vw;
  color: #ffffff;
  .title {
    position: absolute;
    top: 2.8125vw;
    font-size: 1.6667vw;
  }
  .content {
    position: absolute;
    top: 10.625vw;
    width: 56.25vw;
    display: flex;
    gap: 3.125vw;
    .mode {
      width: 26.5625vw;
      height: 17.8125vw;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      justify-content: center;
      .modeTxt {
        position: absolute;
        bottom: 3.4375vw;
        font-size: 1.25vw;
        opacity: 0.7;
      }
      .modeName {
        position: absolute;
        bottom: -4.0625vw;
      }
    }
    .left {
      background-image: url("../../assets/images/image_Wi-Fimode.png");
    }
    .right {
      background-image: url("../../assets/images/image_apmode.png");
    }
  }
}
</style>
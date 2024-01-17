<template>
  <div class="loginMain common-bkg">
    <rtc-header
      :is-logo="true"
      :is-login="true"
      @connect="toConnect()"
      @shutDown="promptBoxOpen('powerOff')"
    ></rtc-header>
    <div class="humanBody">
      <img class="openHuman" src="@/assets/images/image_onOpen.png" />
    </div>
    <!-- <div class="startContain flex-center" @click="startExplore()">
      <span class="startBtn common-font">{{ $t("beginToExplore") }}</span>
    </div> -->
    <div class="menuBox">
      <div class="menuItem" @click="startExplore()">
        <img class="menuImg" src="@/assets/images/icon_single.png" />
        <span class="menuValzh">单人模式</span>
        <span class="menuValen">Single Mode</span>
      </div>
      <div class="menuItem">
        <img class="menuImg" src="@/assets/images/icon_multi.png" />
        <span class="menuValzh">多人模式</span>
        <span class="menuValen">Multiplay Mode</span>
      </div>
      <div class="menuItem">
        <img class="menuImg" src="@/assets/images/icon_lab.png" />
        <span class="menuValzh">实验室</span>
        <span class="menuValen">Laboratory</span>
      </div>
      <div class="menuItem">
        <img class="menuImg" src="@/assets/images/icon_guide.png" />
        <span class="menuValzh">指引</span>
        <span class="menuValen">Guide</span>
      </div>
    </div>
    <!-- <div class="closeBox flex-column" :style="closeBoxWidth" v-if="headBoxVisible">
      <div style="margin-left: 2.2396vw" @click="off('powerOff')">
        <img
          style="width: 1.4063vw; height: 1.4583vw"
          src="@/assets/images/icon_poweroff.png"
        />
        {{ $t("powerOff") }}
      </div>
      <div class="divider"></div>
      <div style="margin-left: 2.0833vw" @click="off('closeProgram')">
        <img
          style="width: 1.6146vw; height: 1.3542vw"
          src="@/assets/images/icon_progoff.png"
        />
        {{ $t("closeProgram") }}
      </div>
    </div> -->
    <prompt-box
      v-if="promptVisible"
      :prompt="promptValue"
      @cancel="promptBoxClose()"
      @confirm="shutDown()"
    ></prompt-box>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import { mapState } from "vuex";
import Heartbeat from "@/mixin/Heartbeat";
import promptBox from "@/components/promptBox.vue";
export default {
  mixins: [Heartbeat],
  components: { rtcHeader, promptBox },
  computed: {
    ...mapState(["connected"]),
    // closeBoxWidth() {
    //   let style = { "width": "12.4479vw","font-size": "1.7083vw" };
    //   if (this.$i18n.locale == "en"){
    //     style.width = "14.8229vw";
    //     style["font-size"] = "1.4583vw";
    //   } 
    //   return style;
    // },
  },
  data() {
    return {
      getFlag: true,
      promptVisible: false,
      // headBoxVisible: false,
      promptValue: ""
    };
  },
  mounted() {
    
  },
  methods: {
    startExplore() {
      if (this.getFlag) {
        this.getFlag = false;
        if (this.connected) {
          console.log(this.robotWs);
          this.robotWs.robot
            .control_svr_status()
            .then((res) => {
              this.getFlag = true;
              console.log(this.connected, res.data.data);
              if (this.connected && res.data.data) {
                this.$router.push({
                  name: "loading",
                });
              } else {
                this.toConnect();
              }
            })
            .catch((err) => {
              this.toConnect();
            });
        } else {
          this.toConnect();
        }
      }
    },
    toConnect() {
      this.$router.push({
        name: "robotStartup",
      });
    },
    promptBoxOpen(e) {
      this.promptValue = e;
      this.promptVisible = true;
      // this.headBoxVisible = false;
    },
    promptBoxClose() {
      this.promptValue = "";
      this.promptVisible = false;
    },
    shutDown() {
      if (this.promptValue == "powerOff") {
        this.$http
          .request({
            baseURL: process.env.VUE_APP_URL,
            method: "GET",
            url: "/system/shutdown",
          })
          .then((response) => {
            console.log("success---shutdown", response);
          })
          .catch((error) => {
            console.log("error---shutdown", error);
          });
      } else if (this.promptValue == "closeProgram") {
        this.robotWs.robot
          .control_svr_close()
          .then((response) => {
            console.log("close...", response);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      this.promptBoxClose();
    },
    // headBoxOpen() {
    //   this.headBoxVisible = !this.headBoxVisible;
    // },
    // off(e) {
    //   switch (e) {
    //     case "powerOff":
    //       this.promptBoxOpen("powerOff");
    //       break;
    //     case "closeProgram":
    //       this.promptBoxOpen("closeProgram");
    //       break;
    //     default:
    //       break;
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.loginMain {
  position: relative;
  background-image: url("../../assets/images/image_bkg.png");
}

.humanBody {
  position: absolute;
  bottom: 0;
  left: 10vw;
}

.openHuman {
  height: 40.375vw;
  width: 30.625vw;
}

.startContain {
  position: absolute;
  bottom: 5.7292vw;
  right: 13.0208vw;
  width: 28.3333vw;
  height: 4.1667vw;
  background: $base-bkg;
  border-radius: 2.0833vw;
}

.startBtn {
  font-size: $size-41;
  color: $white;
}
.txtBox {
  width: 33.3333vw;
  height: 20.8333vw;
  position: absolute;
  right: 8.3333vw;
  bottom: 17.5vw;
  color: $white;
}
.closeBox {
  position: absolute;
  top: 4.4443vw;
  right: 0;
  height: 6.7188vw;
  padding: 1.3021vw 0;
  background: rgba(0, 75, 133, 0.3);
  border: 0.0521vw solid #0075b8;
  border-radius: 0.2604vw;
  z-index: 99;
  // align-items: center;
  justify-content: space-between;
  color: $white;

  .divider {
    height: 0.1042vw;
    width: 11.0938vw;
    background: $white;
    opacity: 0.1;
    align-self: center;
  }
}
.menuBox {
  position: absolute;
  right: 8.625vw;
  top: 11.125vw;
  width: 38.75vw;
  height: 26.5vw;
  display: flex;
  flex-wrap: wrap;
  gap: 44px;
  .menuItem {
    position: relative;
    background-image: url("../../assets/images/btn_startCard.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: 18.4583vw;
    height: 12.3333vw;
    flex: 1 0 calc(50% - 44px);
    .menuImg {
      width: 2.4583vw;
      height: 2.4583vw;
      padding: 1.8333vw 0 0 2.3333vw;
    }
    .menuValzh {
      font-size: 1.9583vw;
      font-family: AlibabaPuHuiTiM;
      color: $white;
      position: absolute;
      right: 2.4583vw;
      bottom: 3.4583vw;
    }
    .menuValen {
      font-size: 1.125vw;
      font-family: Roboto, Roboto;
      font-weight: 500;
      color: $white;
      position: absolute;
      right: 2.4583vw;
      bottom: 1.9167vw;
      opacity: 0.5;
    }
  }
}
</style>

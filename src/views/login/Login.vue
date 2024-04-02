<template>
  <div class="loginMain common-bkg">
    <rtc-header
      :is-logo="true"
      :is-login="true"
      @connect="toConnect()"
      @shutDown="promptBoxOpen()"
    ></rtc-header>
    <div class="humanBody">
      <img class="openHuman" src="@/assets/images/image_onOpen.png" />
    </div>
    <div class="menuBox">
      <div class="menuItem singleBkg">
        <span class="menuValzh">单人模式</span>
        <span class="menuValen">Single Mode</span>
      </div>
      <div class="menuItem multiBkg">
        <span class="menuValzh">多人模式</span>
        <span class="menuValen">Multiplay Mode</span>
      </div>
      <div class="menuItem devBkg">
        <span class="menuValzh">实验室</span>
        <span class="menuValen">Laboratory</span>
      </div>
    </div>
    <prompt-box
      v-if="promptVisible"
      prompt="powerOff"
      @cancel="promptBoxOpen()"
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
  },
  data() {
    return {
      getFlag: true,
      promptVisible: false,
      // headBoxVisible: false,
      promptValue: "",
    };
  },
  mounted() {},
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
    toGP() {
      this.$router.push({
        name: "graphicProgramming",
      });
    },
    toConnect() {
      this.$router.push({
        name: "robotStartup",
      });
    },
    promptBoxOpen() {
      this.promptVisible = !this.promptVisible;
    },
    //关机
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
  left: 5vw;
}

.openHuman {
  height: 38.15vw;
  width: 28.9408vw;
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
  left: 42.1667vw;
  top: 18.2083vw;
  display: flex;
  gap: 1.7083vw;
  .menuItem {
    position: relative;
    background-repeat: no-repeat;
    background-size: contain;
    width: 16vw;
    height: 12.3333vw;
    .menuValzh {
      font-size: 1.9583vw;
      font-family: AlibabaPuHuiTiM;
      color: $white;
      position: absolute;
      right: 2.0833vw;
      bottom: 3.4583vw;
    }
    .menuValen {
      font-size: 1.125vw;
      font-family: Roboto, Roboto;
      font-weight: 500;
      color: $white;
      position: absolute;
      right: 2.0833vw;
      bottom: 1.9167vw;
      opacity: 0.5;
    }
  }
  .singleBkg {
    background-image: url("../../assets/images/bkg_single.png");
  }
  .multiBkg {
    background-image: url("../../assets/images/bkg_multi.png");
  }
  .devBkg {
    background-image: url("../../assets/images/bkg_dev.png");
  }
}
</style>

<template>
  <div class="loginMain common-bkg">
    <rtc-header
      :is-logo="true"
      :is-login="true"
      @connect="toConnect()"
      @shutDown="headBoxOpen()"
    ></rtc-header>
    <div class="humanBody">
      <img class="openHuman" src="@/assets/images/image_onOpen.png" />
    </div>
    <div class="startContain flex-center" @click="startExplore()">
      <span class="startBtn common-font">{{ $t("beginToExplore") }}</span>
    </div>
    <div class="headBox flex-column" v-if="headBoxVisible">
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
    </div>
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
  },
  data() {
    return {
      getFlag: true,
      promptVisible: false,
      headBoxVisible: false,
      promptValue: "",
    };
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
      this.headBoxVisible = false;
    },
    promptBoxClose() {
      this.promptValue = "";
      this.promptVisible = false;
    },
    shutDown() {
      if (this.promptValue == "powerOff") {
        
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
    headBoxOpen() {
      this.headBoxVisible = !this.headBoxVisible;
    },
    off(e) {
      switch (e) {
        case "powerOff":
          this.promptBoxOpen("powerOff");
          break;
        case "closeProgram":
          this.promptBoxOpen("closeProgram");
          break;
        default:
          break;
      }
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
  left: 15.2917vw;
}

.openHuman {
  height: 38.0417vw;
  width: 27.0833vw;
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
.headBox {
  position: absolute;
  top: 4.4443vw;
  right: 0;
  width: 12.4479vw;
  height: 6.7188vw;
  padding: 1.3021vw 0;
  background: rgba(0, 75, 133, 0.3);
  border: 0.0521vw solid #0075b8;
  border-radius: 0.2604vw;
  z-index: 99;
  // align-items: center;
  justify-content: space-between;
  font-size: $size-41;
  color: $white;

  .divider {
    height: 0.1042vw;
    width: 11.0938vw;
    background: $white;
    opacity: 0.1;
    align-self: center;
  }
}
</style>

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
    <div class="startContain flex-center" @click="startExplore()">
      <span class="startBtn common-font">{{ $t("beginToExplore") }}</span>
    </div>
    <prompt-box
      v-if="promptVisible"
      :prompt="'closeSh'"
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
    };
  },
  methods: {
    startExplore() {
      if (this.getFlag) {
        this.getFlag = false;
        if (this.connected) {
          console.log(this.robotWs)
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
    promptBoxOpen() {
      this.promptVisible = !this.promptVisible;
    },
    shutDown() {
      this.robotWs.robot
        .control_svr_close()
        .then((response) => {
          console.log("close...", response);
        })
        .catch((error) => {
          console.error(error);
        });
      this.promptBoxOpen();
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
</style>

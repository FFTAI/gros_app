<template>
  <div class="container">
    <div class="videoBox">
      <rtc-header @returnMain="promptBoxOpen('returnMain')">
        <div class="headState">
          <span class="headTxt common-font">{{ $t("remoteMode") }}</span>
        </div>
      </rtc-header>
      <!-- Stop按钮 -->
      <div class="stopControl">
        <img
          class="stopImg"
          src="@/assets/images/icon_chStop.png"
          @click="stop()"
        />
      </div>
      <div class="handControl flex-center" v-if="handMode == ''">
        <div class="handMode flex-center" @click="choseHand('left')">
          <img class="handBtn" src="@/assets/images/icon_lefthand.png" />
          左手
        </div>
        <div class="divider"></div>
        <div class="handMode flex-center" @click="choseHand('right')">
          <img class="handBtn" src="@/assets/images/icon_righthand.png" />
          右手
        </div>
        <div class="divider"></div>
        <div class="handMode flex-center" @click="choseHand('double')">
          <img class="handBtn" src="@/assets/images/icon_waveTwo.png" />
          双手
        </div>
      </div>
      <div
        class="handControl flex-center"
        style="width: 18.8542vw"
        v-else-if="handMode == 'start'"
      >
        <div class="handMode flex-center" @click="pauseInstruction()">
          <img class="handBtn" src="@/assets/images/icon_pause.png" />
          暂停
        </div>
        <div class="divider"></div>
        <div class="handMode flex-center" @click="finishInstruction()">
          <img class="handBtn" src="@/assets/images/icon_finishIns.png" />
          完成
        </div>
      </div>
      <div class="readyControl flex-center" @click="startInstruct()" v-else>
        <div class="triangle"></div>
        开始
      </div>
    </div>
    <img class="handImgL" src="@/assets/images/image_lefthand.png" />
    <img class="handImgR" src="@/assets/images/image_righthand.png" />
    <!-- 虚拟摇杆 joystick-start-->
    <div class="joystickBorder flex-center" style="left: 11.0833vw">
      <img class="joystickImg" src="@/assets/images/image_direction.png" />
    </div>
    <div class="joystickBorder flex-center" style="right: 11.0833vw">
      <img class="joystickImg" src="@/assets/images/image_direction.png" />
    </div>
    <div id="zone_joystickL"></div>
    <div id="zone_joystickR"></div>
    <!-- joystick-end -->
    <prompt-box
      v-if="promptVisible"
      prompt="instruction"
      @cancel="promptBoxOpen()"
      @confirm="shutDown()"
    ></prompt-box>
  </div>
</template>
  <script>
import nipplejs from "nipplejs";
import RtcHeader from "@/components/rtcHeader.vue";
import { mapState } from "vuex";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import promptBox from "@/components/promptBox.vue";
export default {
  components: { RtcHeader, promptBox },
  computed: {
    ...mapState(["gamepadConnected", "connected"]),
  },
  data() {
    return {
      buttons: "", //当前按键
      joystickL: undefined, //左侧虚拟摇杆
      joystickR: undefined, //右侧虚拟摇杆
      screenWidth: document.body.clientWidth, //当前屏幕宽度
      interval: null,
      intervalCount: 0,
      promptVisible: false,
      promptVal: "",
      scene: null,
      camera: null,
      renderer: null,
      points: null,
      promptVisible: false,
      handMode: "",
    };
  },
  created() {
    document.addEventListener(
      "click",
      (e) => {
        let controlRef = this.$refs.controlRef;
        if (controlRef && !controlRef.contains(e.target)) {
          this.controlExpand = false;
        }
      },
      true
    );
  },
  async mounted() {
    this.startJoystickL(); //生成虚拟摇杆
    this.startJoystickR();
    this.startGamepad();
    this.$bus.$on("robotOnmessage", (data) => {
      console.log("robotOnmessage~~~~~~~~~~", data.data);
    });
  },
  destroyed() {
    clearInterval(this.interval);
    //关闭监听
    this.$bus.$off("robotOnmessage");
  },
  watch: {
    //屏幕尺寸变化后，重新生成joystick适配当前尺寸
    screenWidth: function (n, o) {
      if (this.joystickL) {
        this.joystickL.destroy();
        this.startJoystickL();
      }
      if (this.joystickR) {
        this.joystickR.destroy();
        this.startJoystickR();
      }
    },
  },
  methods: {
    // 启动手柄
    startGamepad() {
      const _this = this;
      // 每10ms 获取一次手柄数据，查看是否按下手柄按键
      this.interval = setInterval(function () {
        if (_this.gamepadConnected) {
          _this.intervalCount++;
          let gamepad = null;
          gamepad = navigator.getGamepads()[0]
            ? navigator.getGamepads()[0]
            : navigator.getGamepads()[1]
            ? navigator.getGamepads()[1]
            : navigator.getGamepads()[2]
            ? navigator.getGamepads()[2]
            : navigator.getGamepads()[3];
          if (_this.intervalCount >= 50) {
            // navigator.getGamepads()[0].axes[0],navigator.getGamepads()[0].axes[1],navigator.getGamepads()[0].axes[2],navigator.getGamepads()[0].axes[3]
            _this.pressKey(gamepad.buttons);
            _this.remoteSensing(gamepad.axes);
            _this.intervalCount = 0;
          }

          let size = (_this.screenWidth * 100) / 1440;
          _this.joystickL[0].setPosition(1, {
            x: gamepad.axes.slice(0, 2)[0] * size,
            y: gamepad.axes.slice(0, 2)[1] * size,
          });
          _this.joystickR[0].setPosition(1, {
            x: gamepad.axes.slice(2, 4)[0] * size,
            y: gamepad.axes.slice(2, 4)[1] * size,
          });
        }
      }, 1);
    },
    /**
     * 手柄遥感 --- 圆心方案整改（新）
     */
    remoteSensing(arr) {},
    // 手柄按键
    pressKey(arr) {},
    //开启左侧虚拟触控摇杆
    startJoystickL() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 14.8 * 0.01);
      _this.joystickL = nipplejs.create({
        zone: document.getElementById("zone_joystickL"),
        mode: "static",
        position: { left: "20%", top: "70%" },
        color: "white",
        size: sWidth,
      });
      _this.joystickL
        .on("start", function (evt, data) {
          if (!_this.gamepadConnected) {
            _this.time = setInterval(() => {
              _this.onStart && _this.onStart(_this.distance, _this.angle);
            }, 5);
          }
        })
        .on("move", function (evt, data) {})
        .on("end", function (evt, data) {});
    },
    //开启右侧虚拟触控摇杆
    startJoystickR() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 14.8 * 0.01);
      _this.joystickR = nipplejs.create({
        zone: document.getElementById("zone_joystickR"),
        mode: "static",
        position: { right: "20%", top: "70%" },
        color: "white",
        size: sWidth,
      });
      _this.joystickR
        .on("start", function (evt, data) {})
        .on("move", function (evt, data) {})
        .on("end", function (evt, data) {});
    },
    //紧急停止
    stop() {
      this.robotWs.robot.stop();
    },
    promptBoxOpen(e) {
      this.promptVal = e;
      this.promptVisible = !this.promptVisible;
    },
    choseHand(e) {
      this.handMode = e;
    },
    startInstruct() {
      this.handMode = "start";
    },
    pauseInstruction() {},
    finishInstruction() {},
  },
};
</script>
  <style lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/images/bg_instruction.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.videoBox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.stopControl {
  position: absolute;
  left: 2.0833vw;
  top: 6.25vw;
  z-index: 9999;

  .stopImg {
    width: 5.2083vw;
    height: 5.2083vw;
    margin: auto;
  }
}

.joystickBorder {
  position: absolute;
  bottom: 5.2083vw;
  width: 17.875vw;
  height: 17.875vw;
  border: 3px solid rgba(255, 255, 255, 0.3);
  z-index: 999;
  border-radius: 50%;
}

.joystickImg {
  width: 11.0833vw;
  height: 11.0833vw;
  z-index: 999;
}

#zone_joystickL {
  position: absolute;
  left: 20.2625vw;
  bottom: 14.3458vw;
}

#zone_joystickR {
  position: absolute;
  right: 20.2625vw;
  bottom: 14.3458vw;
}

.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;
  display: flex;
  align-items: center;

  .headTxt {
    font-size: 1.9792vw;
    color: #ffffff;
  }
}
.handControl {
  position: absolute;
  bottom: 4.1667vw;
  left: 50%;
  translate: (-50%);
  width: 28.3333vw;
  height: 5.7292vw;
  background: rgba(0, 76, 129, 0.4);
  border-radius: 2.7604vw;
  border: 0.1042vw solid rgba(255, 255, 255, 0.5);
  .handMode {
    width: 9.375vw;
    height: 1.9792vw;
    font-family: AlibabaPuHuiTiM;
    font-size: 1.4583vw;
    color: #ffffff;
    .handBtn {
      width: 1.3542vw;
      height: 1.3542vw;
      margin-right: 0.2083vw;
    }
  }
  .divider {
    height: 1.6667vw;
    border: 0.0521vw solid rgba(255, 255, 255, 0.5);
  }
}
.readyControl {
  position: absolute;
  bottom: 4.1667vw;
  left: 50%;
  translate: (-50%);
  width: 18.8542vw;
  height: 5.7292vw;
  background: rgba(0, 76, 129, 0.4);
  border-radius: 2.8646vw;
  border: 0.1042vw solid rgba(255, 255, 255, 0.5);
  font-size: 1.4583vw;
  color: #ffffff;
  .triangle {
    margin-right: 0.5208vw;
    border-top: 0.6771vw solid transparent;
    border-bottom: 0.6771vw solid transparent;
    border-left: 1.0417vw solid #ffffff;
  }
}
.handImgL{
  position: absolute;
  left: 16.5104vw;
  top: 18.1771vw;
  width: 8.4375vw;
  height: 10.625vw;
}
.handImgR{
  right: 15.6771vw;
  top: 18.1771vw;
  position: absolute;
  width: 8.4375vw;
  height: 10.625vw;
}
</style>
  
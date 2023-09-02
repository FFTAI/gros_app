<template>
  <div>
    <div class="container">
      <div ref="videoContainer" align="center" class="video-container">
        <div class="video-item">
          <img class="video-play" :src="videoSrc" v-show="camera" />
        </div>
      </div>
      <div class="videoBox">
        <rtc-header :currentSpeed="current_speed" :isController="true" :camera="true" @cameraOn="openCamera()">
          <div class="headState" @click="headChange()">
            <span class="headTxt">{{ $t("remoteMode") }}</span>
            <div class="arrow"></div>
          </div>
        </rtc-header>
        <div class="headBox" v-if="headBoxVisible" ref="headBoxRef">
          <div @click="changeMode('remoteMode')">
            {{ $t("remoteMode") }}
          </div>
          <div class="divider"></div>
          <div @click="changeMode('developerMode')">
            {{ $t("developerMode") }}
          </div>
        </div>
        <!-- Stop按钮 -->
        <div class="stopControl">
          <img class="stopImg" src="@/assets/images/icon_chStop.png" @click="quickStop()" />
        </div>
        <!--校准-->
        <div class="calibration">
          <img class="calibrationImg" src="@/assets/images/icon_calibration.png" @click="calibration()" />
        </div>
        <!-- 速度挡位调节 -->
        <div class="speedBox">
          <img class="speedAdd" @click="speedChange('add')" src="@/assets/images/btn_add.png" />
          <img class="speedReduce" @click="speedChange('reduce')" src="@/assets/images/btn_reduce.png" />
          <span class="speedNum">{{ speed }}</span>
          <div class="speedControl">
            <div class="speedDirection"></div>
          </div>
        </div>
      </div>
      <!-- 虚拟摇杆 -->
      <div class="joystickBkL">
        <img style="width: 13.8889vw; height: 13.8889vw; z-index: 999" src="@/assets/images/image_direction.png" />
      </div>
      <div class="joystickBkR">
        <img style="width: 13.8889vw; height: 13.8889vw; z-index: 999" src="@/assets/images/image_direction.png" />
      </div>
      <div id="zone_joystickL"></div>
      <div id="zone_joystickR"></div>
      <div :class="controlExpand ? 'controlActivated' : 'controlStatus'" ref="controlRef">
        <div class="actionBox" v-if="controlExpand && controlModel == 'gait'">
          <div class="actionItem" @click="choseMode('slowWalk')">
            <img class="actionImg" src="@/assets/images/icon_slowWalk.png" />
            <div>{{ $t("normalWalking") }}</div>
          </div>
          <div class="actionItem" @click="choseMode('fastWalk')">
            <img class="actionImg" src="@/assets/images/icon_fastWalk.png" />
            <div>{{ $t("fastWalking") }}</div>
          </div>
          <div class="actionItem" @click="choseMode('slowRun')">
            <img class="actionImg" src="@/assets/images/icon_slowRun.png" />
            <div>{{ $t("slowRunning") }}</div>
          </div>
          <div class="actionItem" @click="choseMode('fastRun')">
            <img class="actionImg" src="@/assets/images/icon_fastRun.png" />
            <div>{{ $t("fastRunning") }}</div>
          </div>
        </div>
        <div class="actionBox" v-else-if="controlExpand && controlModel == 'inPlace'">
          <div class="actionItem">
            <img class="actionImg" src="@/assets/images/icon_shakeHands.png" @click="choseMode('shakeHands')" />
            <div>{{ $t("shakeHands") }}</div>
          </div>
          <div class="actionItem">
            <img class="actionImg" src="@/assets/images/icon_wave.png" @click="choseMode('wave')" />
            <div>{{ $t("wave") }}</div>
          </div>
        </div>
        <div class="controlBox">
          <div class="choseBox txt" :class="controlModel == 'gait' ? 'chose' : ''" @click="changeControl('gait')">
            {{ $t("gaitMotion") }}
          </div>
          <div class="choseBox txt" style="width: 6.25vw;" :class="controlModel == 'stand' ? 'chose' : ''"
               @click="changeControl('stand')">
            {{ $t("stand") }}
          </div>
          <div class="choseBox txt" :class="controlModel == 'inPlace' ? 'chose' : ''" @click="changeControl('inPlace')">
            {{ $t("inPlaceMotion") }}
          </div>
        </div>
        <!-- <div class="stateBox" v-else @click="stopMode()">
          <img v-if="mode == 'slowWalk'" style="width: 2.2917vw;height: 2.2917vw;"
            src="@/assets/images/icon_slowWalk.png" />
          <img v-if="mode == 'fastWalk'" style="width: 2.2917vw;height: 2.2917vw;"
            src="@/assets/images/icon_fastWalk.png" />
          <img v-if="mode == 'slowRun'" style="width: 2.2917vw;height: 2.2917vw;"
            src="@/assets/images/icon_slowRun.png" />
          <img v-if="mode == 'fastRun'" style="width: 2.2917vw;height: 2.2917vw;"
            src="@/assets/images/icon_fastRun.png" />
          <div style="margin-left: .625vw;">
            <span v-if="mode == 'slowWalk'">{{ $t('normalWalking') }}中</span>
            <span v-if="mode == 'fastWalk'">{{ $t('fastWalking') }}中</span>
            <span v-if="mode == 'slowRun'">{{ $t('slowRunning') }}中</span>
            <span v-if="mode == 'fastRun'">{{ $t('fastRunning') }}中</span>
          </div>
        </div> -->
      </div>
      <div class="stateMessage" v-if="mode != ''">
        <span v-if="mode == 'slowWalk'">{{ $t("normalWalking") }}中...</span>
        <span v-if="mode == 'fastWalk'">{{ $t("fastWalking") }}中...</span>
        <span v-if="mode == 'slowRun'">{{ $t("slowRunning") }}中...</span>
        <span v-if="mode == 'fastRun'">{{ $t("fastRunning") }}中...</span>
        <span v-if="mode == 'shakeHands'">{{ $t("shakeHands") }}...</span>
        <span v-if="mode == 'wave'">{{ $t("wave") }}...</span>
      </div>
    </div>
  </div>
</template>
<script>
import nipplejs from "nipplejs";
import RtcHeader from "@/components/rtcHeader.vue";
import rtcLeftControl from "@/components/rtcLeftControl.vue";
import { mapState } from "vuex";

export default {
  components: { RtcHeader, rtcLeftControl },
  computed: {
    ...mapState(["controlType", "iP"])
  },
  data() {
    return {
      videoContainer: "",
      buttons: "",
      joystickL: undefined,
      joystickR: undefined,
      screenWidth: document.body.clientWidth,
      plusD: false,
      minusD: false,
      direction: 0,
      gamepadConnected: false,
      speed: 1,
      current_speed: 0, //当前速度，默认0
      videoSrc: "", //摄像头视频路径
      controlModel: "gait",
      controlExpand: false,
      mode: "",
      headBoxVisible: false,
      camera: true
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
    let _this = this;
    this.$nextTick(() => {
      window.addEventListener("gamepadconnected", function(e) {
        const gp = navigator.getGamepads()[e.gamepad.index];
        console.log("手柄连接", gp);
        _this.gamepadConnected = true;
        _this.startGamepad(); // 启动手柄
      });
      window.addEventListener("gamepaddisconnected", function(e) {
        _this.gamepadConnected = false;
        clearInterval(this.interval); // 停止获取手柄数据
        console.log("手柄断开", e);
      });
    });

    this.videoContainer = this.$refs.videoContainer;
    // this.startFullScreen(); //强制全屏
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    this.cameraOpen();
    this.startJoystickL(); //生成虚拟摇杆
    this.startJoystickR();
  },
  beforeDestroy() {
    let _this = this;
    window.removeEventListener("gamepadconnected", function(e) {
      const gp = navigator.getGamepads()[e.gamepad.index];
      console.log("手柄连接beforeDestroy", gp);
      _this.gamepadConnected = true;
      _this.startGamepad(); // 启动手柄
    });
    window.removeEventListener("gamepaddisconnected", function(e) {
      _this.gamepadConnected = false;
      clearInterval(this.interval); // 停止获取手柄数据
      console.log("手柄断开beforeDestroy", e);
    });
  },
  destroyed() {
    clearInterval(this.interval);
  },
  watch: {
    //屏幕尺寸变化后，重新生成joystick适配当前尺寸
    screenWidth: function(n, o) {
      console.log("屏幕变化", n);
      if (this.joystickL) {
        this.joystickL.destroy();
        this.startJoystickL();
      }
      if (this.joystickR) {
        this.joystickR.destroy();
        this.startJoystickR();
      }
    }
  },
  methods: {
    // 启动手柄
    startGamepad() {
      const _this = this;
      // 每10ms 获取一次手柄数据，查看是否按下手柄按键
      this.interval = setInterval(function() {
        let gamepad = null;
        navigator.getGamepads().forEach((item) => {
          if (item) gamepad = item;
        });
        // console.log("手柄实时数据", gamepad);
        _this.pressKey(gamepad.buttons);
        _this.remoteSensing(gamepad.axes);

        let size = (_this.screenWidth * 100) / 1440;
        _this.joystickL[0].setPosition(1, {
          x: gamepad.axes.slice(0, 2)[0] * size,
          y: gamepad.axes.slice(0, 2)[1] * size
        });
        _this.joystickR[0].setPosition(1, {
          x: gamepad.axes.slice(2, 4)[0] * size,
          y: gamepad.axes.slice(2, 4)[1] * size
        });
      }, 10);
    },
    /**
     * 手柄遥感 --- 圆心方案整改（新）
     */
    remoteSensing(arr) {
      let velocity = arr[1];
      let direction = arr[0];
      //圆的半径设为前后速度
      let v = Math.hypot(Math.abs(velocity), Math.abs(direction));
      if (v > 1) v = 1;
      if (velocity < 0) v = v * -1;
      //计算正弦值，根据反正弦算出角度
      let sin = direction / Math.abs(v);
      // console.log('sin', sin, direction, Math.abs(v))
      let angle = (Math.asin(sin) * 180) / Math.PI;
      //设定低值死区
      if (Math.abs(velocity) < 0.1) v = 0;
      if (Math.abs(direction) < 0.1) angle = 0;
      if (Math.abs(velocity) < 0.1) {
        velocity = 0;
      }
      // console.log(
      //   "实时坐标---前后",
      //   (velocity * this.speed) / 6.25,
      //   "实时坐标---左右角度",
      //   angle / -90 * 0.2,
      //   'host',
      //   this.iP.host,
      //   'port',
      //   this.iP.port
      // );
      this.operateHuman(angle * -0.2, (velocity * this.speed) / 6.25);

    },
    // 手柄按键
    pressKey(arr) {
      // console.log("手柄按键", arr);
      let stopL = false;
      let stopR = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === 1) {
          if (!this.speedTime) {
            if (i === 4) {
              this.buttons = "左手1";
              if (this.speed > 1) this.speed -= 1;
            }
            if (i === 5) {
              this.buttons = "右手1";
              if (this.speed < 5) this.speed += 1;
            }
            this.speedTime = setTimeout(() => {
              this.speedTime = null;
            }, 500);
          }
          if (i === 6) {
            this.buttons = "左手2";
            stopL = true;
          }
          if (i === 7) {
            this.buttons = "右手2";
            stopR = true;
          }
        }
      }
      if (stopL && stopR) this.quickStop();
    },
    //强制全屏进入
    startFullScreen() {
      var el = document.documentElement;
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen;
      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
      } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.oRequestFullscreen) {
        el.oRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else {
        alert("浏览器不支持全屏调用！");
      }
    },
    //开启虚拟触控摇杆
    startJoystickL() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 16.67 * 0.01);
      _this.joystickL = nipplejs.create({
        zone: document.getElementById("zone_joystickL"),
        mode: "static",
        position: { left: "20%", top: "70%" },
        color: "white",
        size: sWidth
      });
      _this.joystickL
        .on("start", function(evt, data) {
          if (!_this.gamepadConnected) {
            _this.time = setInterval(() => {
              // console.log("startstart", evt, data);
              _this.onStart && _this.onStart(_this.distance, _this.angle);
            }, 5);
          }
        })
        .on("move", function(evt, data) {
          //同手柄圆心方案（新）
          let velocity = data.vector.y;
          let direction = data.vector.x;
          let v = Math.hypot(Math.abs(velocity), Math.abs(direction));
          if (v > 1) v = 1;
          if (velocity < 0) v = v * -1;
          let sin = direction / Math.abs(v);
          let angle = (Math.asin(sin) * 180) / Math.PI;
          if (Math.abs(velocity) < 0.1) v = 0;
          if (Math.abs(direction) < 0.1) angle = 0;
          //人形控制
          if (!_this.gamepadConnected) {
            console.log(velocity);
            if (Math.abs(velocity) < 0.1) {
              velocity = 0;
            }
            // console.log(
            //   "实时坐标---前后",
            //   (velocity * _this.speed) / 6.25,
            //   "实时坐标---左右角度",
            //   angle / -90,
            //   'host',
            //   _this.iP.host,
            //   'port',
            //   _this.iP.port
            // );
            _this.operateHuman(angle * -0.2, (velocity * _this.speed) / 6.25);
          }
        })
        .on("end", function(evt, data) {
          if (!_this.gamepadConnected) {
            //摇杆回原点后速度方向归零
            _this.operateHuman(0, 0);
            clearInterval(_this.time);
            _this.onEnd && _this.onEnd();
          }
        });
    },
    startJoystickR() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 16.67 * 0.01);
      _this.joystickR = nipplejs.create({
        zone: document.getElementById("zone_joystickR"),
        mode: "static",
        position: { right: "20%", top: "70%" },
        color: "white",
        size: sWidth
      });
      _this.joystickR
        .on("start", function(evt, data) {

        })
        .on("move", function(evt, data) {

        })
        .on("end", function(evt, data) {

        });
    },
    calibration() {
      this.$robot.start()
      // this.loading = true
    },
    //紧急停止
    quickStop() {
      this.$robot.stop()
    },
    // 速度挡位调节
    speedChange(e) {
      if (!this.speedTime) {
        if (e == "add" && this.speed < 5) this.speed += 1;
        if (e == "reduce" && this.speed > 1) this.speed -= 1;
        this.speedTime = setTimeout(() => {
          this.speedTime = null;
        }, 500);
      }
    },
    //操控人形
    operateHuman(direction, velocity) {
      this.$robot.move(direction, velocity);
    },
    cameraOpen() {
      this.videoSrc = this.$robot.get_video_stream_url();
    },
    changeControl(e) {
      this.mode = "";
      if (e != "stand") {
        this.controlExpand = true;
      } else {
        this.$robot.stand()
        this.controlExpand = false;
      }
      this.controlModel = e;
    },
    choseMode(e) {
      this.controlExpand = false;
      this.mode = e;
    },
    stopMode() {
      this.mode = "";
    },
    headChange() {
      this.headBoxVisible = !this.headBoxVisible;
    },
    changeMode(e) {
      if (e == "remoteMode") {
        this.headBoxVisible = false;
      } else if (e == "developerMode") {
        this.$router.push({
          name: "development"
        });
      }
    },
    openCamera() {
      this.camera = !this.camera;
    }
  }
};
</script>
<style lang="scss">
.video-container {
  display: flex;
  justify-content: center;
}

.video-item {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #121E29;
  z-index: 3;
}

.video-play {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buttons {
  display: flex;
  margin-top: 1.3889vw;
}

.videoBox {
  width: 100%;
  height: 100%;
  background-color: cadetblue;
  position: absolute;
}

.stopControl {
  position: absolute;
  right: 5vw;
  top: 8.3333vw;
  z-index: 9999;

  .stopImg {
    width: 3.9583vw;
    height: 3.9583vw;
    margin: auto;
  }
}

.calibration {
  position: absolute;
  left: 5vw;
  top: 8.3333vw;
  z-index: 9999;

  .calibrationImg {
    width: 3.9583vw;
    height: 3.9583vw;
    margin: auto;
  }
}

.speedBox {
  position: absolute;
  left: 3.5vw;
  bottom: 6.9444vw;
  z-index: 999;

  .speedAdd {
    position: absolute;
    left: 2.0833vw;
    top: 2.8646vw;
    width: 2.0833vw;
    height: 2.0833vw;
    z-index: 1000;
  }

  .speedReduce {
    position: absolute;
    left: 2.0833vw;
    top: 11.9792vw;
    width: 2.0833vw;
    height: 2.0833vw;
    z-index: 1000;
  }

  .speedNum {
    position: absolute;
    left: 2.6042vw;
    top: 7.5521vw;
    font-size: 1.7188vw;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #ffffff;
  }

  .speedControl {
    width: 6.1806vw;
    height: 16.6667vw;
    background: #ffffff;
    border-radius: 4.4271vw;
    opacity: 0.4;

    .speedDirection {
      width: 3.6979vw;
      height: 14.0625vw;
      background: #004c81;
      border-radius: 4.9479vw;
      opacity: 0.24;
      position: absolute;
      left: 1.28vw;
      bottom: 1.2556vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.joystickBkL {
  position: absolute;
  left: 13.8889vw;
  bottom: 7.9861vw;
  z-index: 999;
}

.joystickBkR {
  position: absolute;
  right: 13.8889vw;
  bottom: 7.9861vw;
  z-index: 999;
}

#zone_joystickL {
  position: absolute;
  left: 20.8333vw;
  bottom: 15.2778vw;
}

#zone_joystickR {
  position: absolute;
  right: 20.8333vw;
  bottom: 15.2778vw;
}

.controlStatus {
  position: absolute;
  left: 35.25vw;
  bottom: 11vh;
  width: 27.0313vw;
  height: 10.2vh;
  border-radius: 3.0729vw;
  padding: .8854vw 1.25vw;
  border: .1042vw solid rgba(255, 255, 255, 0.3);
  z-index: 999;
  display: flex;
  align-items: end;
  justify-content: center;
}

.controlActivated {
  position: absolute;
  left: 35.25vw;
  bottom: 11vh;
  width: 27.0313vw;
  height: 30.2605vw;
  padding: .8854vw 1.25vw;
  background-image: url("../../assets/images/image_controlBk.png");
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.controlBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;

  .choseBox {
    width: 9.2708vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chose {
    background: rgba(0, 0.294, 0.522, 0.3);
    border-radius: 2.2396vw;
  }

  .txt {
    font-size: 1.7188vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
  }
}

.actionBox {
  height: 15.1563vw;
  width: 21.9792vw;
  padding: 3.125vw 3.8021vw;
  display: flex;
  flex-wrap: wrap;

  .actionItem {
    text-align: center;
    flex-basis: 33.33%;
    font-size: 1.25vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
  }

  .actionImg {
    width: 2.2917vw;
    height: 2.2917vw;
  }
}

.modeBox {
  height: 14.375vw;
  width: 13.5417vw;
}

.stateBox {
  width: 100%;
  height: 100%;
  background: rgba(0, 75, 133, 0.3);
  border-radius: 3.0729vw;
  font-size: 1.7188vw;
  font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
  font-weight: normal;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
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
    color: #FFFFFF;
  }

  .arrow {
    position: absolute;
    top: 1.2vw;
    left: 8.34vw;
    width: 0;
    height: 0;
    background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
    border-left: .4167vw solid transparent;
    border-right: .4167vw solid transparent;
    border-top: .5208vw solid #FFFFFF;
  }
}

.headBox {
  position: absolute;
  top: 4.453123vw;
  left: 10.9375vw;
  width: 13.5417vw;
  height: 11.4334vw;
  padding: 1.4708vw 0;
  background: rgba(0, 75, 133, 0.3);
  border: .1042vw solid rgba(68, 216, 251, 0.3);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: 1.7188vw;
  font-family: AlibabaPuHuiTiR;
  color: #FFFFFF;

  .divider {
    height: 0.1042vw;
    width: 11.9792vw;
    background: #ffffff;
    opacity: 0.3;
  }
}

.stateMessage {
  position: absolute;
  left: 50%;
  top: 10vw;
  transform: translate(-50%, -50%);
  width: 12.5vw;
  height: 3.1073vw;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  z-index: 999;
  font-size: 1.25vw;
  font-family: AlibabaPuHuiTiR;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
   
<template>
  <div>
    <div class="container">
      <div ref="videoContainer" align="center" class="video-container">
        <div class="video-item">
          <img class="video-play" :src="videoSrc" />
        </div>
      </div>
      <div class="videoBox">
        <rtc-header :currentSpeed="current_speed" :camera="true" @hangUp="hangUp"></rtc-header>
        <!-- Stop按钮 -->
        <div class="rightControl" v-show="!dialogChatVisible">
          <div>
            <img class="stopImg" src="@/assets/images/icon_stop.png" @click="quickStop()" v-if="!isStoped" />
            <img class="stopImg" src="@/assets/images/icon_restart.png" @click="quickStop()" v-else />
          </div>
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
        <!-- 摇杆操控区 -->
        <div class="handle">
          <img :class="minusD ? 'clockwiseB anti' : 'clockwise anti'" src="@/assets/images/icon_anti-clockwise.png" />
          <img :class="plusD ? 'clockwiseB normal' : 'clockwise normal'" src="@/assets/images/icon_clockwise.png" />
          <div class="rightButton">
            <div class="rDirection">
              <div @click="minusD1()" class="rTap"></div>
              <div @click="plusD1()" class="rTap"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 虚拟摇杆 -->
      <div class="joystickBk">
        <img style="width: 13.8889vw; height: 13.8889vw; z-index: 999" src="@/assets/images/image_direction.png" />
      </div>
      <div id="zone_joystick"></div>
    </div>
  </div>
</template>
<script>
import nipplejs from "nipplejs";
import RtcHeader from "@/components/rtcHeader.vue";
import rtcLeftControl from "@/components/rtcLeftControl.vue";
import { getType, hStop } from "@/request/control"
import { cameraOpen } from "@/request/camera"
import { mapState } from "vuex";
export default {
  components: { RtcHeader, rtcLeftControl },
  computed: {
    ...mapState(['controlType', 'iP'])
  },
  data() {
    return {
      ws: "",
      videoContainer: "",
      buttons: "",
      joystick: null,
      screenWidth: document.body.clientWidth,
      plusD: false,
      minusD: false,
      direction: 0,
      gamepadConnected: false,
      isStoped: false,
      speed: 1,
      current_speed: 0, //当前速度，默认0
      videoSrc: "", //摄像头视频路径
    };
  },
  created() {
    let wsUrl = 'ws' + process.env.VUE_APP_URL.slice(4) + '/ws'
    this.ws = new WebSocket(wsUrl)
    let _this = this
    window.addEventListener("gamepadconnected", function (e) {
      const gp = navigator.getGamepads()[e.gamepad.index];
      console.log("手柄连接", gp);
      _this.gamepadConnected = true;
      _this.startGamepad(); // 启动手柄
    });
    window.addEventListener("gamepaddisconnected", function (e) {
      _this.gamepadConnected = false;
      clearInterval(this.interval); // 停止获取手柄数据
      console.log("手柄断开", e);
    });
  },
  async mounted() {
    this.videoContainer = this.$refs.videoContainer;
    this.startFullScreen(); //强制全屏
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    this.cameraOpen()
    this.startJoystick(); //生成虚拟摇杆
    const typeRes = await getType()
    console.log('typeRes', typeRes)
    let currIP = {}
    currIP.host = typeRes.data.data.host
    currIP.port = Number(typeRes.data.data.port)
    this.$store.commit('setIP', currIP)
    console.log(typeRes.data.data.type)
    this.connectWss();
  },
  beforeDestroy() {
    let _this = this
    window.removeEventListener('gamepadconnected', function (e) {
      const gp = navigator.getGamepads()[e.gamepad.index];
      console.log("手柄连接beforeDestroy", gp);
      _this.gamepadConnected = true;
      _this.startGamepad(); // 启动手柄
    });
    window.removeEventListener('gamepaddisconnected', function (e) {
      _this.gamepadConnected = false;
      clearInterval(this.interval); // 停止获取手柄数据
      console.log("手柄断开beforeDestroy", e);
    });
  },
  destroyed() {
    clearInterval(this.interval);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  },
  watch: {
    //屏幕尺寸变化后，重新生成joystick适配当前尺寸
    screenWidth: function (n, o) {
      console.log("屏幕变化", n);
      if (this.joystick) {
        this.joystick.destroy();
        this.startJoystick();
      }
    },
  },
  methods: {
    // 开始
    connectWss() {
      this.ws.onopen = (event) => {
        console.log("connect WebSocket is ok: ", event);
      };
      this.ws.onmessage = (msg) => {
        console.log('WS返回信息22222。。。。======', msg)
        const str = msg.data.toString();
        const json = JSON.parse(str);
        switch (json.type) {
          case "conn":
            console.log("连接成功", json);
            break;
          case "speed":
            this.current_speed = json.speed;
          case "action":

            break;
        }
      };
    },
    // 启动手柄
    startGamepad() {
      const _this = this;
      // 每10ms 获取一次手柄数据，查看是否按下手柄按键
      this.interval = setInterval(function () {
        let gamepad = null;
        navigator.getGamepads().forEach((item) => {
          if (item) gamepad = item;
        });
        // console.log("手柄实时数据", gamepad);
        _this.pressKey(gamepad.buttons);
        _this.remoteSensing(gamepad.axes);

        let size = (_this.screenWidth * 100) / 1440;
        _this.joystick[0].setPosition(1, {
          x: gamepad.axes.slice(0, 2)[0] * size,
          y: gamepad.axes.slice(0, 2)[1] * size,
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
        velocity = 0
      }
      console.log(
        "实时坐标---前后",
        (velocity * this.speed) / 6.25,
        "实时坐标---左右角度",
        angle / -90 * 0.2,
        'host',
        this.iP.host,
        'port',
        this.iP.port
      );
      this.operateHuman(angle / -90 * 0.2, (velocity * this.speed) / 6.25)

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
    //退出全屏
    ExitFullScreen() {
      var el = document;
      var cfs =
        el.cancelFullScreen || el.webkitCancelFullScreen || el.exitFullScreen;
      if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
      } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      } else if (el.msExitFullscreen) {
        el.msExitFullscreen();
      } else if (el.oRequestFullscreen) {
        el.oCancelFullScreen();
      } else if (el.mozCancelFullScreen) {
        el.mozCancelFullScreen();
      } else {
        alert("浏览器不支持全屏调用！");
      }
    },
    //开启虚拟触控摇杆
    startJoystick() {
      const _this = this;
      let sWidth = parseInt(this.screenWidth * 16.67 * 0.01);
      _this.joystick = nipplejs.create({
        zone: document.getElementById("zone_joystick"),
        mode: "static",
        position: { left: "20%", top: "70%" },
        color: "white",
        size: sWidth,
      });
      _this.joystick
        .on("start", function (evt, data) {
          if (!_this.gamepadConnected) {
            _this.time = setInterval(() => {
              // console.log("startstart", evt, data);
              _this.onStart && _this.onStart(_this.distance, _this.angle);
            }, 5);
          }
        })
        .on("move", function (evt, data) {
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
            console.log(velocity)
            if (Math.abs(velocity) < 0.1) {
              velocity = 0
            }
            console.log(
              "实时坐标---前后",
              (velocity * _this.speed) / 6.25,
              "实时坐标---左右角度",
              angle / -90,
              'host',
              _this.iP.host,
              'port',
              _this.iP.port
            );
            // _this.operateHuman(angle / -90 * 0.2, (velocity * _this.speed) / 6.25)
          }
        })
        .on("end", function (evt, data) {
          if (!_this.gamepadConnected) {
            //摇杆回原点后速度方向归零
            // _this.operateHuman(0, 0)
            clearInterval(_this.time);
            _this.onEnd && _this.onEnd();
          }
        });
    },
    //紧急停止
    quickStop() {
      hStop(this.iP)
        .then((res) => {
          console.log("humanStop--stop", res);
        })
        .catch((err) => {
          console.log(err);
        })
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
      const msg = JSON.stringify({
        type: "command",
        client_type: "human",
        command: "walk",
        host: this.iP.host,
        port: this.iP.port,
        walk_vx: velocity,
        walk_vc: direction,
        walk_vy: 0,
        walk_vz: 0,
        walk_va: 0,
        walk_vb: 0
      });
      this.ws.send(msg);
    },
    cameraOpen() {
      console.log('baseUrl.......', process.env.VUE_APP_URL)
      cameraOpen().then(res => {
        console.log(res)
        if (res.data.data)
          this.videoSrc = process.env.VUE_APP_URL + "/control/camera"
      }).catch(err => {

      })
    },
  },
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
  background-color: #000;
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

.rightControl {
  position: absolute;
  right: 5vw;
  top: 8.3333vw;
  z-index: 9999;
}

.stopImg {
  width: 3.9583vw;
  height: 3.9583vw;
  margin: auto;
}

.speedBox {
  position: absolute;
  right: 3.5vw;
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

.handle {
  position: absolute;
  right: 11.1111vw;
  bottom: 6.9444vw;
  z-index: 999;

  .clockwise {
    position: absolute;
    width: 1.458213vw;
    height: 1.25vw;
  }

  .clockwiseB {
    position: absolute;
    width: 2.7778vw;
    height: 2.3334vw;
  }

  .anti {
    left: 4.1667vw;
    bottom: 7.2917vw;
  }

  .normal {
    right: 3.4722vw;
    bottom: 7.2917vw;
  }

  .rightButton {
    height: 16.6667vw;
    width: 16.6667vw;
    background: #ffffff;
    opacity: 0.6;
    border-radius: 50%;

    .rDirection {
      position: absolute;
      left: 2.4306vw;
      bottom: 5.5556vw;
      background: #004c81;
      width: 12.2917vw;
      height: 4.9306vw;
      border-radius: 2.4306vw;
      opacity: 0.24;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rTap {
        width: 4.1667vw;
        height: 4.8611vw;
      }
    }
  }
}

.joystickBk {
  position: absolute;
  left: 13.8889vw;
  bottom: 7.9861vw;
  z-index: 999;
}

#zone_joystick {
  position: absolute;
  left: 20.8333vw;
  bottom: 15.2778vw;
}
</style>
   
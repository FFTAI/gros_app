<template>
  <div>
    <div class="container">
      <div ref="videoContainer" align="center" class="video-container">
        <div class="video-item">
          <img class="video-play" :src="videoSrc" />
        </div>
      </div>
      <div class="videoBox">
        <rtc-header :currentSpeed="current_speed" @hangUp="hangUp"></rtc-header>
        <rtc-left-control v-if="controlType == 1" :showMode="showMode" :showAction="showAction" :modeSrc="modeSrc"
          :actionSrc="actionSrc" @choseAction="choseAction" @choseMode="choseMode" @doCamera="doCamera"
          @findingWay="findingWay">
        </rtc-left-control>
        <human-control v-else></human-control>
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
        <div class="leftButton">
          <div class="lbTop">
            <div :class="topD ? 'arrowB' : 'arrow'" class="aTop"></div>
          </div>
          <div class="lbMiddle">
            <div :class="leftD ? 'arrowB' : 'arrow'" class="aLeft"></div>
            <div :class="rightD ? 'arrowB' : 'arrow'" class="aRight"></div>
          </div>
          <div class="lbBottom">
            <div :class="bottomD ? 'arrowB' : 'arrow'" class="aBottom"></div>
          </div>
        </div>
      </div>
      <!-- 虚拟摇杆 -->
      <div class="joystickBk">
        <img style="width: 13.8889vw; height: 13.8889vw; z-index: 999" src="@/assets/images/image_direction.png" />
      </div>
      <div id="zone_joystick"></div>
      <!-- chatgpt对话框 -->
      <el-dialog :visible.sync="dialogChatVisible" custom-class="dialogClass" center>
        <div slot="title" class="dialogLogo">智能动作设计</div>
        <div class="dialogInput">
          <el-autocomplete class="inline-input" v-model="chatContent" :fetch-suggestions="querySearch" placeholder="请输入内容"
            @select="handleSelect" prefix-icon="el-icon-edit">
          </el-autocomplete>
          <div class="askButton" slot="append" @click="askQuestion()">
            <img style="width: 24px; height: 24px" src="@/assets/images/icon_search.png" />
          </div>
        </div>
        <div class="dialogResponse">
          <div class="responseIn" v-if="chatVisible == 1">
            <div style="padding: 0.5208vw 0">正在设计中...</div>
            <i class="el-icon-loading"></i>
          </div>
          <div class="responseIn rTxt" v-else-if="chatVisible == 2">
            {{ chatResponse }}
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <div class="startButton" slot="append" @click="performance()">
            开 始
          </div>
        </div>
      </el-dialog>
      <!-- 动作表演弹出框 -->
      <el-dialog :visible.sync="dialogPerfVisible" custom-class="dialogClass" center :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <div slot="title" class="dialogLogo">动作表演中</div>
        <div class="dialogResponse">
          <div class="responseIn rTxt">
            {{ chatResponse }}
          </div>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogApVisoble" custom-class="dialogClass" center>
        <div slot="title" class="dialogLogo">连接模式</div>
        <div class="dialogResponse">
          <div class="responseIn">
            <el-card :body-style="cardStyle">
              直连模式
            </el-card>
          </div>
          <div class="responseIn">
            <el-card :body-style="cardStyle">
              路由器模式
            </el-card>
          </div>
        </div>
      </el-dialog>
      <!-- 障碍物提示警告条 -->
      <el-alert title="周围有障碍物注意避让！！！" type="error" show-icon :closable="false" v-if="showWarning" class="alertWarning">
      </el-alert>
    </div>
  </div>
</template>
<script>
import nipplejs from "nipplejs";
import RtcHeader from "@/components/rtcHeader.vue";
import rtcLeftControl from "@/components/rtcLeftControl.vue";
import humanControl from "@/components/humanControl.vue";
import { closeRoom, remoteContr } from "@/request/room";
import { getType, changeMode, qStop, play, mStop, hStop } from "@/request/control"
import { sendMsg } from "@/request/chatgpt";
import { cameraOpen } from "@/request/camera"
import { mapState } from "vuex";
export default {
  components: { RtcHeader, rtcLeftControl, humanControl },
  computed: {
    ...mapState(['controlType', 'iP'])
  },
  data() {
    return {
      roomName: "",
      ws: "",
      localStream: "",
      pcList: [],
      videoContainer: "",
      offerOptions: {
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 1,
      },
      buttons: "",
      leftAxes: [],
      rightAxes: [],
      joystick: null,
      screenWidth: document.body.clientWidth,
      keyCode: undefined,
      plusD: false,
      minusD: false,
      topD: false,
      leftD: false,
      rightD: false,
      bottomD: false,
      direction: 0,
      location: 0,
      gamepadConnected: false,
      type: undefined,
      timeOut: null,
      modeSrc: [
        {
          name: "home",
          src: require("@/assets/images/btn_home.png"),
        },
        {
          name: "twoWheels",
          src: require("@/assets/images/btn_two_wheels.png"),
        },
        {
          name: "threeWheels",
          src: require("@/assets/images/btn_three_wheels.png"),
        },
        {
          name: "fourWheels",
          src: require("@/assets/images/btn_four_wheels.png"),
        }
      ],
      actionSrc: [
        {
          name: "action",
          src: require("@/assets/images/btn_action.png"),
        },
        {
          name: "rotation",
          src: require("@/assets/images/btn_self_rotation.png"),
        },
        {
          name: "graphics",
          src: require("@/assets/images/btn_graphics.png"),
        },
        {
          name: "chatgpt",
          src: require("@/assets/images/btn_GTP.png"),
        },
        {
          name: "wayfinding",
          src: require("@/assets/images/btn_upper.png"),
        },
      ],
      showMode: false,
      showAction: false,
      currentMode: "home",
      currentAction: "",
      isStoped: false,
      speed: 1,
      actionLoading: undefined,
      mode: 0, // 0-home 2-两轮 3-三轮 4-四轮
      current_speed: 0, //当前速度，默认0
      dialogChatVisible: false,
      dialogPerfVisible: false,
      chatContent: "",
      chatResponse: "",
      chatOrder: "",
      chatVisible: 0,
      suggestions: [
        //gpt输入建议
        { value: "编写一段中国风动作", content: "1" },
        { value: "编写一段阿拉伯风格的动作", content: "2" },
        { value: "编写一段欢快一点的动作", content: "3" },
        { value: "编写一段小心谨慎动作", content: "4" },
        { value: "编写一段兴高采烈动作", content: "5" },
      ],
      slamJson: undefined, //slam的值
      showWarning: false,
      warningTimeout: undefined,
      slamOn: true, //slam开关
      findWay: false, //自动寻路状态
      autoRotate: false, //自动巡航旋转状态
      videoSrc: "", //摄像头视频路径
      dialogApVisoble: false, //连接模式弹窗
      cardStyle: {
        background: '#2ca8d3',
        color: '#ffffff'
      }
    };
  },
  created() {
    this.roomName = this.$route.query.roomName;
    this.streamId = this.$route.query.streamId;
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
    let _this = this;
    this.videoContainer = this.$refs.videoContainer;
    this.startFullScreen(); //强制全屏
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    this.cameraOpen()
    this.startJoystick(); //生成虚拟摇杆
    this.actionLoading = this.$loading({
      lock: true,
      text: "正在启动中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const typeRes = await getType()
    console.log('typeRes', typeRes)
    let currIP = {}
    currIP.host = typeRes.data.data.host
    currIP.port = Number(typeRes.data.data.port)
    this.$store.commit('setIP', currIP)
    switch (typeRes.data.data.type) {
      case 'car':
        this.$store.commit('setControlType', 1)
        break;
      case 'dog':
        this.$store.commit('setControlType', 2)
        break;
      case 'human':
        this.$store.commit('setControlType', 3)
        break;
      default:
        break;
    }
    if (this.controlType == 1) {
      this.mode = 590338;
      changeMode(this.mode, this.iP)
        .then((res) => {
          console.log("启动时切换Home模式", res);
          setTimeout(() => {
            this.closeLoading();
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else if (this.controlType == 3) {
      // let zeroRes = await zero(this.iP)
      // if (zeroRes.data.code == 0 && zeroRes.data.msg == 'ok') {
      //   setTimeout(() => {
      //     this.closeLoading();
      //   }, 2000);
      // }
      // console.log('zeroRes', zeroRes)

      this.closeLoading();
    }

    this.connectWss();
    document.onkeydown = function (e) {
      if (_this.gamepadConnected) return;
      _this.keyCode = window.event.keyCode;
      console.log(_this.keyCode);
      switch (_this.keyCode) {
        case 87:
          _this.topD = true;
          if (_this.location > _this.speed / -5) _this.location -= 0.01;
          break;
        case 83:
          _this.bottomD = true;
          if (_this.location < _this.speed / 5) _this.location += 0.01;
          break;
        case 65:
          _this.leftD = true;
          if (_this.direction > -1) _this.direction -= 0.05;
          break;
        case 68:
          _this.rightD = true;
          if (_this.direction < 1) _this.direction += 0.05;
          break;
        case 40:
          if (_this.speed > 1) _this.speed -= 1;
          break;
        case 38:
          if (_this.speed < 5) _this.speed += 1;
          break;
        default:
          break;
      }
      console.log("实时坐标", _this.location, _this.direction);
      _this.operateCar(_this.direction, _this.location)
    };
    document.onkeyup = function (e) {
      if (_this.gamepadConnected) return;
      console.log(_this.gamepadConnected);
      _this.location = 0;
      _this.direction = 0;
      _this.keyCode = window.event.keyCode;
      console.log(e, _this.keyCode);
      switch (_this.keyCode) {
        case 87:
          _this.topD = false;
          break;
        case 83:
          _this.bottomD = false;
          break;
        case 65:
          _this.leftD = false;
          break;
        case 68:
          _this.rightD = false;
          break;
        case 37:
          _this.minusD = false;
          break;
        case 39:
          _this.plusD = false;
          break;
        default:
          break;
      }
    };
    window.addEventListener("beforeunload", (e) => {
      console.log("beforeunload", e);
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      remoteContr(this.roomName, 0)
        .then((data) => console.log("remoteContr", data))
        .catch((err) => console.error("remoteContr", err));
    });
    this.$webview = plus.webview.currentWebview();
    // 监听Android的返回键点击事件
    plus.key.addEventListener('backbutton', () => {
      // if (this.$webview.canBack()) {
      //   // 如果可以返回上一页，则返回上一页
      //   this.$webview.back();
      // } else {
      //   // 不能返回上一页，则退出App
      plus.runtime.quit();
      // }
    });
  },
  beforeDestroy() {
    // 销毁定时器
    // this.$once("hook:beforeDestroy", () => {
    //   if (this.slamTimer) clearInterval(this.slamTimer);
    // });
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
    remoteContr(this.roomName, 0)
      .then((data) => console.log("remoteContr", data))
      .catch((err) => console.error("remoteContr", err));
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
        const sendJson = JSON.stringify({
          type: "conn",
          userName: "view",
        });
        this.ws.send(sendJson); // 注册用户名
      };
      this.ws.onmessage = (msg) => {
        console.log('WS返回信息22222。。。。======', msg)
        const str = msg.data.toString();
        const json = JSON.parse(str);
        switch (json.type) {
          case "conn":
            console.log("连接成功", json);
            this.joinRoom(this.roomName, this.streamId);
            break;
          case "close":
            console.log("收到房间内用户离开", json);
            this.closeRoomUser(json);
            break;
          case "speed":
            this.current_speed = json.speed;
          // eslint-disable-next-line no-fallthrough
          case "action":
            //表演结束后关闭遮罩，切换到Home模式
            if (json.status == "done" && this.actionLoading && !this.findWay) {
              for (let i = 0; i < this.modeSrc.length; i++) {
                const element = this.modeSrc[i];
                if (element.name == "home") this.choseMode(i, "q");
              }
              setTimeout(() => {
                this.stopMusic()
                this.closeLoading();
              }, 10000);
            }
            if (json.status == "done" && this.dialogPerfVisible) {
              setTimeout(() => {
                this.dialogPerfVisible = false;
              }, 10000);
            }
            if (json.status == "done" && this.findWay) {
              console.log("障碍物躲避动作结束");
              this.autoRotate = false;
              const msg = JSON.stringify({
                type: "command",
                client_type: "car",
                command: "action",
                action: "stop_v4",
              });
              this.ws.send(msg);
              if (
                this.currentMode == "fourWheels" &&
                this.slamOn &&
                !this.isStoped
              ) {
                setTimeout(() => {
                  changeMode(592385, this.iP)
                    .then((res) => {
                      setTimeout(() => {
                        this.findingWay();
                      }, 3000);
                    })
                    .catch((err) => {
                      this.findWay = false;
                    });
                }, 1000);
              }
            }
          case "slam":
          // console.log("slam响应", json);
          // this.slamJson = json.slam.data;
          default:
            break;
        }
      };
    },
    // 加入房间
    joinRoom(roomName, streamId) {
      const str = JSON.stringify({
        type: "room",
        roomName: roomName,
        streamId: streamId,
      });
      this.ws.send(str);
      // 加入房间修改房间状态为1 代表远控进行中 挂断的时候修改为0或者其他 代表空闲
      remoteContr(roomName, 1)
        .then((data) => {
          console.log("remoteContr", data);
        })
        .catch((err) => {
          console.error("remoteContr", err);
        });
    },
    // 房间内用户离开
    closeRoomUser(json) {
      alert("设备离线或断开");
      const { sourceName, streamId } = json;
      const index = this.pcList.findIndex((i) => i.userName === sourceName);
      if (index > -1) {
        this.pcList.splice(index, 1);
      }
      this.removeUserItem(streamId);
      // 关闭房间
      closeRoom(this.roomName)
        .then((data) => {
          console.log("closeRoom", data);
        })
        .catch((err) => {
          console.error("closeRoom", err);
        });
      this.$router.push({
        path: "rooms",
      });
    },
    // 挂断
    hangUp() {
      console.log("挂断");
      plus.runtime.quit();

      // if (this.localStream) {
      //   this.localStream.getTracks().forEach((track) => track.stop());
      //   this.localStream = null;
      // }
      // this.pcList.forEach((element) => {
      //   element.pc.close();
      //   element.pc = null;
      // });
      // this.pcList.length = 0;
      // if (this.ws) {
      //   this.ws.close();
      //   this.ws = null;
      // }
      // this.videoContainer.innerHTML = "";
      // remoteContr(this.roomName, 0)
      //   .then((data) => {
      //     console.log("remoteContr", data);
      //   })
      //   .catch((err) => {
      //     console.error("remoteContr", err);
      //   });
      // // 离开房间
      // this.$router.replace({ path: "/rooms" });
    },
    // 移除用户
    removeUserItem(streamId) {
      this.videoContainer.removeChild(
        document.getElementById(streamId + "_item")
      );
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
      // console.log("获得的slam值。。。。。。", JSON.stringify(this.slamJson));
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
      if (this.controlType == 1) {
        let range = 800 + this.speed * 150;
        console.log(
          "实时坐标---前后",
          v,
          "实时坐标---左右角度",
          angle,
          "range范围：",
          range
        ); //后正，右正
        //根据雷达分区屏蔽障碍物，设定对应扇区的死区
        if (this.slamOn && this.useSlam(angle, v, range)) {
          v = 0;
          angle = 0;
        }
        if (!this.autoRotate) {
          // this.ws.send(
          //   JSON.stringify({
          //     type: "slam",
          //   })
          // );
          this.operateCar(angle / 90, (v * this.speed) / 5)
        }
      }
      if (this.controlType == 3) {
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
      }
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
      if (!this.plusD && !this.minusD) this.direction = 0;
    },
    //强制全屏进入
    startFullScreen() {
      var el = document.documentElement;
      //element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
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
      //el.cancelFullScreen || el.mozCancelFullScreen || el.msExitFullscreen || el.webkitExitFullscreen || el.exitFullscreen
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
          // console.log(
          //   "实时坐标---前后",
          //   v,
          //   "实时坐标---左右角度",
          //   direction
          // );
          let sin = direction / Math.abs(v);
          let angle = (Math.asin(sin) * 180) / Math.PI;
          if (Math.abs(velocity) < 0.1) v = 0;
          if (Math.abs(direction) < 0.1) angle = 0;
          //四轮车控制
          if (!_this.gamepadConnected && _this.controlType == 1) {
            let range = 800 + _this.speed * 150;
            console.log(
              "实时坐标---前后",
              v,
              "实时坐标---左右角度",
              angle,
              "range范围：",
              range
            ); //后正，右正
            //根据雷达分区屏蔽障碍物，设定对应扇区的死区
            if (_this.slamOn && _this.useSlam(angle, v * -1, range)) {
              v = 0;
              angle = 0;
            }
            if (!_this.autoRotate) {
              // _this.ws.send(
              //   JSON.stringify({
              //     type: "slam",
              //   })
              // );
              _this.operateCar(angle / 90, (v * _this.speed) / -5)
            }
          }
          //人形控制
          if (!_this.gamepadConnected && _this.controlType == 3) {
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
            _this.operateHuman(angle / -90 * 0.2, (velocity * _this.speed) / 6.25)
          }
        })
        .on("end", function (evt, data) {
          if (!_this.gamepadConnected) {
            //摇杆回原点后速度方向归零
            if (_this.controlType == 1) {
              _this.operateCar(0, 0)
            } else {
              _this.operateHuman(0, 0)
            }
            clearInterval(_this.time);
            _this.onEnd && _this.onEnd();
          }
        });
    },
    //紧急停止
    quickStop() {
      if (this.controlType == 3) {
        hStop(this.iP)
          .then((res) => {
            console.log("humanStop--stop", res);
          })
          .catch((err) => {
            console.log(err);
          })
      } else {
        if (!this.timeOut) {
          if (this.isStoped) {
            for (let i = 0; i < this.modeSrc.length; i++) {
              const element = this.modeSrc[i];
              if (element.name == "home") {
                this.choseMode(i, "q")
                  .then((res) => {
                    console.log("quickStop--restart", res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            } // 停止状态下默认恢复成home
          } else {
            if (this.actionLoading) this.closeLoading();
            if (this.dialogPerfVisible) this.dialogPerfVisible = false;
            if (this.findWay) this.findWay = false;
            if (this.wayInterval) clearInterval(this.wayInterval);
            qStop(this.iP)
              .then((res) => {
                console.log("quickStop--stop", res);
              })
              .catch((err) => {
                console.log(err);
              });
          }
          this.isStoped = !this.isStoped;
          this.timeOut = setTimeout(() => {
            this.timeOut = null;
          }, 5000);
        }
      }

    },
    /**
     * 状态切换
     * 4 --- 592385
     * 3 --- 592386
     * 2 --- 592387
     */
    async choseMode(e, q) {
      if (e != 0) {
        this.currentMode = this.modeSrc[e].name;
        this.modeSrc[e] = this.modeSrc.splice(0, 1, this.modeSrc[e])[0];
        let mode = 590338;
        switch (this.currentMode) {
          case "home":
            mode = 590338;
            break;
          case "fourWheels":
            mode = 592385;
            await this.playMuisc('start')
            break;
          case "threeWheels":
            mode = 592386;
            await this.playMuisc('start')
            break;
          case "twoWheels":
            mode = 592387;
            await this.playMuisc('start')
            break;
          default:
            break;
        }
        this.mode = mode;
        try {
          await changeMode(this.mode, this.iP);
        } catch (error) {
          console.error("切换模式出错！！！", error);
        }
      }
      if (this.showAction) this.showAction = false;
      //急停和表演结束后切换状态
      if (q == "q" && e != 0) {
        this.showMode = false;
      } else if (q == "q" && e == 0) {
        this.showMode = false;
        try {
          await changeMode(590338, this.iP);
        } catch (error) {
          console.error("切换模式出错！！！", error);
        }
      } else {
        this.showMode = !this.showMode;
      }
      console.log("状态切换", this.currentMode, this.modeSrc);
    },
    /**
     * 动作切换
     * 旋转 --- 592388
     */
    choseAction(e) {
      if (e != 0 && e != 3) {
        if (this.actionLoading) this.closeLoading();
        this.currentAction = this.actionSrc[e].name;
        // this.actionSrc[e] = this.actionSrc.splice(0, 1, this.actionSrc[e])[0];
        this.actionPlay();
      } else if (e == 3) {
        this.dialogChatVisible = true;
      }
      if (this.showMode) this.showMode = false;
      if (e == 0) this.showAction = !this.showAction;
    },
    // 动作表演
    actionPlay() {
      const msg = JSON.stringify({
        type: "command",
        client_type: "car",
        command: "action",
        action: this.currentAction,
        gear: this.speed,
      });
      this.ws.send(msg);
      this.playMuisc('find')
      this.actionLoading = this.$loading({
        lock: true,
        text: "正在表演中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
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
    //向chatgpt提问
    askQuestion() {
      this.chatVisible = 1;
      sendMsg(this.chatContent, false)
        .then((res) => {
          if (res.content == "error") {
            this.chatResponse = "chatgpt出错啦！！！";
            this.$message.error("chatgpt出错啦！！！");
            return;
          }
          setTimeout(() => {
            this.chatVisible = 2;
            let resContent = res.data.choices[0].message.content;
            if (resContent.replace(/\s*/g, "").match(/start(\S*)end/)) {
              this.chatResponse = resContent
                .replace(/\s*/g, "")
                .match(/end(\S*)/)[1];
              this.chatOrder = resContent
                .replace(/\s*/g, "")
                .match(/start(\S*)end/)[1];
            } else {
              this.chatResponse = resContent;
              this.chatOrder = null;
            }
          }, 1000);
        })
        .catch((err) => {
          this.$message.error(res.data.content);
        });
    },
    // 执行chatgpt的动作表演
    performance() {
      if (this.chatOrder == null) return;
      this.dialogChatVisible = false;
      console.log("chatOrder...", this.chatOrder);
      const msg = JSON.stringify({
        type: "command",
        client_type: "car",
        command: "action",
        action: "custom",
        data: JSON.parse(this.chatOrder)
      });
      this.ws.send(msg);
      this.dialogPerfVisible = true;
    },
    querySearch(queryString, cb) {
      console.log("建议列表...", queryString, this.suggestions);
      var results = queryString
        ? this.suggestions.filter(this.createFilter(queryString))
        : this.suggestions;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (suggestions) => {
        return (
          suggestions.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    /**
     * 开启雷达避障功能
     * @param {*} angle 角度
     * @param {*} v 速度
     * @param {*} range 距离障碍物距离范围
     */
    useSlam(angle, v, range) {
      // 按四分区划分
      // let condition1 = false,
      //   condition2 = false,
      //   condition3 = false,
      //   condition4 = false;
      // for (const key in this.slamJson) {
      //   if (Object.hasOwnProperty.call(this.slamJson, key)) {
      //     const element = this.slamJson[key];
      //     if (element < range) {
      //       if (key >= 0 && key < 90 && angle >= 0 && v <= 0) condition1 = true; //右上区
      //       if (key >= 90 && key < 180 && angle >= 0 && v >= 0)
      //         condition2 = true; //右下区
      //       if (key >= 180 && key < 270 && angle <= 0 && v >= 0)
      //         condition3 = true; //左下区
      //       if (key >= 270 && key < 360 && angle <= 0 && v <= 0)
      //         condition4 = true; //左上区
      //     }
      //   }
      // }
      // let stopMoving =
      //   (condition1 && v <= 0) ||
      //   (condition4 && v <= 0) ||
      //   (condition2 && v >= 0) ||
      //   (condition3 && v >= 0);
      // if (
      //   (condition1 && condition2 && angle <= 0) ||
      //   (condition3 && condition4 && angle >= 0)
      // )
      //   stopMoving = false;

      //按前后两分区范围划分
      let stopMoving = false
      for (const key in this.slamJson) {
        if (Object.hasOwnProperty.call(this.slamJson, key)) {
          const element = this.slamJson[key];
          if (element < range) {
            if (((key >= 0 && key <= 60) || (ket >= 300 && key < 360)) && v < 0)
              stopMoving = true
            if (key >= 120 && key <= 240 && v > 0)
              stopMoving = true
          }
        }
      }
      if (stopMoving) {
        this.showWarning = true;
        return true;
      } else {
        this.showWarning = false;
      }
      return false;
    },
    /**
     * slam开关
     */
    switchSlam() {
      this.slamOn = !this.slamOn;
    },
    /**
     * 自动寻路
     */
    findingWay() {
      if (this.currentMode != "fourWheels") {
        this.$message.error("请先切换至四轮模式！");
        return;
      }
      if (!this.slamOn) {
        this.$message.error("请先打开雷达！");
        return;
      }
      if (this.isStoped) {
        this.$message.error("请先重启设备！");
      }
      this.findWay = true;
      this.actionLoading = this.$loading({
        lock: true,
        text: "自动巡航中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.wayInterval = setInterval(() => {
        let range = 800 + this.speed * 150;
        if (this.slamOn && this.useSlam(0, -1, range)) {
          //雷达开启并监测到障碍物时，做自旋动作
          console.log("碰到障碍物。。。。。");
          clearInterval(this.wayInterval);
          this.autoRotate = true;
          let rTime = (Math.floor(Math.random() * 5) + 3) * 1000; //生成3-7秒的随机自旋时间
          const msg = JSON.stringify({
            type: "command",
            client_type: "car",
            command: "action",
            action: "rotate",
            time: rTime
          });
          this.ws.send(msg);
        } else {
          //无障碍情况下自动执行，速度2档
          console.log("继续前行。。。。。");
          this.operateCar(0, -0.4)
        }
      }, 10);
    },
    doCamera() {
      // var pc = new RTCPeerConnection();
      // pc.createDataChannel("");
      // pc.createOffer().then(function (sdp) {
      //   var ipRegex = /(?:\d{1,3}\.){3}\d{1,3}/;
      //   var match = sdp.sdp.match(ipRegex);
      //   var localIP = match[0];
      //   console.log("Local IP: ", localIP); // 本地设备的IP地址
      // }).catch(function (e) {
      //   console.error(e);
      // });
      var ips = [];
      var pc = new RTCPeerConnection(null);
      pc.onicecandidate = function (e) {
        if (e.candidate === null) {
          pc.close();
          callback(ips); // 返回获取到的IP地址列表
        } else {
          var ipRegex = /(?:\d{1,3}\.){3}\d{1,3}/;
          var match = e.candidate.candidate.match(ipRegex);
          if (match && !ips.includes(match[0])) {
            ips.push(match[0]);
          }
        }
      };

      pc.createDataChannel(""); // 创建空的数据通道

      pc.createOffer().then(function (offer) {
        console.log("Local IPs: ", pc.setLocalDescription(offer));
      }).catch(function (e) {
        console.error(e);
      });
      // this.switchSlam();
    },
    //操控四轮车
    operateCar(direction, velocity) {
      const msg = JSON.stringify({
        type: "command",
        client_type: "car",
        command: "operate",
        direction: direction,
        velocity: velocity,
        mode: this.mode,
      });
      this.ws.send(msg);
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
    apDialog() {
      this.dialogApVisoble = true
    },
    //播放音效
    async playMuisc(type) {
      try {
        await play(type)
      } catch (error) {
        console.log(error)
      }
    },
    //停止播放音效
    async stopMusic() {
      try {
        await mStop(this.iP)
      } catch (error) {
        console.log(error)
      }
    },
    closeLoading() {
      this.actionLoading.close();
    },
    minusD1() {
      // console.log('state')
      // const msg = JSON.stringify({
      //   type: "command",
      //   client_type: "human",
      //   command: "listen",
      //   listen_type: "state",
      //   state: "on",
      //   host: this.iP.host,
      //   port: this.iP.port,
      // });
      // this.ws.send(msg);

      // stand(this.iP, {
      //   a: 10,
      //   b: 0,
      //   c: 0
      // }).then(res => {
      //   if (res.data.code == 0 && res.data.msg == 'ok') {
      //   }
      // }).catch(err => {

      // })
    },
    plusD1() {
      // console.log('sys_state')
      // const msg = JSON.stringify({
      //   type: "command",
      //   client_type: "human",
      //   command: "listen",
      //   listen_type: "sys_state",
      //   state: "on",
      //   host: this.iP.host,
      //   port: this.iP.port,
      // });
      // this.ws.send(msg);

      // stand(this.iP, {
      //   a: 0,
      //   b: 10,
      //   c: 0
      // }).then(res => {
      //   if (res.data.code == 0 && res.data.msg == 'ok') {
      //   }
      // }).catch(err => {

      // })
    }
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

/* .container{
    width: 100%;
    height: 100%;
    position: relative;
  } */

.videoBox {
  width: 100%;
  height: 100%;
  background-color: cadetblue;
  position: absolute;
}

.headBk {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 4.4444vw;
  z-index: 10;
  background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
  opacity: 0.4;
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

.apImg {
  width: 4.2708vw;
  height: 4.2708vw;
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

.leftButton {
  position: absolute;
  bottom: 8.2639vw;
  left: 14.35vw;
  height: 13.8889vw;
  width: 13vw;
  z-index: 999;

  .lbTop {
    width: 100%;
    height: 2.7778vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lbMiddle {
    width: 100%;
    height: 8.3333vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lbBottom {
    width: 100%;
    height: 2.7778vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    height: 0.9896vw;
    width: 0.9896vw;
    color: #ffffff;
    border-style: solid;
    border-width: 0.2688vw 0.2688vw 0 0;
  }

  .aTop {
    transform: rotate(-45deg);
  }

  .aRight {
    transform: rotate(45deg);
  }

  .aLeft {
    transform: rotate(-135deg);
  }

  .aBottom {
    transform: rotate(135deg);
  }

  .arrowB {
    height: 0.8333vw;
    width: 0.8333vw;
    color: #ffffff;
    border-style: solid;
    border-width: 0.2083vw 0.2083vw 0 0;
  }
}

.verticalDividing {
  position: absolute;
  left: 50vw;
  bottom: 18%;
  height: 28.4722vw;
  width: 1.3889vw;
  background-image: repeating-linear-gradient(to bottom,
      #ffffff 0,
      #ffffff 0.15em,
      transparent 0,
      transparent 5em),
    repeating-linear-gradient(to bottom,
      rgba(255, 255, 255, 0.5) 0,
      rgba(255, 255, 255, 0.5) 0.15em,
      transparent 0,
      transparent 1em);
  background-size: 1.1111vw 100%, 0.6944vw 100%;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  z-index: 999;
}

.verticalPoint {
  position: absolute;
  left: 48.6806vw;
  bottom: 29.5139vw;
  z-index: 999;
}

.horizontalDividing {
  position: absolute;
  bottom: 0;
  left: 2.7778vw;
  height: 2.0833vw;
  width: 95.1389vw;
  background-image: repeating-linear-gradient(to right,
      #ffffff 0,
      #ffffff 0.15em,
      transparent 0,
      transparent 5em),
    repeating-linear-gradient(to right,
      rgba(255, 255, 255, 0.5) 0,
      rgba(255, 255, 255, 0.5) 0.15em,
      transparent 0,
      transparent 1em);
  background-size: 100% 1.1111vw, 100% 0.6944vw;
  background-repeat: no-repeat;
  background-position: 0.05em 100%, 0.05em 100%, 0.05em 100%, 0.05em 100%;
  z-index: 999;
}

.horizontalPoint {
  position: absolute;
  bottom: 0;
  left: 22.2222vw;
  z-index: 999;
}

.pointFont {
  font-size: 1.9444vw;
  font-family: Roboto-Bold, Roboto;
  font-weight: bold;
  color: #ffffff;
  z-index: 999;
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

.dialogLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4583vw;
  font-family: Roboto-Bold, Roboto;
  font-weight: bold;
  color: #ffffff;
  line-height: 1.7188vw;
}

.logoPic {
  width: 14.7656vw;
  height: 3.3073vw;
  z-index: 999;
  padding-bottom: 4.1667vw;
}

.dialogInput {
  margin: 0 auto;
  width: 70%;
  display: flex;
}

.inline-input {
  width: 100%;
}

.askButton {
  width: 70px;
  height: 40px;
  background: linear-gradient(to bottom, #41bce7, #146caa);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.startButton {
  width: 8.6458vw;
  height: 2.9688vw;
  background: linear-gradient(to bottom, #41bce7, #146caa);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.25vw;
  font-family: Roboto-Medium, Roboto;
  font-weight: 500;
  color: #ffffff;
}

.dialogResponse {
  width: 41.6667vw;
  // height: 20.8333vw;
  padding: 2.6042vw;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.responseIn {
  text-align: center;
  font-size: 1.0938vw;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #ffffff;
  // width: 31.9792vw;
}

.rTxt {
  text-align: left;
  // line-height: 2vw;
}

.dialogClass {
  background: linear-gradient(to bottom, #2ca8d3, #004c81);
  opacity: 0.7;
  width: 49.2708vw;
  // height: 30.7813vw;
  position: relative;
  top: calc(50% - 42vh);
}

.dialog-footer {
  position: absolute;
  bottom: 5%;
  left: calc(50% - 4.3229vw);
}

.alertWarning {
  z-index: 9999;
  margin: 5vw auto;
  width: 50vw;
}

.cardImg-picLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5.6944vw;
  height: 5.6944vw;
  background: rgba(3, 44, 73, 0.5);
  border-radius: 50%;
}

.cardImg-colorF {
  border: .1389vw solid #3BCFAD;
}

.cardImg-colorL {
  border: .1389vw solid #DC4253;
}
</style>
  
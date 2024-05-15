<template>
  <div>
    <div class="container">
      <div ref="videoContainer" align="center" class="video-container">
        <div class="video-item common-bkg">
          <img class="video-play" :src="videoSrc" v-show="camera" />
        </div>
      </div>
      <div class="headBkIn" :class="sideVisible ? 'shortWidth' : 'fullWidth'">
        <div class="headReturn" @click="routerReturn()">
          <img class="return" src="@/assets/images/icon_return.png" />
        </div>
        <div class="headState">
          <span class="headTxt common-font">{{ $t("remoteMode") }}</span>
          <div class="cDivider"></div>
          <span class="actionTxt">{{ mode ? $t(mode) : '闲置' }}{{ $t("ing") }}…</span>
        </div>
        <div class="spacing flex-center">
          <div>
            <img class="inImg" style="width: 53px;height: 45px;" src="@/assets/images/icon_sRob.png" />
            <span class="inTxt title-font">80°C</span>
          </div>
          <div class="divider spacing"></div>
          <div>
            <img class="inImg" src="@/assets/images/icon_chipTem.png" />
            <span class="inTxt title-font">60°C</span>
          </div>
          <div class="divider spacing"></div>
          <div>
            <img class="inImg" src="@/assets/images/icon_battery2.png" />
            <span class="inTxt title-font">43%</span>
          </div>
          <div class="divider spacing"></div>
          <div>
            <img class="inImg" style="height: 1.6667vw; width: 2.2917vw" src="@/assets/images/icon_Wifi.png" />
          </div>
        </div>
      </div>

      <div class="bottomBox flex-between" :class="sideVisible ? 'shortWidth' : 'fullWidth'">
        <div class="leftBox flex-between">
          <div class="boxItem" v-if="mute" @click="micControl('on')">
            <img class="inImg" src="@/assets/images/icon_mic.png" />
            <span>静音</span>
          </div>
          <div class="boxItem" v-else @click="micControl('off')">
            <img class="inImg" src="@/assets/images/icon_mute.png" />
            <span>解除静音</span>
          </div>
          <div class="boxItem" v-if="!cameraOff" @click="cameraControl('on')">
            <img class="inImg" src="@/assets/images/icon_video.png" />
            <span>开始视频</span>
          </div>
          <div class="boxItem" v-else @click="cameraControl('off')">
            <img class="inImg" src="@/assets/images/icon_videoOff.png" />
            <span>停止视频</span>
          </div>
          <div class="boxItem">
            <img class="inImg" src="@/assets/images/icon_photo.png" />
            <span>拍照</span>
          </div>
          <div class="boxItem" v-if="!recording" @click="recordingControl('on')">
            <img class="inImg" src="@/assets/images/icon_record.png" />
            <span>录像</span>
          </div>
          <div class="boxItem" v-else @click="recordingControl('off')">
            <img class="inImg" src="@/assets/images/icon_recording.png" />
            <span>录像中</span>
          </div>
        </div>
        <div class="midBox flex-between">
          <div class="boxItem" :class="{ chosedItem: controlModel == 'stand' }" @click="changeControl('stand')">
            <img class="inImg" src="@/assets/images/icon_stand.png" />
            <span>站立</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'gait' }" @click="changeControl('gait')">
            <img class="inImg" src="@/assets/images/icon_Stepping.png" />
            <span>踏步</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'inPlace' }" @click="changeControl('inPlace')">
            <img class="inImg" src="@/assets/images/icon_inPlace.png" />
            <span>原地</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'grasping' }" @click="changeControl('grasping')">
            <img class="inImg" src="@/assets/images/icon_grasping.png" />
            <span>抓取</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'face' }" @click="changeControl('face')">
            <img class="inImg" src="@/assets/images/icon_face.png" />
            <span>表情</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'ai' }" @click="changeControl('ai')">
            <img class="inImg" src="@/assets/images/icon_AI.png" />
            <span>AI托管</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'setup' }" @click="changeControl('setup')">
            <img class="inImg" src="@/assets/images/icon_setup.png" />
            <span>设置</span>
          </div>
        </div>
        <div class="rightBox flex-between">
          <el-button type="warning" @click="doCalibration()">初始</el-button>
          <el-button type="danger" @click="stop()">急停</el-button>
        </div>
      </div>
      <div class="sideBox" v-if="sideVisible">
        <div class="title">
          <span>{{ titleName }}</span>
          <img style="width: 24px;height: 24px;" src="@/assets/images/icon_sClose.png" @click="closeSide()" />
        </div>
        <div class="sideContent">
          <div v-if="controlModel == 'inPlace'" class="actionItem" :class="{ chosedAction: item.name == mode }"
            v-for="(item, index) in inPlaceList" :key="index" @click="choseMode(item.name)">
            <img class="actionImg" :src="item.src" />
            <div>{{ $t(item.name) }}</div>
          </div>
          <div v-if="controlModel == 'grasping'" class="actionItem" :class="{ chosedAction: item.name == mode }"
            v-for="(item, index) in graspingList" :key="index" @click="choseMode(item.name)">
            <img class="actionImg" :src="item.src" />
            <div>{{ $t(item.name) }}</div>
          </div>
          <div v-if="controlModel == 'setup'" style="width: 100%;">
            <div class="setTab">
              <div class="tabItem">
                <span class="chosed">运动控制</span>
                <div class="cDivider" v-if="currentSetup == 'motion'"></div>
              </div>
              <div class="tabItem">
                <span>感知交互</span>
                <div class="cDivider" v-if="currentSetup == 'perceptual'"></div>
              </div>
              <div class="tabItem">
                <span>感知交互</span>
                <div class="cDivider" v-if="currentSetup == 'power'"></div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="speedControl">
              <span>行走速度</span>
              <div class="controlTag">
                <div class="tag" :class="{ chosedTag: speed == 1 }" @click="speedChange(1)">慢</div>
                <div class="tag" :class="{ chosedTag: speed == 2 }" @click="speedChange(2)">中</div>
                <div class="tag" :class="{ chosedTag: speed == 3 }" @click="speedChange(3)">快</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 当前状态提示 -->
    <div class="stateMessage flex-center" v-if="(mode != '' && doAction) ||
            (mode != '' && otherAction) ||
            mode == 'initial'
            ">
      <!-- <span>{{ $t(mode) }}{{ $t("ing") }}...</span> -->
    </div>
    <!-- 异常提示 -->
    <div v-if="currentstatus == '' || currentstatus == 'Unknown'" class="stateMessageError flex-center">
      <span>异常：无法获取当前状态！</span>
    </div>
    <!-- <prompt-box v-if="promptVisible || !connected" :prompt="connected ? promptVal : 'reconnect'" @cancel="cancel()"
      @confirm="confirm()"></prompt-box> -->


    <!-- <div style="z-index: 99999;position: absolute;left: 1000px;top: 500px;">
      <button @click="joinRoom">Join Room</button>
      <div v-if="joined">
        <h2>Room: {{ room }}</h2>
        <webrtc :stream="stream" @ready="onWebRTCReady" />
      </div>
    </div> -->

  </div>
</template>
<script>
import RtcHeader from "@/components/rtcHeader.vue";
import promptBox from "@/components/promptBox.vue";
import { mapState } from "vuex";
import Heartbeat from "@/mixin/Heartbeat";
import io from 'socket.io-client';
// import WebRTC from 'vue-webrtc';

export default {
  mixins: [Heartbeat],
  components: { RtcHeader, promptBox },
  computed: {
    ...mapState(["gamepadConnected", "connected"]),
    headBoxWidth() {
      let style = { width: "9.2083vw" };
      if (this.$i18n.locale == "en") {
        style.width = "17.6vw";
      }
      return style;
    },
    dividerWidth() {
      let style = { width: "9.8333vw" };
      if (this.$i18n.locale == "en") {
        style.width = "18.4583vw";
      }
      return style;
    },
    titleName() {
      if (this.controlModel == 'inPlace') return '原地运动'
      if (this.controlModel == 'grasping') return '末端抓取'
      if (this.controlModel == 'setup') return '设置'
    }
  },
  data() {
    return {
      videoContainer: "", //视频
      buttons: "", //当前按键
      screenWidth: document.body.clientWidth, //当前屏幕宽度
      speed: 1, //当前速度档位 1-3
      current_speed: 0, //当前速度，默认0
      videoSrc: "", //摄像头视频路径
      controlModel: "", //当前运动 gait:步态 inPlace:原地 grasping:末端抓取
      mode: "", //当前运动模式
      headBoxVisible: false, //模式选择框显隐
      camera: true, //是否开启视频
      doAction: false,
      otherAction: false,
      velocity: 0,
      direction: 0,
      interval: null,
      intervalCount: 0,
      promptVisible: false,
      promptVal: "",
      lastMessageReceivedTime: Date.now(),
      wsInterval: null,
      reconnectWs: false,
      currentstatus: "Start", //当前状态: Unknown,Start,Zero,Zero2Stand,Stand,Stand2Walk,Walk,Stop
      walkingTimer: null,
      lastX: 0,
      lastY: 0,
      sideVisible: false,
      mute: false,
      cameraOff: false,
      recording: false,
      currentSetup: "motion",
      socket: null,
      chunks: [],
      mediaRecorder: null,
      inPlaceList: [
        {
          name: 'raiseHand',
          src: require('@/assets/images/icon_raiseHand.png'),
        }, {
          name: 'swingArms',
          src: require('@/assets/images/icon_swingArms.png')
        }, {
          name: 'greet',
          src: require('@/assets/images/icon_greet.png')
        }, {
          name: 'twist',
          src: require('@/assets/images/icon_twist.png')
        }, {
          name: 'squat',
          src: require('@/assets/images/icon_squat.png'),
        }, {
          name: 'shake',
          src: require('@/assets/images/icon_shake.png'),
        }, {
          name: 'nod',
          src: require('@/assets/images/icon_nod.png'),
        }
      ],
      graspingList: [
        {
          name: 'openHand',
          src: require('@/assets/images/icon_grasping.png'),
        }, {
          name: 'grasp',
          src: require('@/assets/images/icon_graspPC.png'),
        }, {
          name: 'tremble',
          src: require('@/assets/images/icon_tremble.png'),
        }
      ]
    };
  },
  created() {
    this.createWsInterval();
    document.addEventListener(
      "click",
      (e) => {
        let controlRef = this.$refs.controlRef;
        if (controlRef && !controlRef.contains(e.target)) {
          this.sideVisible = false;
        }
      },
      true
    );
    this.initMediaWs();
  },
  async mounted() {
    this.videoContainer = this.$refs.videoContainer;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    // this.cameraOpen();
    this.startGamepad();
    this.$bus.$on("robotOnmessage", (data) => {
      this.lastMessageReceivedTime = Date.now();
      // console.log("robotOnmessage~~~~~~~~~~", data.data);
      if (data.data) {
        this.doAction = data.data.upper_action;
        this.currentstatus = data.data.states.fsmstatename.currentstatus;
      } else {
        this.currentstatus = "";
      }
    });
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
  },
  beforeDestroy() {
    if (this.walkingTimer) {
      clearTimeout(this.walkingTimer);
    }
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.socket) {
      this.socket.close();
    }
  },
  destroyed() {
    clearInterval(this.interval);
    clearInterval(this.wsInterval);
    //关闭监听
    this.robotWs.robot.disable_debug_state();
    this.$bus.$off("robotOnmessage");
  },
  methods: {
    //创建定时器监听websocket是否断连
    createWsInterval() {
      if (!this.wsInterval) {
        this.wsInterval = setInterval(() => {
          const currentTime = Date.now();
          const timeSinceLastMessage =
            currentTime - this.lastMessageReceivedTime;
          // console.log("websocketHeartBeat.............", timeSinceLastMessage);
          if (timeSinceLastMessage > 3000) {
            // 如果超过了阈值3秒，认为连接断开
            console.log("WebSocket connection might be disconnected.");
            if (this.connected) {
              clearInterval(this.wsInterval);
              this.wsInterval = null;
              console.log("readyState", this.robotWs.robot.ws.readyState);
              if (
                !this.robotWs.robot.ws ||
                this.robotWs.robot.ws.readyState != 1
              ) {
                this.$bus.$emit("initWs");
              } else {
                this.robotWs.robot.ws.close();
              }
              setTimeout(() => {
                this.robotWs.robot.enable_debug_state(2);
              }, 1500);
              setTimeout(() => {
                this.lastMessageReceivedTime = Date.now();
                this.createWsInterval();
              }, 3000);
            }
          }
        }, 1000); // 每秒检查一次
      }
    },
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
          // console.log(navigator.getGamepads(), gamepad)
          if (_this.intervalCount >= 50) {
            // navigator.getGamepads()[0].axes[0],navigator.getGamepads()[0].axes[1],navigator.getGamepads()[0].axes[2],navigator.getGamepads()[0].axes[3]
            _this.pressKey(gamepad.buttons);
            _this.remoteSensing(gamepad.axes);
            _this.intervalCount = 0;
          }
        }
      }, 1);
    },
    /**
     * 手柄遥感 --- 圆心方案整改（新）
     */
    remoteSensing(arr) {
      console.log(arr);
      if (this.currentstatus != "Stand" && this.currentstatus == "Walk") {
        this.velocity = arr[1];
        console.log(arr[1], arr[2]);
        if (Math.abs(this.velocity) < 0.1) this.velocity = 0;
        this.direction = arr[2];
        if (Math.abs(this.direction) < 0.1) this.direction = 0;
        this.operateWalk(
          this.direction * -45,
          (this.velocity * this.speed) / -6.25
        );
      } else if (
        this.currentstatus == "Stand" &&
        this.currentstatus != "Walk"
      ) {
        let pitch = arr[1] * -17.1887;
        let rotate_waist = arr[0] * -14.32;
        if (Math.abs(pitch) < 1.71887) pitch = 0;
        if (Math.abs(rotate_waist) < 1.432) rotate_waist = 0;
        let squat = arr[3] * -0.15;
        let yaw = arr[2] * 60;
        if (squat > -0.015) squat = 0;
        if (Math.abs(yaw) < 6) yaw = 0;
        this.operateHead(pitch, yaw);
        this.operateBody(squat, rotate_waist);
      }
    },
    //鼠标移动
    onMouseMove(event) {
      // console.log('onMouseMove', event, event.movementX, event.movementY)
      event.preventDefault();
      if (this.currentstatus != "Stand") return
      if (this.lastX == 0 && this.lastY == 0) {
        this.lastX = event.clientX
        this.lastY = event.clientY
      } else {
        const currPointX = (this.lastX / window.innerWidth - 0.5) * 2
        const currPointY = (this.lastY / window.innerHeight - 0.5) * 2
        // console.log('横向', currPointX.toFixed(2), '竖向', currPointY.toFixed(2))
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        let pitch = currPointX * 17.1887;
        let yaw = currPointY * -17.1887;
        this.operateHead(yaw, pitch);
      }
    },
    //键盘操控
    handleKeyDown(event) {
      // event.preventDefault();
      if (!this.isKeyHold) {
        console.log('keydown', event)

        const walkKeys = {
          87: { velocity: 1, direction: this.direction }, // W
          83: { velocity: -1, direction: this.direction },  // S
          65: { velocity: this.velocity, direction: -1 },  // A
          68: { velocity: this.velocity, direction: 1 }, // D
        };
        const walkInfo = walkKeys[event.keyCode];
        if (walkInfo) {
          if (event.keyCode == 87 || event.keyCode == 83) this.velocity = walkInfo.velocity * this.speed / 6.25;
          if (event.keyCode == 65 || event.keyCode == 68) this.direction = walkInfo.direction;
          console.log('方向', this.direction, '速度', this.velocity)
          this.operateWalk(
            this.direction * -45,
            (this.velocity * this.speed) / 6.25
          );
        }
        if (event.keyCode == 38) this.speedChange('add')
        if (event.keyCode == 40) this.speedChange('reduce')
        if (event.keyCode == 17) this.doCalibration();
        if (event.keyCode == 32) this.changeControl("stand");
      }
    },
    handleKeyUp(event) {
      event.preventDefault();
      const keyBindings = {
        87: { velocity: 0, direction: this.direction }, // W
        83: { velocity: 0, direction: this.direction },  // S
        65: { velocity: this.velocity, direction: 0 },  // A
        68: { velocity: this.velocity, direction: 0 }, // D
      };

      const keyInfo = keyBindings[event.keyCode];
      if (keyInfo) {
        if (event.keyCode == 87 || event.keyCode == 83) this.velocity = keyInfo.velocity * this.speed / 6.25;
        if (event.keyCode == 65 || event.keyCode == 68) this.direction = keyInfo.direction;
        console.log('放开方向', this.direction, '放开速度', this.velocity)
        this.operateWalk(
          this.direction * -45,
          (this.velocity * this.speed) / 6.25
        );
      }
    },
    // 手柄按键
    pressKey(arr) {
      let stopL = false;
      let stopR = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === 1) {
          if (i === 4) {
            this.buttons = "左手1";
            if (this.speed > 1) this.speed -= 1;
          }
          if (i === 5) {
            this.buttons = "右手1";
            if (this.speed < 3) this.speed += 1;
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
      if (stopL && stopR) this.stop();
    },
    calibration() {
      this.promptBoxOpen("calibration");
    },
    doCalibration() {
      // this.isStand = false;
      this.robotWs.robot.start();
      this.mode = "initial";
      // this.isZero = true;
      setTimeout(() => {
        this.mode = "";
      }, 7000);
    },
    //紧急停止
    stop() {
      this.robotWs.robot.stop();
    },
    // 速度挡位调节
    speedChange(e) {
      if (e == "add" && this.speed < 3) {
        this.speed += 1;
      } else if (e == "reduce" && this.speed > 1) {
        this.speed -= 1;
      } else {
        this.speed = e
      }
    },
    //操控行走
    operateWalk(direction, velocity) {
      try {
        this.robotWs.robot.walk(direction, velocity);
        if (!this.walkingTimer) {
          this.walkingTimer = setTimeout(() => {
            this.changeControl("stand");
          }, 20 * 60 * 1000); //行走20分钟后强制站立
        }
      } catch (error) {
        console.log("Walk错误。。。。。。", error);
      }
    },
    //操控头部
    operateHead(pitch, yaw) {
      console.log("头部。。。。。", pitch, yaw);
      try {
        this.robotWs.robot.head(0, pitch, yaw);
      } catch (error) {
        console.log("Head错误。。。。。。", error);
      }
    },
    //操控身体
    operateBody(squat, rotate_waist) {
      console.log("身体。。。。。", squat, rotate_waist);
      try {
        this.robotWs.robot.body(squat, rotate_waist);
      } catch (error) {
        console.log("Body错误。。。。。。", error);
      }
    },
    //开启视频
    cameraOpen() {
      this.videoSrc = this.robotWs.robot.camera.videoStreamUrl;
    },
    //切换当前控制模式
    changeControl(e) {
      if (e == "stand") {
        if (this.walkingTimer) {
          clearTimeout(this.walkingTimer);
        }
        this.robotWs.robot.stand();
        this.sideVisible = false;
      } else if (["inPlace", "grasping", "setup"].includes(e)) {
        this.sideVisible = true;
      } else {
        this.sideVisible = false;
      }
      this.controlModel = e;
    },
    async choseMode(e) {
      if (this.doAction || this.otherAction) return;
      this.mode = e;
      //原地踏步，速度位置发0
      if (e == "markingTime") {
        // this.isStand = false;
        // this.isWalking = true;
        this.robotWs.robot.walk(0, 0);
      } else {
        //上肢data
        let upper_data = {
          arm_action: "",
          hand_action: "",
        };
        //下肢data
        let lower_data = {
          lower_body_mode: "",
        };
        setTimeout(() => {
          this.doAction = true;
        }, 500);
        if (e == "zero") {
          upper_data.arm_action = "RESET";
        } else if (e == "raiseHand") {
          upper_data.arm_action = "LEFT_ARM_WAVE";
        } else if (e == "swingArms") {
          upper_data.arm_action = "ARMS_SWING";
        } else if (e == "greet") {
          upper_data.arm_action = "HELLO";
        } else if (e == "openHand") {
          upper_data.hand_action = "OPEN";
        } else if (e == "grasp") {
          upper_data.hand_action = "GRASP";
        } else if (e == "tremble") {
          upper_data.hand_action = "TREMBLE";
        } else if (e == "twist") {
          lower_data.lower_body_mode = "ROTATE_WAIST";
        } else if (e == "squat") {
          lower_data.lower_body_mode = "SQUAT";
        } else if (e == "nod") {
          //上下点头
          this.otherAction = true;
          this.operateHead(17, 0);
          setTimeout(() => {
            this.operateHead(-17, 0);
          }, 1000);
          setTimeout(() => {
            this.operateHead(0, 0);
          }, 3000);
        } else if (e == "shake") {
          //左右摇头
          this.otherAction = true;
          this.operateHead(0, 17);
          setTimeout(() => {
            this.operateHead(0, -17);
          }, 1000);
          setTimeout(() => {
            this.operateHead(0, 0);
          }, 3000);
        }
        if (lower_data.lower_body_mode == "" && e != "nod" && e != "shake") {
          try {
            let res = await this.robotWs.robot.upper_body(
              upper_data.arm_action,
              upper_data.hand_action
            );
            if (res.data.code == 0 && res.data.msg == "ok") {
              console.log("upper_body_OK", res);
            } else {
              console.log("upper_body_ERR", res);
            }
          } catch (error) {
            console.log("upper_body-error", error);
          }
        } else if (
          lower_data.lower_body_mode != "" &&
          e != "nod" &&
          e != "shake"
        ) {
          this.otherAction = true;
          try {
            let res = await this.robotWs.robot.lower_body(
              lower_data.lower_body_mode
            );
            console.log("lower_body_OK........", res);
            if (res.data.code == 0 && res.data.msg == "ok") {
              console.log("lower_body_OK", res);
              this.otherAction = false;
            } else {
              console.log("lower_body_ERR", res);
              this.otherAction = false;
            }
          } catch (error) {
            console.log("lower_body-error", error);
            this.otherAction = false;
          }
        } else {
          console.log("头头", e);
          setTimeout(() => {
            this.otherAction = false;
          }, 4000);
        }
      }
    },
    openCamera() {
      this.camera = !this.camera;
    },
    promptBoxOpen(e) {
      this.promptVal = e;
      this.promptVisible = !this.promptVisible;
    },
    confirm() {
      switch (this.promptVal) {
        case "calibration":
          this.doCalibration();
          break;
        case "returnMain":
          this.$router.push({
            name: "login",
          });
          break;
        default:
          break;
      }
      this.promptVisible = false;
    },
    cancel() {
      this.promptVisible = !this.promptVisible;
    },
    closeSide() {
      this.sideVisible = false
    },
    micControl(e) {
      this.mute = !this.mute
      if (this.mute) {
        this.startRecording()
      } else {
        this.stopRecording()
      }
    },
    cameraControl(e) {
      this.cameraOff = !this.cameraOff
    },
    recordingControl(e) {
      this.recording = !this.recording
    },
    initMediaWs() {
      this.socket = new WebSocket('ws://localhost:8999');

      // 连接成功建立时触发
      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket connection is open now.');
        // 可以开始发送消息了
      };

      // 接收到消息时触发
      this.socket.onmessage = (event) => {
        const message = event.data;
        console.log('Message from server:', message);
        // 处理收到的消息，可能需要根据不同的消息类型进行解析
      };

      // 发生错误时触发
      this.socket.onerror = (error) => {
        this.isConnected = false;
        console.error('WebSocket error observed:', error);
        // 处理 WebSocket 错误
      };

      // 连接关闭时触发
      this.socket.onclose = (event) => {
        this.isConnected = false;
        if (event.wasClean) {
          console.log(`WebSocket closed cleanly with code ${event.code}`);
        } else {
          console.log('WebSocket connection was closed abruptly');
        }
        console.log('WebSocket was closed');
        // 连接关闭后可能需要重连的逻辑
      };
    },
    startRecording() {
      // 请求访问麦克风
      navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000, // 采样率，单位 Hz
          numberOfChannels: 1 // 声道数，1 为单声道，2 为立体声
        }
      })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();

          this.mediaRecorder.addEventListener('dataavailable', (e) => {
            if (e.data.size > 0) {
              this.chunks.push(e.data);
              // 通过 WebSocket 发送音频块到 Node.js 客户端
              this.socket.send(e.data);
            }
          });
        });
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
//鼠标
body {
  // cursor: none;
}

.video-container {
  display: flex;
  justify-content: center;
}

.video-item {
  position: fixed;
  z-index: 3;
  background-image: url("../../assets/images/image_cameraBk.jpg");
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

.controlStatus {
  position: absolute;
  left: 32.75vw;
  bottom: 3.7083vw;
  width: 31.75vw;
  height: 3.4583vw;
  border-radius: 2.7917vw;
  padding: 0.9167vw 1.25vw;
  border: 0.125vw solid rgba(255, 255, 255, 0.3);
  z-index: 999;
}

.controlActivated {
  position: absolute;
  left: 32.75vw;
  bottom: 3.7083vw;
  width: 34.25vw;
  height: 31.75vw;
  border-radius: 3.0833vw;
  border: 0.125vw solid rgba(255, 255, 255, 0.3);
  background-color: rgba(0, 75, 133, 0.5);
  z-index: 999;
}

.controlBox {
  position: absolute;
  left: 1.25vw;
  bottom: 0.9167vw;
  width: 31.75vw;
  height: 3.4583vw;

  .choseBox {
    width: 8vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chose {
    background: rgba(0, 75, 133, 0.4);
    border-radius: 2.2396vw;
  }

  .choseBk {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2.2396vw;
  }

  .txt {
    font-size: 1.4583vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: $white;
  }
}

.bottomBox {
  height: 120px;
  background: rgba(13, 44, 68, 0.7);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 9999;

  .leftBox {
    width: 330px;
    margin-left: 28px;
  }

  .midBox {
    width: 539px;
  }

  .rightBox {
    width: 260px;
    margin-right: 27px;

    ::v-deep .el-button {
      width: 120px;
      height: 52px;
      font-size: 24px;
    }
  }

  .boxItem {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    width: 80px;
    height: 80px;
    padding: 10px 0;
    color: rgba(255, 255, 255, 0.6);
  }

  .chosedItem {
    background: linear-gradient(230deg, #198BFF 0%, #0086D1 100%);
    border-radius: 4px;
  }
}

.shortWidth {
  width: 1540px;
}

.fullWidth {
  width: 100%;
}

.sideBox {
  width: 380px;
  height: 1080px;
  background: rgba(23, 39, 55, 0.7);
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9999;

  .title {
    width: 326px;
    height: 80px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
    font-size: 28px;
    color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 25px;
    padding-left: 29px;
  }

  .sideContent {
    font-size: 16px;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: $white;
    display: flex;
    flex-wrap: wrap;

    .actionItem {
      text-align: center;
      flex-basis: 33.33%;
      padding: 20px 0;
    }

    .actionImg {
      width: 2.7083vw;
      height: 2.7083vw;
    }

    .chosedAction {
      background: linear-gradient(230deg, #198BFF 0%, #0086D1 100%);
      border-radius: 8px;
    }

    .setTab {
      height: 103px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 27px 0 29px;

      .tabItem {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 37px;
        justify-content: space-between;

        .chosed {
          color: #FFFFFF;
        }
      }

      .cDivider {
        width: 16px;
        height: 4px;
        background: #FFFFFF;
      }

    }

    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }

    .speedControl {
      height: 122px;
      padding: 0 27px 0 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      color: #FFFFFF;

      .controlTag {
        width: 206px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        display: flex;

        .tag {
          width: 68px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .chosedTag {
          background: linear-gradient(230deg, #198BFF 0%, #0086D1 100%);
          border-radius: 4px;
        }
      }
    }
  }
}

.actionBox {
  height: 23vw;
  width: 27.775vw;
  padding: 3.125vw 3.1333vw 0 3.5917vw;
  display: flex;
  flex-wrap: wrap;
}

.headState {
  position: absolute;
  top: 1.25vw;
  left: 10.9375vw;
  z-index: 99;
  display: flex;
  align-items: center;

  .headTxt {
    font-size: 1.5vw;
    color: $white;
    font-style: normal;
    font-weight: 550;
  }

  .cDivider {
    width: .0833vw;
    height: 1.5vw;
    background: #FFFFFF;
    margin-left: 2.0833vw;
  }

  .actionTxt {
    font-size: 1.3333vw;
    color: #FFFFFF;
    margin-left: 2.0833vw;
  }
}

.headBox {
  position: absolute;
  top: 4.453123vw;
  left: 10.9375vw;
  height: 8.0417vw;
  padding: 1.7917vw 2.1667vw;
  background: rgba(0, 75, 133, 0.3);
  border: 0.1042vw solid rgba(68, 216, 251, 0.3);
  z-index: 99;
  align-items: flex-start;
  justify-content: space-between;
  font-size: $size-41;
  color: $white;

  .divider {
    height: 0.1042vw;
    background: $white;
    opacity: 0.3;
  }
}

.stateMessageError {
  position: absolute;
  left: 50%;
  top: 7.6042vw;
  transform: translate(-50%, -50%);
  background: rgba(255, 102, 86, 0.8);
  padding: 0 2.2396vw;
  height: 2.5521vw;
  z-index: 999;
  font-size: $size-30;
  color: $white;
}


.headBkIn {
  position: absolute;
  top: 0;
  left: 0;
  height: 4.4444vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  background: linear-gradient(274deg,
      rgba(26, 25, 25, 0.4) 0%,
      rgba(0, 76, 129, 0.4) 100%);

  .return {
    width: 2.0833vw;
    height: 1.7708vw;
  }

  .headReturn {
    height: 4.4444vw;
    width: 5.6667vw;
    background: #004B85;
    padding-left: 1.24vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .headReturn::after {
    position: absolute;
    content: " ";
    left: 4.6667vw;
    top: 0.0vw;
    border-width: 4.4444vw 2.3021vw;
    border-style: solid;
    border-color: #004c81 transparent transparent transparent;
  }

  .spacing {
    margin-right: 30px;
  }

  .divider {
    width: 0.1042vw;
    height: 4.4271vw;
    background: $white;
    opacity: 0.3;
  }

  .inTxt {
    font-size: 28px;
    color: $white;
    margin-right: 1.9444vw;
    margin-left: 0.6944vw;
    vertical-align: middle;
  }
}

.inImg {
  width: 48px;
  height: 48px;
  z-index: 99;
  vertical-align: middle;
}
</style>

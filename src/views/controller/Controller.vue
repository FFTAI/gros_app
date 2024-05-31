<template>
  <div ref="pageController">
    <div class="container">
      <div ref="videoContainer" align="center" class="video-container">
        <div v-show="!cameraOff" class="video-item common-bkg">
          <video class="video-play" ref="rtc_media_player" width="1920" height="1080" autoplay muted
            v-show="mediaVisible"></video>
        </div>
        <div v-show="cameraOff" class="video-item1 common-bkg">
        </div>
      </div>
      <div class="headBkIn fullWidth">
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
            <img class="inImg" style="width: 2.7604vw;height: 2.3438vw;" src="@/assets/images/icon_sRob.png" />
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

      <div class="bottomBox flex-between fullWidth">
        <div class="leftBox flex-between">
          <div class="boxItem" style="justify-content: space-around;" v-if="!mute" @click="micControl('off')">
            <img class="inImg" src="@/assets/images/icon_mic.png" />
            <span>静音</span>
          </div>
          <div class="boxItem" style="justify-content: space-around;" v-else @click="micControl('on')">
            <img class="inImg" src="@/assets/images/icon_mute.png" />
            <span>解除静音</span>
          </div>
          <div class="boxItem" style="justify-content: space-around;" v-if="!cameraOff" @click="cameraControl('on')">
            <img class="inImg" src="@/assets/images/icon_video.png" />
            <span>开始视频</span>
          </div>
          <div class="boxItem" style="justify-content: space-around;" v-else @click="cameraControl('off')">
            <img class="inImg" src="@/assets/images/icon_videoOff.png" />
            <span>停止视频</span>
          </div>
          <div class="boxItem" style="justify-content: space-around;" @click="takeScreenshot()">
            <img class="inImg" src="@/assets/images/icon_photo.png" />
            <span>拍照</span>
          </div>
          <div class="boxItem" style="justify-content: space-around;" v-if="!recording" @click="recordingControl('on')">
            <img class="inImg" src="@/assets/images/icon_record.png" />
            <span>录像</span>
          </div>
          <div class="boxItem" style="justify-content: space-around;" v-else @click="recordingControl('off')">
            <img class="inImg" src="@/assets/images/icon_recording.png" />
            <span>录像中</span>
          </div>
        </div>
        <div class="midBox flex-between">
          <div class="boxItem" :class="{ chosedItem: currentstatus == 'Stand', opacity03: currentstatus == 'Start' }"
            @click="doStand()">
            <img class="inImg" src="@/assets/images/icon_stand.png" />
            <span>站立</span>
            <span>Space</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: currentstatus == 'Walk', opacity03: currentstatus == 'Start' }">
            <img class="inImg" src="@/assets/images/icon_Stepping.png" />
            <span>行走</span>
            <span>①</span>
          </div>
          <div class="boxItem"
            :class="{ chosedItem: controlModel == 'inPlace', opacity03: currentstatus == 'Walk' || currentstatus == 'Start' }"
            @click="changeControl('inPlace')">
            <img class="inImg" src="@/assets/images/icon_inPlace.png" />
            <span>原地</span>
            <span>②</span>
          </div>
          <div class="boxItem"
            :class="{ chosedItem: controlModel == 'grasping', opacity03: currentstatus == 'Walk' || currentstatus == 'Start' }"
            @click="changeControl('grasping')">
            <img class="inImg" src="@/assets/images/icon_grasping.png" />
            <span>抓取</span>
            <span>③</span>
          </div>
          <div class="boxItem"
            :class="{ chosedItem: controlModel == 'face', opacity03: currentstatus == 'Walk' || currentstatus == 'Start' }"
            @click="changeControl('face')">
            <img class="inImg" src="@/assets/images/icon_face.png" />
            <span>表情</span>
            <span>④</span>
          </div>
          <div class="boxItem"
            :class="{ chosedItem: controlModel == 'ai', opacity03: currentstatus == 'Walk' || currentstatus == 'Start' }"
            @click="changeControl('ai')">
            <img class="inImg" src="@/assets/images/icon_AI.png" />
            <span>AI托管</span>
            <span>⑤</span>
          </div>
          <div class="boxItem"
            :class="{ chosedItem: controlModel == 'setup', opacity03: currentstatus == 'Walk' || currentstatus == 'Start' }"
            @click="changeControl('setup')">
            <img class="inImg" src="@/assets/images/icon_setup.png" />
            <span>设置</span>
            <span>⑥</span>
          </div>
        </div>
        <div class="rightBox flex-between">
          <el-button type="warning" @click="doCalibration()">初始⑧</el-button>
          <el-button type="danger" @click="stop()">急停⑨</el-button>
        </div>
      </div>
      <div class="sideBox" v-if="sideVisible">
        <div class="title">
          <span>{{ titleName }}</span>
          <img style="width: 1.25vw;height: 1.25vw;" src="@/assets/images/icon_sClose.png" @click="closeSide()" />
        </div>
        <div class="sideContent">
          <div v-if="controlModel == 'inPlace'" class="actionItem" :class="{ chosedAction: item.name == mode }"
            v-for="(item, index) in inPlaceList" :key="index" @click="choseMode(item.name)">
            <img class="actionImg" :src="item.src" />
            <div>{{ $t(item.name) }}{{ ' ( ' + item.keyCode + ' )' }}</div>
          </div>
          <div v-if="controlModel == 'grasping'" class="actionItem" :class="{ chosedAction: item.name == mode }"
            v-for="(item, index) in graspingList" :key="index" @click="choseMode(item.name)">
            <img class="actionImg" :src="item.src" />
            <div>{{ $t(item.name) }}{{ ' ( ' + item.keyCode + ' )' }}</div>
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
    <div class="stateMessage flex-center" v-if="mode != '' ||
          mode == 'initial'
          ">
      <!-- <span>{{ $t(mode) }}{{ $t("ing") }}...</span> -->
    </div>
    <!-- <prompt-box v-if="promptVisible || !connected" :prompt="connected ? promptVal : 'reconnect'" @cancel="cancel()"
      @confirm="confirm()"></prompt-box> -->
    <canvas ref="canvas" width="1920" height="1080" style="display:none;"></canvas>
    <audio ref="audioElement"></audio>
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

export default {
  components: { RtcHeader, promptBox },
  computed: {
    ...mapState(["gamepadConnected", "connected", "currRobot"]),
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
      if (this.controlModel == 'face') return '表情'
      if (this.controlModel == 'ai') return 'AI托管'
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
      controlModel: "", //当前运动 gait:步态 inPlace:原地 grasping:末端抓取
      mode: "", //当前运动模式
      headBoxVisible: false, //模式选择框显隐
      camera: true, //是否开启视频
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
      lastX: 0,
      lastY: 0,
      sideVisible: false,
      mute: true,
      cameraOff: false,
      recording: false,
      currentSetup: "motion",
      socket: null,
      chunks: [],
      mediaRecorder: null,
      audioContext: null,
      rc: null,
      sdk: null,
      mediaVisible: false,
      audioUrl: '',
      currentAudio: '',
      localSocket: null,
      mouseDown: false,
      keyVelocity: false,
      keyDirection: false,
      inPlaceList: [
        {
          name: 'raiseHand',
          src: require('@/assets/images/icon_raiseHand.png'),
          keyCode: 'e'
        }, {
          name: 'swingArms',
          src: require('@/assets/images/icon_swingArms.png'),
          keyCode: 'r'
        }, {
          name: 'greet',
          src: require('@/assets/images/icon_greet.png'),
          keyCode: 't'
        }, {
          name: 'twist',
          src: require('@/assets/images/icon_twist.png'),
          keyCode: 'y'
        }, {
          name: 'squat',
          src: require('@/assets/images/icon_squat.png'),
          keyCode: 'u'
        }, {
          name: 'shake',
          src: require('@/assets/images/icon_shake.png'),
          keyCode: 'i'
        }, {
          name: 'nod',
          src: require('@/assets/images/icon_nod.png'),
          keyCode: 'o'
        }
      ],
      graspingList: [
        {
          name: 'openHand',
          src: require('@/assets/images/icon_grasping.png'),
          keyCode: 'j'
        }, {
          name: 'grasp',
          src: require('@/assets/images/icon_graspPC.png'),
          keyCode: 'k'
        }, {
          name: 'tremble',
          src: require('@/assets/images/icon_tremble.png'),
          keyCode: 'l'
        }
      ]
    };
  },
  created() {
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
    // this.initLocalMediaWs();
  },
  async mounted() {
    // this.$refs.pageController.style.cursor = 'none';
    this.videoContainer = this.$refs.videoContainer;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMousedown);
    document.addEventListener('mouseup', this.onMouseup);
    this.initMediaWs();
    this.createWsInterval();
    this.startGamepad();
    this.$nextTick(() => {
      this.startPlay();
    });
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMousedown);
    document.removeEventListener('mouseup', this.onMouseup);
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
  },
  methods: {
    startPlay() {
      if (this.sdk) {
        this.sdk.close();
      }
      this.sdk = new SrsRtcWhipWhepAsync();
      this.mediaVisible = true
      this.$refs.rtc_media_player.srcObject = this.sdk.stream
      var url = 'http://101.133.149.215:1985/rtc/v1/whep/?app=live&stream=livestream'
      // var url = 'http://192.168.11.82:1985/rtc/v1/whep/?app=live&stream=livestream'
      this.sdk.play(url)
        .then((session) => {
          console.log('成功拉流:', session);
          // this.$refs.rtc_media_player.srcObject = this.sdk.stream;
        })
        .catch((reason) => {
          console.error('错误拉流:', reason);
          this.sdk.close();
        });
    },
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
            // console.log("Ws connection might be disconnected.");
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
      }
    },
    //鼠标移动
    onMouseMove(event) {
      // event.preventDefault();
      // if (this.currentstatus == "Walk") return
      if (this.lastX == 0 && this.lastY == 0) {
        this.lastX = event.clientX
        this.lastY = event.clientY
        console.log(this.lastX, this.lastY)
      } else {
        let currPointX = (this.lastX / window.innerWidth - 0.5) * 2
        let currPointY = (this.lastY / window.innerHeight - 0.5) * 2
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        if (currPointX > 1) currPointX = 1
        if (currPointY > 1) currPointY = 1
        if (currPointY < -1) currPointY = -1
        console.log('横向', currPointX.toFixed(2), '竖向', currPointY.toFixed(2))
        let yaw = currPointX * 40;
        let pitch = currPointY * -17.1887;
        if (this.mouseDown) this.operateHead(pitch, yaw);
      }
    },
    onMousedown(event) {
      console.log('1', event)
      if (event.button == 0 && event.buttons == 1) {
        this.mouseDown = true;
        this.$refs.pageController.style.cursor = 'none';
      }
    },
    onMouseup(event) {
      console.log('2', event)
      if (event.button == 0 && event.buttons == 0) {
        this.mouseDown = false;
        this.$refs.pageController.style.cursor = 'auto';
      }
    },
    //键盘操控
    handleKeyDown(event) {
      // event.preventDefault();
      console.log('keydown', event.keyCode)
      const walkKeys = {
        87: { velocity: 1, direction: this.direction }, // W
        83: { velocity: -1, direction: this.direction },  // S
        65: { velocity: this.velocity, direction: -1 },  // A
        68: { velocity: this.velocity, direction: 1 }, // D
      };
      const walkInfo = walkKeys[event.keyCode];
      if (walkInfo) {
        console.log('walkInfo', walkInfo)
        this.changeControl('gait')
        if (event.keyCode == 87 || event.keyCode == 83) {
          this.velocity = walkInfo.velocity * this.speed / 6.25;
          this.keyVelocity = true
        }
        if (event.keyCode == 65 || event.keyCode == 68) {
          this.direction = walkInfo.direction;
          this.keyDirection = true
        }
        console.log('方向', this.direction, '速度', this.velocity)
        this.operateWalk(
          this.direction * -45,
          (this.velocity * this.speed) / 6.25
        );
      }
      const controlKeys = {
        // 32: "stand",
        // 49: "gait",
        50: "inPlace",
        51: "grasping",
        52: "face",
        53: "ai",
        54: "setup"
      }
      const controlInfo = controlKeys[event.keyCode];
      if (controlInfo) this.changeControl(controlInfo);
      const inPlaceKeys = {
        69: { key: "e", value: "raiseHand" },
        82: { key: "r", value: "swingArms" },
        84: { key: "t", value: "greet" },
        89: { key: "y", value: "twist" },
        85: { key: "u", value: "squat" },
        73: { key: "i", value: "shake" },
        79: { key: "o", value: "nod" }
      }
      const inPlaceInfo = inPlaceKeys[event.keyCode];
      if (inPlaceInfo && this.controlModel == 'inPlace') this.choseMode(inPlaceInfo.value);
      const graspingKeys = {
        74: { key: "j", value: "openHand" },
        75: { key: "k", value: "grasp" },
        76: { key: "l", value: "tremble" }
      }
      const graspingInfo = graspingKeys[event.keyCode];
      if (graspingInfo && this.controlModel == 'grasping') this.choseMode(graspingInfo.value);
      if (event.keyCode == 38) this.speedChange('add')
      if (event.keyCode == 40) this.speedChange('reduce')
      if (event.keyCode == 56) this.doCalibration();
      if (event.keyCode == 57) this.stop();
      if (event.keyCode == 8) this.routerReturn()
      if (event.keyCode == 17) this.doSquat(-0.1)
      if (event.keyCode == 32) {
        this.doStand();
      }
      if (event.keyCode == 192) {
        if (this.mute) {
          this.micControl('on')
        } else {
          this.micControl('off')
        }
      }
      if (event.keyCode == 27) this.closeSide();
      // if (event.keyCode == 18) this.$refs.pageController.style.cursor = 'auto';
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
        console.log('keyInfo...', event.keyCode)
        if (event.keyCode == 87 || event.keyCode == 83) this.keyVelocity = false
        if (event.keyCode == 65 || event.keyCode == 68) this.keyDirection = false
        // console.log('放开方向', this.direction, '放开速度', this.velocity)
        // this.operateWalk(
        //   this.direction * -45,
        //   (this.velocity * this.speed) / 6.25
        // );
        if (!this.keyVelocity && !this.keyDirection) {
          this.changeControl("stand");
          this.changeControl("inPlace");
        }
      }
      if (event.keyCode == 17) this.doSquat(0)
      // if (event.keyCode == 18) this.$refs.pageController.style.cursor = 'none';
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
      this.robotWs.robot.send(JSON.stringify({ "command": 'zero' }));
      this.mode = "initial";
      setTimeout(() => {
        this.mode = "";
        this.currentstatus = "Zero";
      }, 6000);
    },
    //紧急停止
    stop() {
      this.robotWs.robot.stop();
    },
    // 速度挡位调节
    speedChange(e) {
      console.log(e, this.speed)
      if (e == "add" && this.speed < 3) {
        this.speed += 1;
      } else if (e == "reduce" && this.speed > 1) {
        this.speed -= 1;
      }
    },
    //操控行走
    operateWalk(direction, velocity) {
      try {
        let data = {
          "command": 'walk',
          "data": {
            angle: direction,
            x_speed: velocity,
            y_speed: 0,
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
      } catch (error) {
        console.log("Walk错误。。。。。。", error);
      }
    },
    //操控头部
    operateHead(pitch, yaw) {
      console.log("头部。。。。。", pitch, yaw);
      try {
        let data = {
          "command": 'head',
          "data": {
            roll: 0,
            pitch: pitch,
            yaw: yaw,
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
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
    //切换当前控制模式
    changeControl(e) {
      if (e == "stand") {
        this.robotWs.robot.send(JSON.stringify({ "command": 'stand' }));
        setTimeout(() => {
          this.robotWs.robot.send(JSON.stringify({ "command": 'stand' }));
        }, 200);
        setTimeout(() => {
          this.robotWs.robot.send(JSON.stringify({ "command": 'stand' }));
        }, 400);
        this.currentstatus = "Stand";
      } else if (e == "gait") {
        this.currentstatus = 'Walk'
        this.controlModel = '';
        this.sideVisible = false;
      } else if (["inPlace", "grasping", "face", "ai", "setup"].includes(e) && this.currentstatus != 'Walk') {
        // if (this.sideVisible) {
        //   this.controlModel = '';
        //   this.sideVisible = false;
        // } else {
        this.controlModel = e;
        this.sideVisible = true;
        // }
      }
    },
    async choseMode(e) {
      this.mode = e;
      //上肢data
      let arm_act = {
        arm_mode: 0,
      };
      let lower_data = {
        lower_body_mode: "",
      };
      let hand_act = {
        hand_mode: "",
      };
      if (e == "zero") {
        arm_act.arm_mode = "RESET";
      } else if (e == "raiseHand") {
        arm_act.arm_mode = 1;
      } else if (e == "swingArms") {
        arm_act.arm_mode = 3;
      } else if (e == "greet") {
        arm_act.arm_mode = 5;
      } else if (e == "openHand") {
        hand_act.hand_mode = 2;
      } else if (e == "grasp") {
        hand_act.hand_mode = 4;
      } else if (e == "tremble") {
        hand_act.hand_mode = 5;
      } else if (e == "twist") {
        lower_data.lower_body_mode = 2;
      } else if (e == "squat") {
        lower_data.lower_body_mode = 1;
      } else if (e == "nod") {
        //上下点头
        this.operateHead(17, 0);
        setTimeout(() => {
          this.operateHead(-17, 0);
        }, 1000);
        setTimeout(() => {
          this.operateHead(0, 0);
        }, 3000);
      } else if (e == "shake") {
        //左右摇头
        this.operateHead(0, 17);
        setTimeout(() => {
          this.operateHead(0, -17);
        }, 1000);
        setTimeout(() => {
          this.operateHead(0, 0);
        }, 3000);
      }
      if (arm_act.arm_mode != 0) {
        let data = {
          "command": 'arm_act',
          "data": {
            arm_mode: arm_act.arm_mode
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
      } else if (lower_data.lower_body_mode != "") {
        let data = {
          "command": 'lower_act',
          "data": {
            lower_mode: lower_data.lower_body_mode
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
      } else if (hand_act.hand_mode != "") {
        let data = {
          "command": 'hand_act',
          "data": {
            hand_mode: hand_act.hand_mode
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
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
      if (e == 'on') {
        console.log("解除静音")
        this.mute = false
        // this.$refs.rtc_media_player.volume = 1;
        this.startRecording()
      } else {
        console.log("静音")
        this.mute = true
        this.stopRecording()
      }
    },
    cameraControl(e) {
      this.cameraOff = !this.cameraOff
    },
    //拍照(截屏)
    takeScreenshot() {

      const video = this.$refs.rtc_media_player;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      // 将视频帧绘制到Canvas上
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log("takeScreenshot", ctx);
      // 将Canvas保存为图片
      const dataURL = canvas.toDataURL('image/png');
      const img = document.createElement('img');
      img.src = dataURL;
      console.log("takeScreenshot", dataURL);
      // 可以选择将img元素添加到文档中显示截图
      document.body.appendChild(img);
    },
    recordingControl(e) {
      this.recording = !this.recording
    },
    initLocalMediaWs() {
      this.localSocket = new WebSocket('ws://localhost:8999');
      this.localSocket.onopen = () => {
        console.log('音频接收ws已打开');
      };
      this.localSocket.onmessage = (event) => {
        console.log('音频接收onmessage', event.data);
      };
      this.localSocket.onerror = (error) => {
        console.log('音频接收ws出错！！！', error);
      };
      this.localSocket.onclose = (event) => {
        console.log('音频接收ws关闭~~~~~~', event);
      };
    },
    initMediaWs() {
      let ip = process.env.VUE_APP_URL.split("//")[1].split(":")[0];
      this.socket = new WebSocket('ws://' + ip + ':8008/terminal_audio/' + this.currRobot);
      // 连接成功建立时触发
      this.socket.onopen = () => {
        this.isConnected = true;
      };

      // 接收到消息时触发
      this.socket.onmessage = (event) => {
        // this.localSocket.send(event.data);
        // const audioBlob = event.data;
        // const audioBlobUrl = URL.createObjectURL(audioBlob);
        // // 设置音频元素的src属性并播放
        // this.$refs.audioElement.src = audioBlobUrl;
        // console.log('socket.onmessage', audioBlobUrl)
        // this.$refs.audioElement.play();

        // // 监听音频播放结束事件，释放Blob URL资源
        // this.$refs.audioElement.addEventListener('ended', () => {
        //   URL.revokeObjectURL(audioBlobUrl);
        // }, { once: true });

        // const audio = new Audio();

        // // 设置Audio元素的源为新的Blob
        // URL.revokeObjectURL(audio.src); // 撤销上一个Blob的URL
        // audio.src = URL.createObjectURL(event.data);

        // // 播放音频
        // audio.play().catch(error => {
        //   console.error('播放音频时出错:', error);
        // });

        // // 停止旧的音频播放
        // if (this.currentAudio && this.currentAudio !== audio) {
        //   this.currentAudio.pause();
        //   this.currentAudio = null; // 释放旧的Audio元素
        // }

        // // 保存当前播放的Audio元素的引用
        // this.currentAudio = audio;
      };

      // 发生错误时触发
      this.socket.onerror = (error) => {
        this.isConnected = false;
        console.error('Ws error observed:', error);
      };

      // 连接关闭时触发
      this.socket.onclose = (event) => {
        this.isConnected = false;
        if (event.wasClean) {
          console.log(`Ws closed cleanly with code ${event.code}`);
        } else {
          console.log('Ws connection was closed abruptly');
        }
        console.log('Ws was closed');
        // 连接关闭后可能需要重连的逻辑
      };
    },
    startRecording() {
      let that = this;
      const audio = new Audio()

      navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000, // 采样率，单位 Hz
          numberOfChannels: 1 // 声道数，1 为单声道，2 为立体声
        }
      }).then((stream) => {
        that.rc = stream
        audio.srcObject = stream

        that.audioContext = new AudioContext();
        const mediaStreamSource = that.audioContext.createMediaStreamSource(stream);

        const bufferSize = 0; // 根据需要选择缓冲区大小
        const scriptNode = that.audioContext.createScriptProcessor(bufferSize, 1, 1);
        // 当音频处理事件发生时
        scriptNode.onaudioprocess = (event) => {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          // 将音频数据编码为 RTP 协议头的 16 位二进制数据
          const rtpData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            rtpData[i] = inputData[i] * 32767; // 缩放到 16 位范围
          }
          //原数据的二进制数据
          const rtpBinary = rtpData.buffer;
          that.socket.send(rtpBinary);
        };
        mediaStreamSource.connect(scriptNode);
        scriptNode.connect(that.audioContext.destination);
      })
        .catch(error => alert(error));
    },
    stopRecording() {
      // if (this.mediaRecorder) {
      //   this.mediaRecorder.stop();
      // }
      const audioTrack = this.rc?.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.stop();
      }
      if (this.rc) {
        this.rc = null
        this.audioContext.close()
        this.audioContext = null
        //停止websocket连接
        // this.socket.close()
      }
    },
    routerReturn() {
      this.$router.push({
        name: "connectionManagement",
      });
    },
    doSquat(e) {
      let data = {
        "command": 'squat',
        "data": {
          height: e
        }
      }
      this.robotWs.robot.send(JSON.stringify(data));
    },
    doStand() {
      this.changeControl("stand");
      this.changeControl("inPlace");
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  overflow: hidden;
}

.video-container {
  display: flex;
  justify-content: center;
}

.video-item {
  position: fixed;
  z-index: 3;
  background-image: url("../../assets/images/image_loadingMedia.png");
}

.video-item1 {
  position: fixed;
  z-index: 3;
  background-image: url("../../assets/images/image_cameraBk.jpg");
}

.video-play {
  width: 100%;
  height: 100%;
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
  height: 6.25vw;
  background: rgba(13, 44, 68, 0.7);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 9999;

  .leftBox {
    width: 17.1875vw;
    margin-left: 1.4583vw;
  }

  .midBox {
    width: 28.0729vw;
  }

  .rightBox {
    width: 13.5417vw;
    margin-right: 1.4063vw;

    ::v-deep .el-button {
      width: 6.25vw;
      height: 2.7083vw;
      font-size: 1.25vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .boxItem {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 1.0417vw;
    width: 4.1667vw;
    height: 5.1667vw;
    padding: .5208vw 0;
    color: rgba(255, 255, 255, 0.6);
  }

  .chosedItem {
    background: linear-gradient(230deg, #198BFF 0%, #0086D1 100%);
    border-radius: .2083vw;
  }
}

.shortWidth {
  width: 80.2083vw;
}

.fullWidth {
  width: 100%;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.sideBox {
  width: 19.7917vw;
  height: calc(100% - 10.6944vw);
  background: rgba(23, 39, 55, 0.7);
  position: absolute;
  top: 4.4444vw;
  right: 0;
  z-index: 9999;
  animation: slideInFromRight 2s ease-out forwards;

  .title {
    width: 16.9792vw;
    height: 4.1667vw;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
    font-size: 1.4583vw;
    color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 1.3021vw;
    padding-left: 1.5104vw;
  }

  .sideContent {
    font-size: .8333vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: $white;
    display: flex;
    flex-wrap: wrap;

    .actionItem {
      text-align: center;
      flex-basis: 33.33%;
      padding: 1.0417vw 0;
    }

    .actionImg {
      width: 2.7083vw;
      height: 2.7083vw;
    }

    .chosedAction {
      background: linear-gradient(230deg, #198BFF 0%, #0086D1 100%);
      border-radius: .4167vw;
    }

    .setTab {
      height: 5.3646vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.4063vw 0 1.5104vw;

      .tabItem {
        font-size: 1.0417vw;
        color: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        flex-direction: column;
        height: 1.9271vw;
        justify-content: space-between;

        .chosed {
          color: #FFFFFF;
        }
      }

      .cDivider {
        width: .8333vw;
        height: .2083vw;
        background: #FFFFFF;
      }

    }

    .divider {
      height: .0521vw;
      background: rgba(255, 255, 255, 0.2);
    }

    .speedControl {
      height: 6.3542vw;
      padding: 0 1.4063vw 0 1.4583vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.0417vw;
      color: #FFFFFF;

      .controlTag {
        width: 10.7292vw;
        height: 2.0833vw;
        background: rgba(255, 255, 255, 0.1);
        border-radius: .2083vw;
        display: flex;

        .tag {
          width: 3.5417vw;
          height: 2.0833vw;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .chosedTag {
          background: linear-gradient(230deg, #198BFF 0%, #0086D1 100%);
          border-radius: .2083vw;
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
    margin-right: 1.5625vw;
  }

  .divider {
    width: 0.1042vw;
    height: 4.4271vw;
    background: $white;
    opacity: 0.3;
  }

  .inTxt {
    font-size: 1.4583vw;
    color: $white;
    margin-right: 1.9444vw;
    margin-left: 0.6944vw;
    vertical-align: middle;
  }
}

.inImg {
  width: 2.5vw;
  height: 2.5vw;
  z-index: 99;
  vertical-align: middle;
}

.opacity03 {
  opacity: 0.3;
}
</style>

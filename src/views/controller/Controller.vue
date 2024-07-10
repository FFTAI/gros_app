<template>
  <div ref="pageController">
    <div class="container common-bkg">
      <div align="center" class="videoContainer">
        <video class="video-play" ref="rtc_media_player" width="1920" height="1080" autoplay></video>
        <div class="topScale">
          <img class="turningHead" src="@/assets/images/icon_turningHead.png" />
          <span class="leftAngle">-40°</span>
          <div class="transverseRuler">
            <div class="tick" :class="{ longTick: (index % 6 - 5) === 0 }" v-for="(tick, index) in 47" :key="index"
              :style="{ left: index * .7292 + 'vw' }"></div>
            <span class="positionVal" :style="{ left: 15.75 + pointX * 16 + 'vw' }">{{ (pointX *
              40).toFixed(1) }}°</span>
          </div>
          <span class="rightAngle">40°</span>
        </div>
        <div class="rightScale">
          <img class="raiseHead" src="@/assets/images/icon_raiseHead.png" />
          <span class="topAngle">17°</span>
          <div class="verticalRuler">
            <div class="tick" :class="{ longTick: (index % 6 - 5) === 0 }" v-for="(tick, index) in 23" :key="index"
              :style="{ top: index * .7292 + 'vw' }"></div>
            <span class="positionVal" :style="{ top: (14.7 + pointY * 15) / 2 + 'vw' }">{{ (pointY *
              -17).toFixed(1) }}°</span>
          </div>
          <span class="bottomAngle">-17°</span>
        </div>
        <div class="indication">
          <span class="font" style="left: 0;">L</span>
          <span class="angleFont" style="left: 1.0417vw;">-45°</span>
          <img class="indicationImg" src="@/assets/images/image_indication.png" draggable="false" />
          <img class="pointer" src="@/assets/images/image_pointer.png" draggable="false"
            :style="{ transform: pointerTransform }" />
          <span class="angleFont" style="right: 1.0417vw;">45°</span>
          <span class="font" style="right: 0;">R</span>
          <div class="angleVal">
            <img class="turningImg" src="@/assets/images/icon_turningBody.png" />
            <span>{{ (direction * 45).toFixed(0) }}°</span>
          </div>
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
          <div class="divider spacing"></div>
          <div>
            <img class="inImg" style="width: 1.4583vw;height: 1.3542vw;" src="@/assets/images/icon_sRob.png" />
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
            <img class="inImg" style="height: 1.25vw; width: 1.6667vw;" src="@/assets/images/icon_Wifi.png" />
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
          <div class="boxItem" style="justify-content: space-around;" @click="cameraControl()">
            <img class="inImg" src="@/assets/images/icon_video.png" />
            <span>镜头切换</span>
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
            @click="changeControl('stand')">
            <img class="inImg" src="@/assets/images/icon_stand.png" />
            <span>站立</span>
            <span>Space</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: currentstatus == 'Walk', opacity03: currentstatus == 'Start' }">
            <img class="inImg" src="@/assets/images/icon_Stepping.png" />
            <span>行走</span>
            <span>W</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: reHead, opacity03: currentstatus == 'Start' }"
            @click="returnHead()">
            <img class="inImg" src="@/assets/images/icon_headReturn.png" />
            <span>回正</span>
            <span>①</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'inPlace', opacity03: currentstatus == 'Start' }"
            @click="changeControl('inPlace')">
            <img class="inImg" src="@/assets/images/icon_inPlace.png" />
            <span>原地</span>
            <span>②</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'grasping', opacity03: currentstatus == 'Start' }"
            @click="changeControl('grasping')">
            <img class="inImg" src="@/assets/images/icon_grasping.png" />
            <span>抓取</span>
            <span>③</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'face', opacity03: currentstatus == 'Start' }"
            @click="changeControl('face')">
            <img class="inImg" src="@/assets/images/icon_face.png" />
            <span>表情</span>
            <span>④</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'ai', opacity03: currentstatus == 'Start' }"
            @click="changeControl('ai')">
            <img class="inImg" src="@/assets/images/icon_AI.png" />
            <span>AI托管</span>
            <span>⑤</span>
          </div>
          <div class="boxItem" :class="{ chosedItem: controlModel == 'setup', opacity03: currentstatus == 'Start' }"
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

      <div class="popDialog">
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
        <div v-if="controlModel == 'face'" class="actionItem" :class="{ chosedAction: item.name == mode }"
          v-for="(item, index) in faceList" :key="index" @click="showFace(item.val)">
          <img class="actionImg" :src="item.src" />
          <div>{{ item.name }}{{ ' ( ' + item.keyCode + ' )' }}</div>
        </div>
        <div v-if="controlModel == 'setup'" style="width: 100%;">
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
    <!-- 当前状态提示 -->
    <div class="stateMessage flex-center" v-if="mode != '' ||
              mode == 'initial'
              ">
      <!-- <span>{{ $t(mode) }}{{ $t("ing") }}...</span> -->
    </div>
    <!-- <prompt-box v-if="promptVisible || !connected" :prompt="connected ? promptVal : 'reconnect'" @cancel="cancel()"
      @confirm="confirm()"></prompt-box> -->
    <canvas ref="canvas" width="1920" height="1080" style="display:none;"></canvas>
    <!-- <div style="z-index: 99999;position: absolute;left: 1000px;top: 500px;">
      <button @click="joinRoom">Join Room</button>
      <div v-if="joined">
        <h2>Room: {{ room }}</h2>
        <webrtc :stream="stream" @ready="onWebRTCReady" />
      </div>
    </div> -->
    <robotCard :jointStates="jointStates"></robotCard>
  </div>
</template>
<script>
import robotCard from "@/components/robotCard.vue";
import { mapState } from "vuex";

export default {
  components: { robotCard },
  computed: {
    ...mapState(["gamepadConnected", "connected", "currRobot"]),
  },
  data() {
    return {
      buttons: "", //当前按键
      screenWidth: document.body.clientWidth, //当前屏幕宽度
      speed: 1, //当前速度档位 1-3
      controlModel: "", //当前运动
      mode: "", //当前运动模式
      velocity: 0,
      ySpeed: 0,
      direction: 0,
      promptVisible: false,
      promptVal: "",
      lastMessageReceivedTime: Date.now(),
      wsInterval: null,
      currentstatus: "Start", //当前状态: Unknown=0,Start=1,Zero=2,Zero2Stand=6,Stand=3,Stand2Walk=7,Walk=4,Stop=5
      lastX: 0,
      lastY: 0,
      pointX: 0,
      pointY: 0,
      mute: true,
      recording: false,
      socket: null,
      mediaRecorder: null,
      audioContext: null,
      rc: null,
      sdk: null,
      currentAudio: '',
      localSocket: null,
      leftMouseDown: false,
      rightMouseDown: false,
      mouseFlag: true,
      keyFlag: true,
      reHead: false,
      faceTimeout: null,
      robotName: "",
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
      ],
      faceList: [
        {
          name: '高兴',
          src: require('@/assets/images/icon_happy.png'),
          keyCode: 'c',
          val: 'roundedHappy'
        }, {
          name: '难过',
          src: require('@/assets/images/icon_sad.png'),
          keyCode: 'v',
          val: 'roundedError'
        }, {
          name: '加载',
          src: require('@/assets/images/icon_loading.png'),
          keyCode: 'b',
          val: 'roundedLoading'
        }, {
          name: '输出',
          src: require('@/assets/images/icon_input.png'),
          keyCode: 'n',
          val: 'roundedOutput'
        }, {
          name: '输入中',
          src: require('@/assets/images/icon_output.png'),
          keyCode: 'm',
          val: 'roundedInput'
        }
      ],
      cameraId: 0,
      cameraList: [],
      changeCamera: true,
      jointStates: null,
      standInterval: null,
      pointerTransform: "translate(-50%, -100%) rotate(0deg)",
    };
  },
  created() {
    // this.initLocalMediaWs();
    this.robotName = this.$route.query.robotName;
    this.$bus.$emit("initWs", this.robotName);
  },
  async mounted() {
    this.$bus.$on('robotOnconnected', () => {
      this.getCameraList();
      this.initMediaWs();
      this.createWsInterval();
      this.getStates();
      this.startPlay();
    })
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
    window.addEventListener('contextmenu', this.disableContextMenu);
    window.addEventListener('message', (event) => {
      if (event.data.type === 'mousemove') {
        const { clientX, clientY } = event.data.data;
        console.log('Mouse moved in iframe:', clientX, clientY);
        this.onMouseMove({ clientX: clientX, clientY: clientY })
      }
    });
    this.$bus.$on('robotOnmessage', (data) => {
      // Unknown=0,Start=1,Zero=2,Zero2Stand=6,Stand=3,Stand2Walk=7,Walk=4,Stop=5
      // console.log('robotOnmessage', data)
      if (data.function == "list_camera") {
        this.cameraList = data.data
      } else {
        switch (data.data.states.fsmstatename.currentstatus) {
          case 0:
            this.currentstatus = 'Unknown'
            break;
          case 1:
            this.currentstatus = 'Start'
            break;
          case 2:
            this.currentstatus = 'Zero'
            this.controlModel = ""
            break;
          case 3:
            this.currentstatus = 'Stand'
            if (!this.controlModel) {
              this.controlModel = 'inPlace'
            }
            this.changeControl(this.controlModel);
            break;
          case 4:
            this.currentstatus = 'Walk'
            this.changeControl('gait')
            break;
          case 5:
            this.currentstatus = 'Stop'
            break;
          case 6:
            // this.currentstatus = 'Zero2Stand'
            this.currentstatus = 'Stand'
            if (!this.controlModel) {
              this.controlModel = 'inPlace'
            }
            this.changeControl(this.controlModel);
            break;
          case 7:
            // this.currentstatus = 'Stand2Walk'
            this.currentstatus = 'Walk'
            break;
          default:
            break;
        }
        console.log('robotOnmessage', data)
        let obj = data.data.joint_states
        this.jointStates = JSON.stringify({ joint_states: obj })
      }
      console.log('robotOnmessage', this.currentstatus)
    })
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMousedown);
    document.removeEventListener('mouseup', this.onMouseup);
    window.removeEventListener('contextmenu', this.disableContextMenu);
    this.disableStates();
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.socket) {
      this.socket.close();
    }
  },
  destroyed() {
    clearInterval(this.wsInterval);
  },
  methods: {
    disableContextMenu(event) {
      event.preventDefault();
    },
    getStates() {
      let data = {
        "command": "states",
        "data": {
          "frequency": 30
        }
      }
      this.robotWs.robot.send(JSON.stringify(data));
    },
    disableStates() {
      let data = {
        "command": "disable_states",
        "data": null
      }
      this.robotWs.robot.send(JSON.stringify(data));
    },
    startPlay() {
      if (this.sdk) {
        this.sdk.close();
      }
      this.sdk = new SrsRtcWhipWhepAsync();
      this.$refs.rtc_media_player.srcObject = this.sdk.stream
      var url = 'http://101.133.149.215:1985/rtc/v1/whep/?app=live&stream=' + this.robotName
      // var url = 'http://192.168.11.64:1985/rtc/v1/whep/?app=live&stream=' + this.robotName
      this.sdk.play(url)
        .then((session) => {
          console.log('成功拉流:', session);
          setTimeout(() => {
            this.changeCamera = true
          }, 5000);
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
                this.$bus.$emit("initWs", this.robotName);
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
    //鼠标移动
    onMouseMove(event) {
      // event.preventDefault();
      if (this.mouseFlag) {//节流，每秒发送25次
        this.mouseFunc(event);
        this.mouseFlag = false;
        setTimeout(() => {
          this.mouseFlag = true;
        }, 40);
      }
    },
    mouseFunc(event) {
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
        if (currPointX < -1) currPointX = -1
        if (currPointY > 1) currPointY = 1
        if (currPointY < -1) currPointY = -1
        // console.log('横向', this.lastX, '竖向', this.lastY)
        console.log('横向', event.clientX, '竖向', event.clientY)
        let yaw = currPointX * 40;
        let pitch = currPointY * -17;
        if (this.leftMouseDown) {
          this.pointX = currPointX.toFixed(2)
          this.pointY = currPointY.toFixed(2)
          this.operateHead(pitch, yaw);
        }
        //转向移动
        if (this.rightMouseDown && this.ySpeed == 0) {
          let xMove = currPointX * 2;
          if (xMove > 1) xMove = 1;
          if (xMove < -1) xMove = -1;
          this.direction = xMove
          const rotation = this.direction * 90;
          this.pointerTransform = `translate(-50%, -100%) rotate(${rotation}deg)`;
          this.operateWalk(
            this.direction * -45,
            this.velocity,
            this.ySpeed
          );
        }
      }
    },
    onMousedown(event) {
      if (event.target.matches('.inImg') || event.target.matches('span')) {
        // 阻止事件的进一步传播
        console.log('mousedown----nonono', event)
      } else {
        console.log('mousedown', event)
        this.$refs.pageController.style.cursor = 'none';
        if (event.button == 0 && event.buttons == 1) {
          this.leftMouseDown = true;
        } else if (event.button == 2 && event.buttons == 2) {
          this.rightMouseDown = true;
        }
      }
    },
    onMouseup(event) {
      this.$refs.pageController.style.cursor = 'auto';
      if (event.button == 0 && event.buttons == 0) {
        this.leftMouseDown = false;
      } else if (event.button == 2 && event.buttons == 0) {
        this.rightMouseDown = false;
        this.direction = 0;
        this.pointerTransform = `translate(-50%, -100%) rotate(${0}deg)`;
        this.operateWalk(
          this.direction,
          this.velocity,
          this.ySpeed
        );
      }
    },
    //键盘操控
    handleKeyDown(event) {
      // event.preventDefault();
      console.log('keydown', event.keyCode)
      const walkKeys = {
        87: { velocity: 1, direction: this.direction }, // W
        83: { velocity: -1, direction: this.direction },  // S
        65: { velocity: -1, direction: this.direction },  // A
        68: { velocity: 1, direction: this.direction }, // D
      };
      const walkInfo = walkKeys[event.keyCode];
      if (walkInfo) {
        // console.log('walkInfo', walkInfo)
        if (this.keyFlag) {
          this.changeControl('gait')
          if ((event.keyCode == 87 || event.keyCode == 83) && !this.standInterval) {
            this.velocity = walkInfo.velocity * this.speed / 6.25;
            this.operateWalk(this.direction * -45, this.velocity, 0);
          }
          if (event.keyCode == 65 || event.keyCode == 68) {
            this.ySpeed = walkInfo.velocity * this.speed / -10;
            this.operateWalk(this.direction * -45, 0, this.ySpeed);
          }
          this.keyFlag = false;
          setTimeout(() => {
            this.keyFlag = true;
          }, 500);
        }
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
      const faceKeys = {
        67: { key: "c", value: "roundedHappy" },
        86: { key: "v", value: "roundedError" },
        66: { key: "b", value: "roundedLoading" },
        78: { key: "n", value: "roundedOutput" },
        77: { key: "m", value: "roundedInput" },
      }
      const faceInfo = faceKeys[event.keyCode];
      if (faceInfo && this.controlModel == 'face') this.showFace(faceInfo.value);
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
      if (event.keyCode == 49) this.returnHead()
      if (event.keyCode == 32) {
        this.changeControl("stand");
      }
      if (event.keyCode == 192) {
        if (this.mute) {
          this.micControl('on')
        } else {
          this.micControl('off')
        }
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
        console.log('keyInfo...', event.keyCode)
        // if (event.keyCode == 65 || event.keyCode == 68) this.keyDirection = false
        // console.log('放开方向', this.direction, '放开速度', this.velocity)
        // this.operateWalk(
        //   this.direction * -45,
        //   (this.velocity * this.speed) / 6.25
        // );
        this.changeControl("stand");
      }
      if (event.keyCode == 17) this.doSquat(0)
    },
    calibration() {
      this.promptBoxOpen("calibration");
    },
    doCalibration() {
      this.robotWs.robot.send(JSON.stringify({ "command": 'zero' }));
      this.mode = "initial";
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
      } else {
        this.speed = e
      }
    },
    //操控行走
    operateWalk(direction, xSpeed, ySpeed) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
      console.log("Walk。。。。。", direction, xSpeed, ySpeed);
      try {
        let data = {
          "command": 'walk',
          "data": {
            angle: direction,
            x_speed: xSpeed,
            y_speed: ySpeed, //左正右负
            time: formattedDate,
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
      } catch (error) {
        console.log("Walk错误。。。。。。", error);
      }
    },
    //操控头部
    operateHead(pitch, yaw) {
      // console.log("头部。。。。。", pitch, yaw);
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
      try {
        let data = {
          "command": 'head',
          "data": {
            roll: 0,
            pitch: pitch,
            yaw: yaw,
            time: formattedDate,
          }
        }
        // console.log('发送时间',formattedDate)
        this.robotWs.robot.send(JSON.stringify(data));
      } catch (error) {
        console.log("Head错误。。。。。。", error);
      }
    },
    //操控身体
    operateBody(squat, rotate_waist) {
      // console.log("身体。。。。。", squat, rotate_waist);
      try {
        this.robotWs.robot.body(squat, rotate_waist);
      } catch (error) {
        console.log("Body错误。。。。。。", error);
      }
    },
    //切换当前控制模式
    changeControl(e) {
      console.log('changeControl', e, this.currentstatus, this.velocity)
      if (this.currentstatus == 'Start') return;
      if (e == "stand" && this.currentstatus != 'Start') {
        if (!this.standInterval) {
          let intervalIndex = 1
          this.standInterval = setInterval(() => {
            console.log('standInterval', intervalIndex)
            this.operateWalk(0, this.velocity * intervalIndex.toFixed(1), 0);
            if (intervalIndex.toFixed(1) == 0) {
              clearInterval(this.standInterval)
              this.standInterval = null
              this.robotWs.robot.send(JSON.stringify({ "command": 'stand' }));
              this.velocity = 0;
              this.ySpeed = 0;
              setTimeout(() => {
                this.robotWs.robot.send(JSON.stringify({ "command": 'stand' }));
              }, 100);
            } else {
              intervalIndex = intervalIndex.toFixed(1) - 0.1
            }
          }, 100);
        }
        // this.currentstatus = "Stand";
      } else if (["inPlace", "grasping", "face", "ai", "setup"].includes(e)) {
        this.controlModel = e;
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
    async showFace(e) {
      clearTimeout(this.faceTimeout)
      let data = {
        "command": "emotion",
        "data": {
          "emotion": e
        }
      }
      this.robotWs.robot.send(JSON.stringify(data));
      this.faceTimeout = setTimeout(() => {
        let data = {
          "command": "emotion",
          "data": {
            "emotion": 'roundedNormal'
          }
        }
        this.robotWs.robot.send(JSON.stringify(data));
      }, 10000);
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
    micControl(e) {
      if (e == 'on') {
        console.log("解除静音")
        this.mute = false
        this.$refs.rtc_media_player.volume = 1;
        this.$refs.rtc_media_player.play()
        this.startRecording()
      } else {
        console.log("静音")
        this.mute = true
        this.stopRecording()
      }
    },
    getCameraList() {
      // let data = {
      //   "command": "list_camera",
      //   "data": null
      // }
      // this.robotWs.robot.send(JSON.stringify(data));
      this.cameraList = ["Default", "Left", "Right", "Double"]
    },
    cameraControl() {
      if (!this.changeCamera) return
      console.log('切换镜头~~~~~~~~~~~', this.cameraList, this.cameraId)
      this.changeCamera = false
      let cameraType = "Defalut"
      for (let i = 0; i < this.cameraList.length; i++) {
        if (this.cameraList[i] != "Defalut" && i == (this.cameraId + 1)) {
          cameraType = this.cameraList[i]
        }
      }
      if (this.cameraId == this.cameraList.length - 1) {
        this.cameraId = 1
        cameraType = this.cameraList[1]
      } else {
        this.cameraId++
      }
      let data = {
        "command": "start_camera",
        "data": {
          "camera": cameraType
        }
      }
      this.robotWs.robot.send(JSON.stringify(data));
      setTimeout(() => {
        this.startPlay();
      }, 1000);

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
          sampleRate: 48000, // 采样率，单位 Hz
          numberOfChannels: 1, // 声道数，1 为单声道，2 为立体声
          echoCancellation: true, // 开启回音消除
          noiseSuppression: true, // 开启降噪
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
          // that.localSocket.send(rtpBinary);
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
      }
    },
    routerReturn() {
      this.$router.push({
        name: "connectionManagement",
      });
    },
    //下蹲控制
    doSquat(e) {
      let data = {
        "command": 'squat',
        "data": {
          height: e
        }
      }
      this.robotWs.robot.send(JSON.stringify(data));
    },
    //头部回正
    returnHead() {
      this.reHead = true
      setTimeout(() => {
        this.reHead = false
      }, 100);
      this.pointX = 0
      this.pointY = 0
      this.operateHead(0, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  overflow: hidden;
  background-image: url("../../assets/images/bg_loading.png");
}

.videoContainer {
  position: absolute;
  top: 9.26vh;
  right: 2.0833vw;
  width: 62.5vw;
  height: 35.1563vw;

  .video-play {
    width: 62.5vw;
    // height: 62.47vh;
    height: 35.1563vw;
    // background: #282828;
    background-image: url("../../assets/images/bg_videoLoading.png");
    background-size: contain;
  }

  .topScale {
    position: absolute;
    top: .8333vw;
    left: 9.8958vw;
    width: 40.625vw;
    height: 2.0833vw;
    background: rgba(25, 0, 73, 0.3);
    border-radius: .2083vw;
    z-index: 8888;
    font-size: 16px;
    color: #FFFFFF;

    .turningHead {
      width: 1.5625vw;
      height: 1.1458vw;
      position: absolute;
      left: .7292vw;
      top: .5729vw;
    }

    .leftAngle {
      position: absolute;
      left: 2.7604vw;
      top: .4688vw;
      opacity: 0.6;
    }

    .rightAngle {
      position: absolute;
      right: .9375vw;
      top: .4688vw;
      opacity: 0.6;
    }

    .transverseRuler {
      height: .625vw;
      position: absolute;
      top: .7292vw;
      left: 4.5313vw;
      z-index: 9999;
      display: flex;
      align-items: flex-end;

      .tick {
        width: .1042vw;
        height: .4167vw;
        background: #FFFFFF;
        opacity: 0.4;
        position: absolute;
      }

      .longTick {
        height: .625vw;
        opacity: 0.8;
      }

      .positionVal {
        width: 2.0833vw;
        height: 1.4583vw;
        background: #FFFFFF;
        border-radius: .2083vw;
        position: absolute;
        top: -0.5vw;
        font-size: .63vw;
        color: #190049;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .rightScale {
    position: absolute;
    top: 5.5729vw;
    right: .8333vw;
    width: 2.0833vw;
    height: 21.6146vw;
    background: rgba(25, 0, 73, 0.3);
    border-radius: .2083vw;
    z-index: 8888;
    font-size: 16px;
    color: #FFFFFF;

    .raiseHead {
      width: 1.1458vw;
      height: .9896vw;
      position: absolute;
      right: .4688vw;
      top: .7813vw;
    }

    .topAngle {
      position: absolute;
      right: .4167vw;
      top: 2.1354vw;
      opacity: 0.6;
    }

    .bottomAngle {
      position: absolute;
      right: .2604vw;
      bottom: .4688vw;
      opacity: 0.6;
    }

    .verticalRuler {
      position: absolute;
      right: .8333vw;
      top: 3.5417vw;
      z-index: 9999;
      display: flex;
      flex-direction: row-reverse;

      .tick {
        width: .4167vw;
        height: .1042vw;
        background: #FFFFFF;
        opacity: 0.4;
        position: absolute;
      }

      .longTick {
        width: .625vw;
        opacity: 0.8;
      }

      .positionVal {
        width: 2.0833vw;
        height: 1.4583vw;
        background: #FFFFFF;
        border-radius: .2083vw;
        position: absolute;
        right: -0.85vw;
        font-size: .63vw;
        color: #190049;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .indication {
    width: 22.8646vw;
    height: 6.1599vw;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    .indicationImg {
      width: 22.1875vw;
      height: 6.1979vw;
    }

    .pointer {
      width: .4688vw;
      height: 2.7083vw;
      position: absolute;
      bottom: -2.6vw;
      left: 11.45vw;
      transform-origin: bottom;
      transition: transform 0.2s ease-in-out;
    }

    .angleFont {
      font-weight: bold;
      font-size: 16px;
      color: #FFFFFF;
      position: absolute;
      bottom: .6771vw;
      opacity: 0.5;
    }

    .font {
      font-size: 1.0417vw;
      color: #FFFFFF;
      font-weight: bold;
      position: absolute;
      bottom: 0;
    }

    .angleVal {
      position: absolute;
      top: 1.3021vw;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 20px;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 3.3333vw;

      .turningImg {
        width: 1.5625vw;
        height: 1.3021vw;
      }
    }

  }

  .loadingLogo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}

.buttons {
  display: flex;
  margin-top: 1.3889vw;
}

.bottomBox {
  height: 3.5417vw;
  background: linear-gradient(274deg, rgba(25, 0, 73, 0.2) 0%, rgba(25, 0, 73, 0.2) 100%);
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
    margin-right: 11.875vw;
  }

  .rightBox {
    width: 8.5417vw;
    margin-right: 2.0833vw;

    ::v-deep .el-button {
      width: 3.8542vw;
      height: 1.6667vw;
      font-size: .8333vw;
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
    font-size: .625vw;
    width: 4.1667vw;
    // padding: .5208vw 0;
    color: rgba(255, 255, 255, 0.6);
  }

  .chosedItem {
    background: #AB76FF;
    border-radius: .2083vw;
  }
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

.headState {
  position: absolute;
  top: .7292vw;
  left: 10.9375vw;
  z-index: 99;
  display: flex;
  align-items: center;

  .headTxt {
    font-size: 1.25vw;
    color: $white;
    font-style: normal;
  }

  .cDivider {
    width: .0521vw;
    height: 1.25vw;
    background: #FFFFFF;
    margin-left: 1.4583vw;
  }

  .actionTxt {
    font-size: 1.0417vw;
    color: #FFFFFF;
    margin-left: 1.4583vw;
  }
}

.headBkIn {
  position: absolute;
  top: 0;
  left: 0;
  height: 3.125vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  background: linear-gradient(274deg, rgba(25, 0, 73, 0) 0%, rgba(122, 36, 253, 0.2) 100%);

  .return {
    width: 1.6667vw;
    height: 1.4167vw;
  }

  .headReturn {
    height: 3.125vw;
    width: 5.6667vw;
    background: #542C89;
    padding-left: 1.24vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .headReturn::after {
    position: absolute;
    content: " ";
    left: 5.6vw;
    top: 0.0vw;
    border-width: 3.125vw 1.3021vw;
    border-style: solid;
    border-color: #542C89 transparent transparent transparent;
  }

  .spacing {
    margin-right: 1.1458vw;
  }

  .divider {
    width: .1042vw;
    height: 3.125vw;
    background: $white;
    opacity: 0.1;
  }

  .inTxt {
    font-size: 1.25vw;
    color: $white;
    margin-right: 1.1458vw;
    margin-left: 0.6944vw;
    vertical-align: middle;
  }
}

.inImg {
  width: 1.3542vw;
  height: 1.3542vw;
  z-index: 99;
  vertical-align: middle;
}

.opacity03 {
  opacity: 0.3;
}

.popDialog {
  width: 95.8333vw;
  height: 8.0729vw;
  position: absolute;
  left: 2.0833vw;
  bottom: 4.6875vw;
  z-index: 9999;
  background-image: url("../../assets/images/image_pop.png");
  background-size: contain;
  display: flex;
  align-items: center;

  .actionItem {
    margin-left: 3.5417vw;
    font-size: .8333vw;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;

    .actionImg {
      width: 2.2917vw;
      height: 2.2917vw;
      margin-bottom: 0.6vw;
    }
  }

  .chosedAction {
    // background: #AB76FF;
    // border-radius: .4167vw;
  }

  .speedControl {
    height: 6.3542vw;
    padding: 0 1.4063vw 0 1.4583vw;
    display: flex;
    gap: 1.25vw;
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
        background: #AB76FF;
        border-radius: .2083vw;
      }
    }
  }
}
</style>

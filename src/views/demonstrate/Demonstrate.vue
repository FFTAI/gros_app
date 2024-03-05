<template>
  <div class="black-bkg main">
    <el-button type="primary" @click="enableHand()">使能手</el-button>
    <el-button type="danger" @click="disableHand()">失能手</el-button>
    <el-button type="primary" @click="enableEffector()">使能末端</el-button>
    <el-button type="danger" @click="disableEffector()">失能末端</el-button>
    <span style="color: #ffffff; font-size: 48px">{{ buttons }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { EndEffector, Motor } from "rocs-client";
import * as THREE from "three";
export default {
  computed: {
    ...mapState(["gamepadConnected"]),
  },
  data() {
    return {
      effector: undefined,
      hand: undefined,
      buttons: "",
      effectorWsOpen: false,
      handWsOpen: false,
      originPoint: {
        left_x: 0.21259541809558869,
        left_y: 0.07841146737337113,
        left_z: -0.6630199551582336,
        left_qw: -0.6630199551582336,
        left_qx: 0.4591652750968933,
        left_qy: 0.12008531391620636,
        left_qz: 0.6264786720275879,
        right_x: 0.21259541809558869,
        right_y: 0.07841146737337113,
        right_z: -0.6630199551582336,
        right_qw: -0.6630199551582336,
        right_qx: 0.4591652750968933,
        right_qy: 0.12008531391620636,
        right_qz: 0.6264786720275879,
      }, //零点位置数据
      //左手指6个自由度
      left9f: false,
      left10f: false,
      left11f: false,
      left12f: false,
      left13f: false,
      left14f: false,
      //右手指6个自由度
      right9f: false,
      right10f: false,
      right11f: false,
      right12f: false,
      right13f: false,
      right14f: false,
    };
  },
  created() {},
  mounted() {
    const _this = this;
    // 每10ms 获取一次手柄数据，查看是否按下手柄按键
    this.initEffectorWs();
    this.initHandWs();
    this.getOriginPoint()
    this.interval = setInterval(function () {
      let gamepad = null;
      gamepad = navigator.getGamepads()[0]
        ? navigator.getGamepads()[0]
        : navigator.getGamepads()[1]
        ? navigator.getGamepads()[1]
        : navigator.getGamepads()[2]
        ? navigator.getGamepads()[2]
        : navigator.getGamepads()[3];
      if (gamepad) {
        _this.pressKey(gamepad.buttons);
        _this.remoteSensing(gamepad.axes);
      }
    }, 10);
  },
  methods: {
    /**
     * 初始化WS
     */
    initEffectorWs() {
      this.effector = new EndEffector({
        host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
      });
      this.effector.on_connected(() => {
        console.log("effector成功！");
      });
      this.effector.on_message((data) => {
        var currData = JSON.parse(data.data);
        console.log("effector---Data", currData);
      });
      this.effector.on_close(() => {
        console.log("effector关闭！");
      });
      this.effector.on_error(() => {
        console.log("effector出错！");
      });
    },
    initHandWs() {
      this.hand = new Motor({
        host: process.env.VUE_APP_URL.split("//")[1].split(":")[0],
      });
      this.hand.on_connected(() => {
        console.log("hand成功！");
      });
      this.hand.on_message((data) => {
        var currData = JSON.parse(data.data);
        console.log("hand---Data", currData);
      });
      this.hand.on_close(() => {
        console.log("hand关闭！");
      });
      this.hand.on_error(() => {
        console.log("hand出错！");
      });
    },
    //获取零点位置
    getOriginPoint() {
      this.effector
        .origin_point()
        .then((res) => {
          console.log("零点位置。。。", res);
          // this.originPoint = res.data;
        })
        .catch((err) => {});
    },
    /**
     * 手柄监听
     */
    remoteSensing(arr) {
      // console.log("左遥感左右", arr[0]);
      // console.log("左遥感上下", ); //上负下正
      if (!this.effectorWsOpen || !this.originPoint) return;
      console.log(arr);
      var leftParam = {
        x: this.originPoint.left_x + arr[0] * 0.1,
        y: this.originPoint.left_y + arr[1] * -0.1,
        z: this.originPoint.left_z,
        qx: this.originPoint.left_qx,
        qy: this.originPoint.left_qy,
        qz: this.originPoint.left_qz,
        qw: this.originPoint.left_qw,
        vx: 0,
        vy: 0,
        vz: 0,
      };
      var rightParam = {
        x: this.originPoint.right_x + arr[2] * 0.1,
        y: this.originPoint.right_y + arr[3] * -0.1,
        z: this.originPoint.right_z,
        qx: this.originPoint.right_qx,
        qy: this.originPoint.right_qy,
        qz: this.originPoint.right_qz,
        qw: this.originPoint.right_qw,
        vx: 0,
        vy: 0,
        vz: 0,
      };
      try {
        //末端移动
        this.effector.control_left(leftParam);
        this.effector.control_right(rightParam);
      } catch (error) {
        console.log("effector错误。。。。。。", error);
      }
    },
    // 手柄按键
    pressKey(arr) {
      for (let i = 0; i < arr.length; i++) {
        var angle = 1000;
        var flag = false;
        if (arr[i].value === 1) {
          angle = 0;
          flag = true;
        }
        if (i === 4 && this.left9f != flag) {
          this.buttons = "左9";
          this.moveMotor(9, "left", angle);
          this.left9f = flag;
        }
        if (i === 6 && this.left10f != flag) {
          this.buttons = "左10";
          this.moveMotor(10, "left", angle);
          this.left10f = flag;
        }
        if (i === 12 && this.left11f != flag) {
          this.buttons = "左11";
          this.moveMotor(11, "left", angle);
          this.left11f = flag;
        }
        if (i === 15 && this.left12f != flag) {
          this.buttons = "左12";
          this.moveMotor(12, "left", angle);
          this.left12f = flag;
        }
        if (i === 13 && this.left13f != flag) {
          this.buttons = "左13";
          this.moveMotor(13, "left", angle);
          this.left13f = flag;
        }
        if (i === 14 && this.left14f != flag) {
          this.buttons = "左14";
          this.moveMotor(14, "left", angle);
          this.left14f = flag;
        }
        if (i === 5 && this.right9f != flag) {
          this.buttons = "右9";
          this.moveMotor(9, "right", angle);
          this.right9f = flag;
        }
        if (i === 7 && this.right10f != flag) {
          this.buttons = "右10";
          this.moveMotor(10, "right", angle);
          this.right10f = flag;
        }
        if (i === 3 && this.right11f != flag) {
          this.buttons = "右11";
          this.moveMotor(11, "right", angle);
          this.right11f = flag;
        }
        if (i === 1 && this.right12f != flag) {
          this.buttons = "右12";
          this.moveMotor(12, "right", angle);
          this.right12f = flag;
        }
        if (i === 0 && this.right13f != flag) {
          this.buttons = "右13";
          this.moveMotor(13, "right", angle);
          this.right13f = flag;
        }
        if (i === 2 && this.right14f != flag) {
          this.buttons = "右14";
          this.moveMotor(14, "right", angle);
          this.right14f = flag;
        }
      }
    },
    //手移动
    moveMotor(no, orientation, angle) {
      try {
        this.hand.move_motor(no, orientation, angle);
      } catch (error) {
        console.log("movehand错误", error);
      }
    },
    //使能手
    enableHand() {
      this.hand
        .enable_hand()
        .then((res) => {
          console.log("enablehand--success", res);
          this.handWsOpen = true;
        })
        .catch((err) => {
          console.log("enablehand--err", err);
        });
    },
    //失能手
    disableHand() {
      this.hand
        .disable_hand()
        .then((res) => {
          console.log("disableHand--success", res);
          this.handWsOpen = false;
        })
        .catch((err) => {
          console.log("disableHand--err", err);
        });
    },
    //使能末端
    enableEffector() {
      this.effector
        .enable()
        .then((res) => {
          console.log("enableEffector--success", res);
          this.effectorWsOpen = true;
        })
        .catch((err) => {
          console.log("enableEffector--err", err);
        });
    },
    //失能末端
    disableEffector() {
      this.effector
        .disable()
        .then((res) => {
          console.log("disableEffector--success", res);
          this.effectorWsOpen = false;
        })
        .catch((err) => {
          console.log("disableEffector--err", err);
        });
    },
    //角度转弧度
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    },
    //转欧拉角
    eulerFromAngles(xAngle, yAngle, zAngle) {
      var xRad = degreesToRadians(xAngle);
      var yRad = degreesToRadians(yAngle);
      var zRad = degreesToRadians(zAngle);

      var eulerX = xRad;
      var eulerY = yRad;
      var eulerZ = zRad;

      return { x: eulerX, y: eulerY, z: eulerZ };
    },
    //欧拉角转四元数
    quaternionFromEuler(euler) {
      var quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(
        new THREE.Euler(euler.x, euler.y, euler.z, "XYZ")
      );
      return quaternion;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
}
</style>
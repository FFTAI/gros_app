<template>
  <div>
    <div class="container">
      <rtc-header></rtc-header>
      <div class="black-bkg flex-center">
        <div
          style="
            position: absolute;
            left: 10.4167vw;
            top: 0.9583vw;
            font-size: 40px;
            color: #ffffff;
            z-index: 999;
          "
        >
          图形化编程
        </div>
        <div class="programTable">
          <!-- <div
            style="
              height: 2.125vw;
              width: 100%;
              display: flex;
              color: #85888b;
              justify-content: center;
            "
          >
            <div class="titleChild">项目名称</div>
            <div class="titleChild">描述</div>
            <div class="titleChild">管理</div>
          </div> -->
          <div class="tableItem titleBg">
            <div class="itemChild2">工作流名称</div>
            <div class="itemChild3">描述</div>
            <div class="itemChild1">管理</div>
          </div>
          <div
            class="tableItem"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <div class="itemChild2">
              {{ item.name }}
            </div>
            <div class="itemChild3">
              {{ item.des }}
            </div>
            <div class="itemChild1">
              <!-- <el-button
                type="success"
                @click="startUp(item)"
                style="margin-right: 1.5vw"
                :disabled="item.isStarting"
                >启动</el-button
              >
              <el-button
                type="danger"
                @click="handleDelete(item)"
                :disabled="!item.isStarting"
                >终止</el-button
              > -->
              <div v-if="!item.isStarting" style="display: flex; align-items: center">
                <img class="startBtn" src="@/assets/images/btn_startUp.png" />
                <span style="color: #44d8fb; margin-left: 0.3333vw">启动</span>
              </div>
              <div v-else style="display: flex; align-items: center">
                <img class="startBtn" src="@/assets/images/btn_finish.png" />
                <span style="color: #FF6656; margin-left: 0.3333vw">终止</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="joystickGet">
        <el-tag
          style="
            height: 4.1667vw;
            width: 8.3333vw;
            font-size: 1.5vw;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          >{{ buttons }}</el-tag
        >
      </div> -->
      <!-- <div class="stopControl">
        <el-button
          style="
            height: 4.1667vw;
            width: 8.3333vw;
            font-size: 1.5vw;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          size="large"
          type="warning"
          @click="testApi()"
          >测试接口</el-button
        >
      </div> -->
    </div>
  </div>
</template>
  <script>
import RtcHeader from "@/components/rtcHeader.vue";
import { mapState } from "vuex";
import axios from "@/http/axios";
export default {
  components: { RtcHeader },
  computed: {
    ...mapState(["gamepadConnected", "connected"]),
  },
  data() {
    return {
      buttons: "等待按键", //当前按键
      interval: null,
      intervalCount: 0,
      tableData: [
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "111",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "222",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "333",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "444",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "444",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "444",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "444",
          instanceId: "001",
        },
        {
          name: "Flow-14:34:05",
          des: "New empty flow",
          api: "/robot/Flow-14:34:05",
          id: "444",
          instanceId: "001",
        }
      ],
      joystickData: {
        commands: [
          {
            name: "left",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "right",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "up",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "down",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "L1",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "L2",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "R1",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "R2",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "triangle",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "circle",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "cross",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
          {
            name: "square",
            parameters: [
              {
                key: "pressed",
                value: 0,
              },
            ],
          },
        ],
      },
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
    this.getTableData();
    this.startGamepad();
  },
  methods: {
    getTableData() {
      this.$http
        .request({
          baseURL: process.env.VUE_APP_URL.slice(0, -4) + "3000",
          method: "GET",
          url: "/api/flow/published?brief=true",
        })
        .then((response) => {
          console.log("success---getTableData", response);
          this.tableData = response.data.flowList.map((obj) => {
            return { ...obj, isStarting: false };
          });
          console.log(this.tableData);
        })
        .catch((error) => {
          console.log("error---getTableData", error);
        });
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
          if (_this.intervalCount >= 20) {
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
    remoteSensing(arr) {},
    // 手柄按键
    pressKey(arr) {
      let currBtn = "";
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === 1) {
          switch (i) {
            case 4:
              currBtn = "L1";
              break;
            case 5:
              currBtn = "R1";
              break;
            case 6:
              currBtn = "L2";
              break;
            case 7:
              currBtn = "R2";
              break;
            case 0:
              currBtn = "cross";
              break;
            case 1:
              currBtn = "circle";
              break;
            case 2:
              currBtn = "square";
              break;
            case 3:
              currBtn = "triangle";
              break;
            case 12:
              currBtn = "up";
              break;
            case 13:
              currBtn = "down";
              break;
            case 14:
              currBtn = "left";
              break;
            case 15:
              currBtn = "right";
              break;
            // case 10:
            //   currBtn = "左摇杆";
            //   break;
            // case 11:
            //   currBtn = "右摇杆";
            //   break;
            default:
              break;
          }
        }
      }
      if (this.buttons == currBtn) return;
      let val = 0;
      let btn = "";
      if (currBtn == "" && this.buttons != "") {
        val = 0;
        btn = this.buttons;
      } else {
        val = 1;
        btn = currBtn;
      }
      this.buttons = currBtn;
      let joystickData = {
        commands: [
          {
            name: btn,
            parameters: [
              {
                key: "pressed",
                value: val,
              },
            ],
          },
        ],
      };
      // this.joystickData.commands.forEach((command) => {
      //   if (command.name === currBtn) {
      //     command.parameters.forEach((param) => {
      //       if (param.key === "pressed") {
      //         param.value = param.value == 0 ? 1 : 0;
      //       }
      //     });
      //   }
      // });
      console.log(
        joystickData.commands[0].name,
        joystickData.commands[0].parameters[0].value
      );
      this.$http
        .request({
          baseURL: process.env.VUE_APP_URL.slice(0, -4) + "9000",
          method: "POST",
          url: "/flow/joystickTrigger",
          data: joystickData,
        })
        .then((response) => {
          console.log("success---joystickTrigger", response);
        })
        .catch((error) => {
          console.log("error---joystickTrigger", error);
        });
    },
    testApi() {
      let result = this.joystickData.commands.filter((command) => {
        return command.parameters.some((param) => param.value === 1);
      });

      console.log(result[0].name);
      // this.$http
      //   .request({
      //     baseURL: "https://builder.fftai.dev",
      //     method: "GET",
      //     url: "/api/flow/published",
      //   })
      //   .then((response) => {
      //     console.log("success---published", response);
      //   })
      //   .catch((error) => {
      //     console.log("error---published", error);
      //   });
    },
    startUp(e) {
      this.$http
        .request({
          baseURL: process.env.VUE_APP_URL.slice(0, -4) + "9000",
          method: "POST",
          url: "/robot/" + e.apiName,
        })
        .then((response) => {
          console.log("success---startUp", response);
          this.tableData = this.tableData.map((obj) => {
            if (obj.id == e.id) {
              obj.isStarting = true;
              return { ...obj, instanceId: response.data.id };
            }
            return obj;
          });
          this.$message({
            message: "启动成功！" + response,
            type: "success",
          });
        })
        .catch((error) => {
          console.log("error---startUp", error);
          this.$message.error("启动失败！" + error);
        });
    },
    handleDelete(e) {
      this.$http
        .request({
          baseURL: process.env.VUE_APP_URL.slice(0, -4) + "9000",
          method: "POST",
          url: "/flow/" + e.id + "/instances/" + e.instanceId + "/abort",
        })
        .then((response) => {
          console.log("success---abort", response);
          this.tableData = this.tableData.map((obj) => {
            if (obj.id == e.id) {
              obj.isStarting = false;
            }
            return obj;
          });
          this.$message({
            message: "终止成功！" + response,
            type: "success",
          });
        })
        .catch((error) => {
          console.log("error---abort", error);
          this.$message.error("终止失败！" + error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.video-container {
  display: flex;
  justify-content: center;
}
.stopControl {
  position: absolute;
  right: 4vw;
  top: 10vw;
  z-index: 9999;
}
.joystickGet {
  position: absolute;
  right: 4vw;
  bottom: 7vw;
  z-index: 9999;
}
.programTable {
  position: absolute;
  bottom: 2.5vw;
  left: 3.125vw;
  width: 88.9167vw;
  height: 33.0833vw;
  padding: 2.4167vw 2.4167vw 0 2.4167vw;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 0 0 0.2604vw 0.2604vw;
  overflow: scroll;
}
.tableItem {
  height: 3.125vw;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.0417vw;
}

.tableItem:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.04);
}

.titleBg {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.titleChild {
  flex: 1;
  font-size: $size-30;
  margin-left: 1.25vw;
  font-size: 1.25vw;
  color: #ffffff;
  text-align: center;
}

.itemChild2 {
  flex: 2;
  margin-left: 3.125vw;
}
.itemChild3 {
  flex: 3;
}
.itemChild1 {
  flex: 1;
}

.itemTxt {
  color: $white;
}

.currentItem {
  background-color: $base-bkg !important;
}
.startBtn {
  width: 1.0417vw;
  height: 1.0417vw;
}
</style>
  
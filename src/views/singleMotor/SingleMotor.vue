<template>
  <div class="mainBox black-bkg flex-center">
    <div class="flex-center">
      <el-button type="success" class="motorBtn" @click="enableMotor()">
        电机使能
      </el-button>
      <el-button type="danger" class="motorBtn" @click="disableMotor()">
        电机失能
      </el-button>
      <el-button type="success" class="motorBtn" @click="enableHand()">
        手臂使能
      </el-button>
      <el-button type="danger" class="motorBtn" @click="disableHand()">
        手臂失能
      </el-button>
    </div>
    <div class="flex-center">
      <el-button type="primary" class="motorBtn" @click="getMotorLimitList()">
        获取线位
      </el-button>
      <el-button type="primary" class="motorBtn" @click="getMotorPvc()">
        获取电机位置(PVC)
      </el-button>
      <el-button type="primary" class="motorBtn" @click="getHandPosition()">
        获取手臂位置
      </el-button>
    </div>
    <div class="flex-center" style="gap: 1vw">
      <el-button type="warning" class="motorBtn" @click="moveMotor()">
        开始移动
      </el-button>
      <el-input class="motorInput" v-model="no" placeholder="no"></el-input>
      <el-input
        class="motorInput"
        v-model="orientation"
        placeholder="orientation"
      ></el-input>
      <el-input
        class="motorInput"
        v-model="angle"
        placeholder="angle"
      ></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      no: "",
      orientation: "",
      angle: "",
    };
  },
  methods: {
    //电机使能
    enableMotor() {
      this.robotWs.robot.enable_motor(this.no, this.orientation);
    },
    //电机失能
    disableMotor() {
      let no = this.no;
      this.robotWs.robot.disable_motor(no > 8 ? 8 : no, this.orientation);
    },
    //手臂使能
    async enableHand() {
      try {
        let res = await this.robotWs.robot.enable_hand();
        console.log("enableHand success======", res);
      } catch (error) {
        console.log("enableHand error======", error);
      }
    },
    //手臂失能
    async disableHand() {
      try {
        let res = await this.robotWs.robot.disable_hand();
        console.log("disableHand success======", res);
      } catch (error) {
        console.log("disableHand error======", error);
      }
    },
    //获取线位
    async getMotorLimitList() {
      try {
        let res = await this.robotWs.robot.get_motor_limit_list();
        console.log("getMotorLimitList success======", res);
      } catch (error) {
        console.log("getMotorLimitList error======", error);
      }
    },
    //获取电机位置(PVC)
    async getMotorPvc() {
      try {
        let res = await this.robotWs.robot.get_motor_pvc(
          this.no,
          this.orientation
        );
        console.log("getMotorPvc success======", res);
      } catch (error) {
        console.log("getMotorPvc error======", error);
      }
    },
    //获取手臂位置
    async getHandPosition() {
      try {
        let res = await this.robotWs.robot.get_hand_position();
        console.log("getHandPosition success======", res);
      } catch (error) {
        console.log("getHandPosition error======", error);
      }
    },
    //开始移动
    moveMotor() {
        this.robotWs.robot.move_motor(this.no, this.orientation, parseInt(this.angle));
    },
  },
};
</script>

<style lang="scss" >
.mainBox {
  flex-direction: column;
  gap: 2.0833vw;
}
.motorBtn {
  width: auto;
  height: 6.25vw;
  font-size: 1.9167vw;
  border-radius: 0.5vw;
}
.motorInput {
  font-size: 1.9167vw;
}
.el-input__inner {
  height: 6.25vw;
  line-height: 6.25vw;
}
</style>
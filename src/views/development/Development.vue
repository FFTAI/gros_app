<template>
  <div class="container">
    <rtc-header>
      <div class="headState" @click="headChange()">
        <span class="headTxt">{{ $t("developerMode") }}</span>
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
    <div class="mainBox">
      <div class="leftBox">
        <img class="humanModel" src="@/assets/images/icon_model.png" v-show="activated == 'dynamic'" />
        <!-- <div class="humanModel" v-show="activated == 'dynamic'"></div> -->
        <div class="logBox" v-show="activated == 'log'">
          <div class="logTitle">{{ $t("logoFile") }}</div>
          <div class="logMain">
            <el-timeline>
              <el-timeline-item v-for="(activity, index) in logList" :key="index" :type="activity.type"
                :timestamp="activity.timestamp" :placement="activity.placement">
                <p class="logTxt">{{ activity.content }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="modelChose">
          <div class="modelBtn" :class="{ 'activatedModel': activated == 'dynamic' }" @click="changeModel('dynamic')">
            <span class="btnTxt">{{ $t("dynamicShowcase") }}</span>
          </div>
          <div class="modelBtn" :class="{ 'activatedModel': activated == 'log' }" style="margin-left: .8854vw;"
            @click="changeModel('log')">
            <span class="btnTxt">{{ $t("logoFile") }}</span>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="rightTitle logTitle">
          <span>{{ $t("leftSide") }}</span>
          <span>{{ $t("rightSide") }}</span>
        </div>
        <div class="sideChart">
          <div class="chartSize" style="height: 14vw;" id="leftChart"></div>
          <div class="typeBox">
            <img class="typeImg" @click="changeType('angle')" src="@/assets/images/icon_angle.png" />
            <img class="typeImg" @click="changeType('Avelocity')" src="@/assets/images/icon_Avelocity.png" />
            <img class="typeImg" @click="changeType('torque')" src="@/assets/images/icon_torque.png" />
          </div>
          <div class="chartSize" style="height: 14vw;" id="rightChart"></div>
        </div>
        <div class="rightTable">
          <div class="tableItem" @click="changeItem('hipPitch')">
            <div v-if="activatedType == 'angle'" class="itemChild">{{ leftHipPitch_qa ? leftHipPitch_qa + "°" :
              ""
            }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftHipPitch_qdota ?
              leftHipPitch_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftHipPitch_taua ?
              leftHipPitch_taua
              + "N.m" : "" }}
            </div>
            <div class="itemChild" :class="activatedItem == 'hipPitch' ? 'middleCurr' : 'middle'">Hip Pitch
              <div class="downArrow" v-if="activatedItem == 'hipPitch'"></div>
            </div>
            <div v-if="activatedType == 'angle'" class="itemChild">{{ rightHipPitch_qa ? rightHipPitch_qa + "°"
              :
              "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightHipPitch_qdota ?
              rightHipPitch_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightHipPitch_taua ?
              rightHipPitch_taua + "N.m" : "" }}
            </div>
          </div>
          <div class="tableItem" @click="changeItem('hipYaw')">
            <div v-if="activatedType == 'angle'" class="itemChild">{{ leftHipYaw_qa ? leftHipYaw_qa + "°" : ""
            }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftHipYaw_qdota ?
              leftHipYaw_qdota
              + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftHipYaw_taua ? leftHipYaw_taua +
              "N.m" : "" }}
            </div>
            <div class="itemChild" :class="activatedItem == 'hipYaw' ? 'middleCurr' : 'middle'">Hip Yaw
              <div class="downArrow" v-if="activatedItem == 'hipYaw'">
              </div>
            </div>
            <div v-if="activatedType == 'angle'" class="itemChild">{{ rightHipYaw_qa ? rightHipYaw_qa + "°" : ""
            }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightHipYaw_qdota ?
              rightHipYaw_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightHipYaw_taua ? rightHipYaw_taua
              +
              "N.m" : "" }}
            </div>
          </div>
          <div class="tableItem" @click="changeItem('hipRoll')">
            <div v-if="activatedType == 'angle'" class="itemChild">{{ leftHipRoll_qa ? leftHipRoll_qa + "°" : ""
            }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftHipRoll_qdota ?
              leftHipRoll_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftHipRoll_taua ? leftHipRoll_taua
              +
              "N.m" : "" }}
            </div>
            <div class="itemChild" :class="activatedItem == 'hipRoll' ? 'middleCurr' : 'middle'">Hip Roll
              <div class="downArrow" v-if="activatedItem == 'hipRoll'">
              </div>
            </div>
            <div v-if="activatedType == 'angle'" class="itemChild">{{ rightHipRoll_qa ? rightHipRoll_qa + "°" :
              ""
            }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightHipRoll_qdota ?
              rightHipRoll_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightHipRoll_taua ?
              rightHipRoll_taua
              + "N.m" : "" }}
            </div>
          </div>
          <div class="tableItem" @click="changeItem('knee')">
            <div v-if="activatedType == 'angle'" class="itemChild">{{ leftKnee_qa ? leftKnee_qa + "°" : "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftKnee_qdota ? leftKnee_qdota +
              "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftKnee_taua ? leftKnee_taua +
              "N.m"
              : "" }}
            </div>
            <div class="itemChild" :class="activatedItem == 'knee' ? 'middleCurr' : 'middle'">Knee
              <div class="downArrow" v-if="activatedItem == 'knee'"></div>
            </div>
            <div v-if="activatedType == 'angle'" class="itemChild">{{ rightKnee_qa ? rightKnee_qa + "°" : "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightKnee_qdota ? rightKnee_qdota
              +
              "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightKnee_taua ? rightKnee_taua +
              "N.m" : "" }}
            </div>
          </div>
          <div class="tableItem" @click="changeItem('anklePitch')">
            <div v-if="activatedType == 'angle'" class="itemChild">{{ leftAnklePitch_qa ? leftAnklePitch_qa +
              "°"
              : "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftAnklePitch_qdota ?
              leftAnklePitch_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftAnklePitch_taua ?
              leftAnklePitch_taua + "N.m" : "" }}
            </div>
            <div class="itemChild" :class="activatedItem == 'anklePitch' ? 'middleCurr' : 'middle'">Ankle Pitch
              <div class="downArrow" v-if="activatedItem == 'anklePitch'"></div>
            </div>
            <div v-if="activatedType == 'angle'" class="itemChild">{{ rightAnklePitch_qa ? rightAnklePitch_qa +
              "°" : "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightAnklePitch_qdota ?
              rightAnklePitch_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightAnklePitch_taua ?
              rightAnklePitch_taua + "N.m" : "" }}
            </div>
          </div>
          <div class="tableItem" @click="changeItem('ankleRoll')">
            <div v-if="activatedType == 'angle'" class="itemChild">{{ leftAnkleRoll_qa ? leftAnkleRoll_qa + "°"
              :
              "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftAnkleRoll_qdota ?
              leftAnkleRoll_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftAnkleRoll_taua ?
              leftAnkleRoll_taua + "N.m" : "" }}
            </div>
            <div class="itemChild" :class="activatedItem == 'ankleRoll' ? 'middleCurr' : 'middle'">Ankle Roll
              <div class="downArrow" v-if="activatedItem == 'ankleRoll'"></div>
            </div>
            <div v-if="activatedType == 'angle'" class="itemChild">{{ rightAnkleRoll_qa ? rightAnkleRoll_qa +
              "°"
              : "" }}
            </div>
            <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightAnkleRoll_qdota ?
              rightAnkleRoll_qdota + "°/s" : "" }}
            </div>
            <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightAnkleRoll_taua ?
              rightAnkleRoll_taua + "N.m" : "" }}
            </div>
          </div>
        </div>
        <div class="speedChart">
          <div class="xChart">
            <div class="chatItem" style="flex: 1;">
              <div>{{ $t("xSpeed") }}</div>
              <div>{{ xSpeed }}m/s</div>
            </div>
            <div class="chatItem" style="flex: 2;">
              <div class="sChartSize" style="height: 13vw;" id="xChart"></div>
            </div>
          </div>
          <div class="yChart">
            <div class="chatItem" style="flex: 1;">
              <div>{{ $t("ySpeed") }}</div>
              <div>{{ ySpeed }}m/s</div>
            </div>
            <div class="chatItem" style="flex: 2;">
              <div class="sChartSize" style="height: 13vw;" id="yChart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import * as echarts from "echarts";

export default {
  components: { rtcHeader },
  data() {
    return {
      activated: "dynamic",
      logList: [],
      //qa:弧度 qdota:弧度/秒 taua:力矩(牛.米)
      leftHipPitch_qa: "",
      leftHipPitch_qdota: "",
      leftHipPitch_taua: "",
      leftHipYaw_qa: "",
      leftHipYaw_qdota: "",
      leftHipYaw_taua: "",
      leftHipRoll_qa: "",
      leftHipRoll_qdota: "",
      leftHipRoll_taua: "",
      leftKnee_qa: "",
      leftKnee_qdota: "",
      leftKnee_taua: "",
      leftAnklePitch_qa: "",
      leftAnklePitch_qdota: "",
      leftAnklePitch_taua: "",
      leftAnkleRoll_qa: "",
      leftAnkleRoll_qdota: "",
      leftAnkleRoll_taua: "",
      rightHipPitch_qa: "",
      rightHipPitch_qdota: "",
      rightHipPitch_taua: "",
      rightHipYaw_qa: "",
      rightHipYaw_qdota: "",
      rightHipYaw_taua: "",
      rightHipRoll_qa: "",
      rightHipRoll_qdota: "",
      rightHipRoll_taua: "",
      rightKnee_qa: "",
      rightKnee_qdota: "",
      rightKnee_taua: "",
      rightAnklePitch_qa: "",
      rightAnklePitch_qdota: "",
      rightAnklePitch_taua: "",
      rightAnkleRoll_qa: "",
      rightAnkleRoll_qdota: "",
      rightAnkleRoll_taua: "",
      xSpeed: "",
      ySpeed: "",
      leftSideChartData: [],
      rightSideChartData: [],
      leftSpeedChartData: [],
      rightSpeedChartData: [],
      activatedItem: "hipPitch",
      activatedType: "angle",
      headBoxVisible: false
    };
  },
  created() {
    if (window.vuplex) {
      window.vuplex.postMessage({ type: "robot", message: "on" });
    }
  },
  beforeDestroy() {
    this.$robot.disable_debug_state()
    this.$robot.removeAllListeners()
  },
  mounted() {
    this.initSideCharts();
    this.initSpeedCharts();
    this.$robot.enable_debug_state(1);

    this.$robot.on_message(data => {
      let currData = JSON.parse(data.data);
      console.log("on_message===============", currData);
      this.assignData(JSON.parse(data.data).data.states);
      if (currData.data.log && currData.data.log.logBuffer)
        this.getLog(currData.data.log.logBuffer);
      this.updateSideCharts(this.activatedItem, this.activatedType);
      this.updateSpeedCharts();
    });
  },
  watch: {
    activatedItem(newVal, oldVal) {
      this.updateSideCharts(newVal, this.activatedType);
    },
    activatedType(newVal, oldVal) {
      this.updateSideCharts(this.activatedItem, newVal);
    }
  },
  methods: {
    changeModel(e) {
      this.activated = e;
      if (window.vuplex) {
        if (e == "dynamic") {
          window.vuplex.postMessage({ type: "robot", message: "on" });
        } else if (e == "log") {
          window.vuplex.postMessage({ type: "robot", message: "off" });
        }
      }
    },
    initSideCharts() {
      var leftChart = echarts.init(document.getElementById("leftChart"));
      var rightChart = echarts.init(document.getElementById("rightChart"));
      leftChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            name: "angle",
            data: this.leftSideChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              color: '#ffffff'
            },
            smooth: true
          }
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 10,
            end: 100,
            xAxisIndex: [0],
            filterMode: 'none'
          }
        ]
      });
      rightChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            name: "angle",
            data: this.rightSideChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              color: '#ffffff'
            },
            smooth: true
          }
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 10,
            end: 100,
            xAxisIndex: [0],
            filterMode: 'none'
          }
        ]
      });
    },
    initSpeedCharts() {
      var xChart = echarts.init(document.getElementById("xChart"));
      var yChart = echarts.init(document.getElementById("yChart"));
      xChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            name: "speed",
            data: this.leftSpeedChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              color: '#ffffff'
            },
            smooth: true
          }
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 10,
            end: 100,
            xAxisIndex: [0],
            filterMode: 'none'
          }
        ]
      });
      yChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            name: "speed",
            data: this.rightSpeedChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              color: '#ffffff'
            },
            smooth: true
          }
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 10,
            end: 100,
            xAxisIndex: [0],
            filterMode: 'none'
          }
        ]
      });
    },
    assignData(data) {
      this.leftHipPitch_qa = this.toDegrees(data.jointStates[2].qa);
      this.leftHipPitch_qdota = this.toDegrees(data.jointStates[2].qdota);
      this.leftHipPitch_taua = data.jointStates[2].taua.toFixed(2);
      this.leftHipYaw_qa = this.toDegrees(data.jointStates[1].qa);
      this.leftHipYaw_qdota = this.toDegrees(data.jointStates[1].qdota);
      this.leftHipYaw_taua = data.jointStates[1].taua.toFixed(2);
      this.leftHipRoll_qa = this.toDegrees(data.jointStates[0].qa);
      this.leftHipRoll_qdota = this.toDegrees(data.jointStates[0].qdota);
      this.leftHipRoll_taua = data.jointStates[0].taua.toFixed(2);
      this.leftKnee_qa = this.toDegrees(data.jointStates[3].qa);
      this.leftKnee_qdota = this.toDegrees(data.jointStates[3].qdota);
      this.leftKnee_taua = data.jointStates[3].taua.toFixed(2);
      this.leftAnklePitch_qa = this.toDegrees(data.jointStates[4].qa);
      this.leftAnklePitch_qdota = this.toDegrees(data.jointStates[4].qdota);
      this.leftAnklePitch_taua = data.jointStates[4].taua.toFixed(2);
      this.leftAnkleRoll_qa = this.toDegrees(data.jointStates[5].qa);
      this.leftAnkleRoll_qdota = this.toDegrees(data.jointStates[5].qdota);
      this.leftAnkleRoll_taua = data.jointStates[5].taua.toFixed(2);
      this.rightHipPitch_qa = this.toDegrees(data.jointStates[8].qa);
      this.rightHipPitch_qdota = this.toDegrees(data.jointStates[8].qdota);
      this.rightHipPitch_taua = data.jointStates[8].taua.toFixed(2);
      this.rightHipYaw_qa = this.toDegrees(data.jointStates[7].qa);
      this.rightHipYaw_qdota = this.toDegrees(data.jointStates[7].qdota);
      this.rightHipYaw_taua = data.jointStates[7].taua.toFixed(2);
      this.rightHipRoll_qa = this.toDegrees(data.jointStates[6].qa);
      this.rightHipRoll_qdota = this.toDegrees(data.jointStates[6].qdota);
      this.rightHipRoll_taua = data.jointStates[6].taua.toFixed(2);
      this.rightKnee_qa = this.toDegrees(data.jointStates[9].qa);
      this.rightKnee_qdota = this.toDegrees(data.jointStates[9].qdota);
      this.rightKnee_taua = data.jointStates[9].taua.toFixed(2);
      this.rightAnklePitch_qa = this.toDegrees(data.jointStates[10].qa);
      this.rightAnklePitch_qdota = this.toDegrees(data.jointStates[10].qdota);
      this.rightAnklePitch_taua = data.jointStates[10].taua.toFixed(2);
      this.rightAnkleRoll_qa = this.toDegrees(data.jointStates[11].qa);
      this.rightAnkleRoll_qdota = this.toDegrees(data.jointStates[11].qdota);
      this.rightAnkleRoll_taua = data.jointStates[11].taua.toFixed(2);
      this.xSpeed = data.basestate.vx.toFixed(2);
      this.ySpeed = data.basestate.vy.toFixed(2);
    },
    getLog(data) {
      data.forEach(element => {
        let item = {};
        item.content = element.log;
        item.placement = "top";
        item.timestamp = this.dateFormart();
        this.logList.unshift(item);
      });
    },
    dateFormart() {
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var formattedDate = year + "/" + month + "/" + day + " " + hours + ":" + minutes;
      return formattedDate;
    },
    toDegrees(e) {
      var degrees = e * (180 / Math.PI);
      return degrees.toFixed(2);
    },
    updateSideCharts(item, type) {
      if (!document.getElementById("leftChart") || !document.getElementById("rightChart"))
        return
      if (this.leftSideChartData.length > 10)
        this.leftSideChartData.shift();
      if (this.rightSideChartData.length > 10)
        this.rightSideChartData.shift();
      switch (item) {
        case "hipPitch":
          if (type == "angle") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipPitch_qa))
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipPitch_qa));
          } else if (type == "Avelocity") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipPitch_qdota));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipPitch_qdota));
          } else if (type == "torque") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipPitch_taua));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipPitch_taua));
          }
          break;
        case "hipYaw":
          if (type == "angle") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipYaw_qa));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipYaw_qa));
          } else if (type == "Avelocity") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipYaw_qdota));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipYaw_qdota));
          } else if (type == "torque") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipYaw_taua));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipYaw_taua));
          }
          break;
        case "hipRoll":
          if (type == "angle") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipRoll_qa));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipRoll_qa));
          } else if (type == "Avelocity") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipRoll_qdota));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipRoll_qdota));
          } else if (type == "torque") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftHipRoll_taua));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightHipRoll_taua));
          }
          break;
        case "knee":
          if (type == "angle") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftKnee_qa));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightKnee_qa));
          } else if (type == "Avelocity") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftKnee_qdota));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightKnee_qdota));
          } else if (type == "torque") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftKnee_taua));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightKnee_taua));
          }
          break;
        case "anklePitch":
          if (type == "angle") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftAnklePitch_qa));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightAnklePitch_qa));
          } else if (type == "Avelocity") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftAnklePitch_qdota));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightAnklePitch_qdota));
          } else if (type == "torque") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftAnklePitch_taua));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightAnklePitch_taua));
          }
          break;
        case "ankleRoll":
          if (type == "angle") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_qa));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_qa));
          } else if (type == "Avelocity") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_qdota));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_qdota));
          } else if (type == "torque") {
            this.leftSideChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_taua));
            this.rightSideChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_taua));
          }
          break;
        default:
          break;
      }
      let leftChart = echarts.getInstanceByDom(document.getElementById("leftChart"));
      leftChart.setOption({
        series: [
          {
            name: type,
            data: this.leftSideChartData
          }
        ]
      });
      let rightChart = echarts.getInstanceByDom(document.getElementById("rightChart"));
      rightChart.setOption({
        series: [
          {
            name: type,
            data: this.rightSideChartData
          }
        ]
      });
    },
    updateSpeedCharts() {
      let xChart = echarts.getInstanceByDom(document.getElementById("xChart"));
      if (this.leftSpeedChartData.length > 10)
        this.leftSpeedChartData.shift();
      this.leftSpeedChartData.push(this.xAxisDataFmt(this.xSpeed));
      xChart.setOption({
        series: [
          {
            name: "speed",
            data: this.leftSpeedChartData
          }
        ]
      });
      let yChart = echarts.getInstanceByDom(document.getElementById("yChart"));
      if (this.rightSpeedChartData.length > 10)
        this.rightSpeedChartData.shift();
      this.rightSpeedChartData.push(this.xAxisDataFmt(this.ySpeed));
      yChart.setOption({
        series: [
          {
            name: "speed",
            data: this.rightSpeedChartData
          }
        ]
      });
    },
    xAxisDataFmt(e) {
      return {
        name: +new Date(),
        value: [
          +new Date(),
          e
        ]
      }
    },
    changeItem(e) {
      this.activatedItem = e;
      this.leftSideChartData = [];
      this.rightSideChartData = [];
    },
    changeType(e) {
      this.activatedType = e;
      this.leftSideChartData = [];
      this.rightSideChartData = [];
    },
    headChange() {
      this.headBoxVisible = !this.headBoxVisible;
    },
    changeMode(e) {
      if (e == "remoteMode") {
        this.$router.push({
          name: "controller"
        });
      } else if (e == "developerMode") {
        this.headBoxVisible = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background: #121E29;
  position: relative;
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
    top: 2vh;
    left: 11.2375vw;
    width: 0;
    height: 0;
    background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
    border-left: .4167vw solid transparent;
    border-right: .4167vw solid transparent;
    border-top: .5208vw solid #FFFFFF;
  }
}

.mainBox {
  position: absolute;
  display: flex;
  top: 11vh;
  left: 2.4479vw;
  height: 86vh;
  width: 95.1042vw;

  .logTitle {
    font-size: 1.6146vw;
    font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #FFFFFF;
  }

  .leftBox {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .humanModel {
      margin-top: 1.875vw;
      width: 22.625vw;
      height: 62vh;
    }

    .logBox {
      height: 70vh;
      width: 34.8vw;
      padding: 1.0417vw 1.5625vw 0 1.5625vw;
      box-shadow: 0 .1042vw .2083vw 0 rgba(41, 72, 152, 0.01), 0 .4688vw .4167vw 0 rgba(41, 72, 152, 0.02);
      border-radius: .2604vw;
      background-color: rgba(81, 82, 85, 0.1);
      overflow-y: auto;

      .logMain {
        margin-top: 1.0417vw;

        .logTxt {
          font-size: 1.25vw;
          font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
          font-weight: normal;
          color: #FFFFFF;
        }

        .txtErr {
          color: #DC4253;
        }
      }
    }

    .logBox::-webkit-scrollbar {
      width: .4688vw;
    }

    .logBox::-webkit-scrollbar-track {
      background-color: rgba(81, 82, 85, 0.1);
    }

    .logBox::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: .1042vw;
    }

    .logBox::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    .modelChose {
      height: 4.5021vw;
      width: 23.0729vw;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .modelBtn {
        flex: 1;
        width: 11.0938vw;
        height: 3.6979vw;
        display: flex;
        justify-content: center;
        align-items: center;

        .btnTxt {
          font-size: 1.4583vw;
          font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
          font-weight: normal;
          color: #FFFFFF;
          opacity: 1;
          line-height: 2.0313vw;
        }
      }

      .activatedModel {
        border-radius: 1.8229vw;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .rightBox {
    flex: 3;
    width: 56.3021vw;
    height: 85vh;

    .rightTitle {
      // height: 6vh;
      width: 91%;
      display: flex;
      justify-content: space-between;
      margin-left: 1.5625vw;
      padding: 1.0417vw 2.6042vw 0 2.6042vw;
      background-color: rgba(81, 82, 85, 0.1);
    }

    .sideChart {
      width: 100%;
      height: 23vh;
      background-color: rgba(81, 82, 85, 0.1);
      margin-left: 1.5625vw;
      display: flex;
      justify-content: space-between;

      .chartSize {
        width: 26.0417vw;
        height: 18vh;
      }

      .typeBox {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 2.6042vw;

        .typeImg {
          width: 1.4583vw;
          height: 1.4583vw;
        }
      }

    }

    .rightTable {
      width: 100%;
      height: 35vh;
      background-color: rgba(81, 82, 85, 0.1);
      margin-left: 1.5625vw;

      .tableItem {
        height: 16.67%;
        width: 100%;
        display: flex;
        align-items: center;

        .itemChild {
          color: #FFFFFF;
          flex: 3;
          font-size: 1.25vw;
          text-align: center;
        }

        .middleCurr {
          flex: 1;
          background-color: #0075B8;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .middle {
          flex: 1;
          color: #85888b;
        }

        .downArrow {
          margin-left: .2604vw;
          width: 0;
          height: 0;
          background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
          border-left: .3125vw solid transparent;
          border-right: .3125vw solid transparent;
          border-bottom: .5208vw solid #FFFFFF;
        }
      }

      .tableItem:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .speedChart {
      width: 100%;
      height: 20vh;
      margin: 1.5625vw 0 0 1.5625vw;
      display: flex;
      justify-content: space-between;
      align-content: center;

      .sChartSize {
        width: 20vw;
        height: 18vh;
      }

      .xChart {
        width: 49%;
        background-color: rgba(81, 82, 85, 0.1);
        display: flex;
      }

      .yChart {
        width: 49%;
        background-color: rgba(81, 82, 85, 0.1);
        display: flex;
      }

      .chatItem {
        display: flex;
        justify-content: space-evenly;
        align-content: center;
        flex-direction: column;
        margin-left: 1.25vw;
        color: #FFFFFF;
        font-size: 1.25vw;
      }
    }
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
</style>
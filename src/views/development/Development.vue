<template>
  <div class="container">
    <rtc-header>
      <div class="headState" @click="headChange()">
        <span class="headTxt">{{ $t("developerMode") }}</span>
        <div class="arrow"></div>
      </div>
    </rtc-header>
    <!-- 模式切换 -->
    <div class="headBox" v-if="headBoxVisible" ref="headBoxRef">
      <div @click="changeMode('remoteMode')">
        {{ $t("remoteMode") }}
      </div>
      <div class="divider"></div>
      <div @click="changeMode('developerMode')">
        {{ $t("developerMode") }}
      </div>
    </div>
    <!-- 左侧栏 -->
    <div class="leftBox">
      <!-- 人形模型 -->
      <!-- <img class="humanModel" src="@/assets/images/icon_model.png" v-show="activated == 'dynamic'" /> -->
      <!-- <iframe ref="unityIfm" src="WebGL/index.html"
          style="border: none;width: 26.0417vw;height: 36.4583vw;margin-top:6.25vw;"
          v-show="activated == 'dynamic'"></iframe> -->
      <div class="humanModel" v-show="activated == 'dynamic'">
        <iframe ref="unityIfm" style="border: none;margin-top: 3.125vw;width: 26.0417vw;height: 36.4583vw;"
          :src="iframeUrl"></iframe>
      </div>
      <!-- log日志 -->
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
      <!-- 底部切换 -->
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
    <div class="chartBox">
      <div class="leftSide">
        <div class="chartSize" style="height: 12vw;" id="leftChartLower"></div>
        <div class="chartSize" style="height: 12vw;" id="rightChartLower"></div>
      </div>
      <div class="middleDivider"></div>
      <div class="rightSide">

      </div>
    </div>
    <!-- 头部上肢 -->
    <div class="rightBox upper">
      <div class="rightTitle">
        <div>{{ $t("head") }}</div>
        <!-- 切换: 度,度/秒，扭矩(牛.米) -->
        <div>
          <img class="typeImg" :class="{ 'notAct': activatedType != 'angle' }" @click="changeType('angle')"
            src="@/assets/images/icon_angle.png" />
          <img class="typeImg" :class="{ 'notAct': activatedType != 'Avelocity' }"
            @click="changeType('Avelocity')" src="@/assets/images/icon_Avelocity.png" />
          <img class="typeImg" :class="{ 'notAct': activatedType != 'torque' }" @click="changeType('torque')"
            src="@/assets/images/icon_torque.png" />
        </div>
      </div>
      <!-- 左右侧图表 -->
      <div class="sideChart">
        <!-- Head Yaw -->
        <div class="tableItem" @click="changeItem('headYaw')">
          <div class="itemChild" :class="activatedItem == 'headYaw' ? 'middleCurr' : 'middle'">{{
            $t('headYaw') }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ headYaw_qa ? headYaw_qa + "°"
            :
            ""
          }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ headYaw_qdota ?
            headYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ headYaw_taua ?
            headYaw_taua
            + "N.m" : "" }}
          </div>
          <div class="itemChild">
          </div>
        </div>
      </div>
      <!-- 数值切换显示Table -->
      <div class="rightTable">
        <!-- Shoulder Pitch -->
        <div class="tableItem" @click="changeItem('shoulderPitch')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftPitchShoulder_qa ? leftPitchShoulder_qa + "°"
            :
            ""
          }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftPitchShoulder_qdota ?
            leftPitchShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftPitchShoulder_taua ?
            leftPitchShoulder_taua
            + "N.m" : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'shoulderPitch' ? 'middleCurr' : 'middle'">{{
            $t('shoulderPitch') }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightPitchShoulder_qa ? rightPitchShoulder_qa +
            "°"
            :
            "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightPitchShoulder_qdota ?
            rightPitchShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightPitchShoulder_taua ?
            rightPitchShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Shoulder Yaw -->
        <div class="tableItem" @click="changeItem('shoulderYaw')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftYawShoulder_qa ? leftYawShoulder_qa + "°" :
            ""
          }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftYawShoulder_qdota ?
            leftYawShoulder_qdota
            + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftYawShoulder_taua ? leftYawShoulder_taua
            +
            "N.m" : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'shoulderYaw' ? 'middleCurr' : 'middle'">{{
            $t('shoulderYaw') }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightYawShoulder_qa ? rightYawShoulder_qa + "°" :
            ""
          }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightYawShoulder_qdota ?
            rightYawShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightYawShoulder_taua ?
            rightYawShoulder_taua
            +
            "N.m" : "" }}
          </div>
        </div>
        <!-- Shoulder Roll -->
        <div class="tableItem" @click="changeItem('shoulderRoll')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftRollShoulder_qa ? leftRollShoulder_qa + "°" :
            ""
          }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftRollShoulder_qdota ?
            leftRollShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftRollShoulder_taua ?
            leftRollShoulder_taua
            +
            "N.m" : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'shoulderRoll' ? 'middleCurr' : 'middle'">{{
            $t('shoulderRoll') }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightRollShoulder_qa ? rightRollShoulder_qa + "°"
            :
            ""
          }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightRollShoulder_qdota ?
            rightRollShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightRollShoulder_taua ?
            rightRollShoulder_taua
            + "N.m" : "" }}
          </div>
        </div>
        <!-- Elbow -->
        <div class="tableItem" @click="changeItem('elbow')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftElbow_qa ? leftElbow_qa + "°" : "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftElbow_qdota ? leftElbow_qdota +
            "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftElbow_taua ? leftElbow_taua +
            "N.m"
            : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'elbow' ? 'middleCurr' : 'middle'">{{ $t('elbow') }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightElbow_qa ? rightElbow_qa + "°" : "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightElbow_qdota ? rightElbow_qdota
            +
            "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightElbow_taua ? rightElbow_taua +
            "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Pitch -->
        <div class="tableItem" @click="changeItem('wristPitch')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftPitchWrist_qa ? leftPitchWrist_qa +
            "°"
            : "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftPitchWrist_qdota ?
            leftPitchWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftPitchWrist_taua ?
            leftPitchWrist_taua + "N.m" : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'wristPitch' ? 'middleCurr' : 'middle'">{{ $t('wristPitch')
          }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightPitchWrist_qa ? rightPitchWrist_qa +
            "°" : "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightPitchWrist_qdota ?
            rightPitchWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightPitchWrist_taua ?
            rightPitchWrist_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Yaw -->
        <div class="tableItem" @click="changeItem('wristYaw')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftYawWrist_qa ? leftYawWrist_qa + "°"
            :
            "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftYawWrist_qdota ?
            leftYawWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftYawWrist_taua ?
            leftYawWrist_taua + "N.m" : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'wristYaw' ? 'middleCurr' : 'middle'">{{ $t('wristYaw') }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightYawWrist_qa ? rightYawWrist_qa +
            "°"
            : "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightYawWrist_qdota ?
            rightYawWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightYawWrist_taua ?
            rightYawWrist_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Roll -->
        <div class="tableItem" @click="changeItem('wristRoll')">
          <div v-if="activatedType == 'angle'" class="itemChild">{{ leftRollWrist_qa ? leftRollWrist_qa + "°"
            :
            "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ leftRollWrist_qdota ?
            leftRollWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ leftRollWrist_taua ?
            leftRollWrist_taua + "N.m" : "" }}
          </div>
          <div class="itemChild" :class="activatedItem == 'wristRoll' ? 'middleCurr' : 'middle'">{{ $t('wristRoll')
          }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild">{{ rightRollWrist_qa ? rightRollWrist_qa +
            "°"
            : "" }}
          </div>
          <div v-else-if="activatedType == 'Avelocity'" class="itemChild">{{ rightRollWrist_qdota ?
            rightRollWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild">{{ rightRollWrist_taua ?
            rightRollWrist_taua + "N.m" : "" }}
          </div>
        </div>
      </div>
    </div>
    <!-- 下肢数据 -->
    <div class="rightBox lower">
      <div class="rightTitle">
        <div>{{ $t("waist") }}</div>
        <div>
          <img class="typeImg" :class="{ 'notAct': activatedType != 'angle' }" @click="changeType('angle')"
            src="@/assets/images/icon_angle.png" />
          <img class="typeImg" :class="{ 'notAct': activatedType != 'Avelocity' }"
            @click="changeType('Avelocity')" src="@/assets/images/icon_Avelocity.png" />
          <img class="typeImg" :class="{ 'notAct': activatedType != 'torque' }" @click="changeType('torque')"
            src="@/assets/images/icon_torque.png" />
        </div>
      </div>
      <!-- 左右侧图表 -->
      <div class="sideChart">
        <div class="chartSize" style="height: 10vw;" id="leftChartLower"></div>
        <!-- 切换: 度,度/秒，扭矩(牛.米) -->

        <div class="chartSize" style="height: 10vw;" id="rightChartLower"></div>
      </div>
      <!-- 数值切换显示Table -->
      <div class="rightTable">
        <!-- Hip Pitch -->
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
          <div class="itemChild" :class="activatedItem == 'hipPitch' ? 'middleCurr' : 'middle'">{{ $t('hipPitch') }}
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
        <!-- Hip Yaw -->
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
          <div class="itemChild" :class="activatedItem == 'hipYaw' ? 'middleCurr' : 'middle'">{{ $t('hipYaw') }}
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
        <!-- Hip Roll -->
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
          <div class="itemChild" :class="activatedItem == 'hipRoll' ? 'middleCurr' : 'middle'">{{ $t('hipRoll') }}
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
        <!-- Knee -->
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
          <div class="itemChild" :class="activatedItem == 'knee' ? 'middleCurr' : 'middle'">{{ $t('knee') }}
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
        <!-- Ankle Pitch -->
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
          <div class="itemChild" :class="activatedItem == 'anklePitch' ? 'middleCurr' : 'middle'">{{ $t('anklePitch')
          }}
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
        <!-- Ankle Roll -->
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
          <div class="itemChild" :class="activatedItem == 'ankleRoll' ? 'middleCurr' : 'middle'">{{ $t('ankleRoll')
          }}
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
        <div class="tableItem"></div>
      </div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import * as echarts from "echarts";
import { mapState } from "vuex";

export default {
  components: { rtcHeader },
  computed: {
    ...mapState(["robot"])
  },
  data() {
    return {
      activated: "log",//动态展示:dynamic Log日志:log
      logList: [],//日志列表
      /**
       * 上肢部分关节数据
       * qa:弧度 qdota:弧度/秒 taua:力矩(牛.米)
       */
      //左侧
      leftPitchShoulder_qa: "",
      leftPitchShoulder_qdota: "",
      leftPitchShoulder_taua: "",
      leftRollShoulder_qa: "",
      leftRollShoulder_qdota: "",
      leftRollShoulder_taua: "",
      leftYawShoulder_qa: "",
      leftYawShoulder_qdota: "",
      leftYawShoulder_taua: "",
      leftElbow_qa: "",
      leftElbow_qdota: "",
      leftElbow_taua: "",
      leftYawWrist_qa: "",
      leftYawWrist_qdota: "",
      leftYawWrist_taua: "",
      leftRollWrist_qa: "",
      leftRollWrist_qdota: "",
      leftRollWrist_taua: "",
      leftPitchWrist_qa: "",
      leftPitchWrist_qdota: "",
      leftPitchWrist_taua: "",
      //右侧
      rightPitchShoulder_qa: "",
      rightPitchShoulder_qdota: "",
      rightPitchShoulder_taua: "",
      rightRollShoulder_qa: "",
      rightRollShoulder_qdota: "",
      rightRollShoulder_taua: "",
      rightYawShoulder_qa: "",
      rightYawShoulder_qdota: "",
      rightYawShoulder_taua: "",
      rightElbow_qa: "",
      rightElbow_qdota: "",
      rightElbow_taua: "",
      rightYawWrist_qa: "",
      rightYawWrist_qdota: "",
      rightYawWrist_taua: "",
      rightRollWrist_qa: "",
      rightRollWrist_qdota: "",
      rightRollWrist_taua: "",
      rightPitchWrist_qa: "",
      rightPitchWrist_qdota: "",
      rightPitchWrist_taua: "",
      /**
       * 下肢部分关节数据
       * qa:弧度 qdota:弧度/秒 taua:力矩(牛.米)
       */
      //左侧
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
      //右侧
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
      /**
       * 头部数据
       */
      headYaw_qa: "",
      headYaw_qdota: "",
      headYaw_taua: "",
      headPitch_qa: "",
      headPitch_qdota: "",
      headPitch_taua: "",
      headRoll_qa: "",
      headRoll_qdota: "",
      headRoll_taua: "",
      /**
       * 腰部数据
       */
      waistYaw_qa: "",
      waistYaw_qdota: "",
      waistYaw_taua: "",
      waistPitch_qa: "",
      waistPitch_qdota: "",
      waistPitch_taua: "",
      waistRoll_qa: "",
      waistRoll_qdota: "",
      waistRoll_taua: "",
      /**
       * 速度
       */
      xSpeed: "",
      ySpeed: "",
      leftChartData: [],//上肢左侧图表数据
      rightChartData: [],//上肢右侧图表数据
      leftChartData: [],//下肢左侧图表数据
      rightChartData: [],//下肢右侧图表数据
      leftSpeedChartData: [],//X轴速度图表数据
      rightSpeedChartData: [],//Y轴速度图表数据
      activatedItem: "hipPitch",
      activatedType: "angle",
      headBoxVisible: false,
      robotCount: 1,
      iframeUrl: process.env.VUE_APP_URL.replace(process.env.VUE_APP_URL.split('//')[1].split(':')[1], '3002')
    };
  },
  created() {
    if (window.vuplex) {
      window.vuplex.postMessage({ type: "robot", message: "on" });
    }
  },
  beforeDestroy() {
    //关闭状态发送
    this.robot.disable_debug_state()
    //关闭所有监听
    this.robot.removeAllListeners()
  },
  mounted() {
    // 初始化图表
    this.initSideCharts();
    this.initSpeedCharts();
    //开启状态发送
    this.robot.enable_debug_state(50);
    //开启监听数据并处理
    this.robot.on_message(data => {
      let currData = JSON.parse(data.data);
      // if(currData.data.log)
      console.log(currData.data.log)
      // console.log("on_message===============", { 'logBuffer': currData.data.log.logBuffer });
      if (currData.data.log && currData.data.log.logBuffer)
        this.getLog(currData.data.log.logBuffer);
      // if (this.$refs.unityIfm.contentWindow.myGameInstance)
      //   this.$refs.unityIfm.contentWindow.myGameInstance.SendMessage('UnityJsCommunication', 'ReceiveMsg', JSON.stringify({ 'jointStates': currData.data.states.jointStates }))
      if (this.robotCount == 50) {
        this.assignData(JSON.parse(data.data).data.states);
        this.updateSideCharts(this.activatedItem, this.activatedType);
        this.updateSpeedCharts();
        this.robotCount = 1
      } else {
        this.robotCount = this.robotCount + 1
      }
    });
    this.robot.on_close(() => {
      console.log("Websocket已断开。。。。。。")
      this.$store.commit('setRobot')
    })
  },
  watch: {
    //监听当前渲染图表的切换
    activatedItem(newVal, oldVal) {
      this.updateSideCharts(newVal, this.activatedType);
    },
    activatedType(newVal, oldVal) {
      this.updateSideCharts(this.activatedItem, newVal);
    }
  },
  methods: {
    changeModel(e) {
      console.log('changeModel', e)
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
      var leftChart = echarts.init(document.getElementById("leftChartLower"));
      var rightChart = echarts.init(document.getElementById("rightChartLower"));
      leftChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: false
          },
          axisLine: {
            onZero: false,
            show: false
          },
          boundaryGap: true,
          axisTick: {
            length: 1,
            lineStyle: {
              type: 'dotted',
              color: '#ffffff',
              width: 2,
              cap: 'round'
            },
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            name: "angle",
            data: this.leftChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  {
                    offset: 0.2,
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  {
                    offset: 0.4,
                    color: '#ffffff'
                  },
                  {
                    offset: 0.6,
                    color: '#ffffff'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                ])
              }
            },
            smooth: true,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255,255,255,0.12)'
                },
                {
                  offset: 1,
                  color: 'rgb(0,76,129,0)'
                }
              ]),
              origin: 'start'
            }
          }
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 12,
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
          },
          axisLine: {
            onZero: false,
            show: false
          },
          axisTick: {
            length: 1,
            lineStyle: {
              type: 'dotted',
              color: '#ffffff',
              width: 2,
              cap: 'round'
            }
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            name: "angle",
            data: this.rightChartData,
            type: "line",
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 3,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  {
                    offset: 0.2,
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  {
                    offset: 0.4,
                    color: '#ffffff'
                  },
                  {
                    offset: 0.6,
                    color: '#ffffff'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                ])
              }
            },
            smooth: true,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255,255,255,0.12)'
                },
                {
                  offset: 1,
                  color: 'rgb(0,76,129,0)'
                }
              ]),
              origin: 'start'
            }
          }
        ],
        dataZoom: [
          {
            type: "inside",
            realtime: true,
            start: 12,
            end: 100,
            xAxisIndex: [0],
            filterMode: 'none'
          }
        ]
      });
    },
    initSpeedCharts() {

    },
    // 格式化当前数据
    assignData(data) {
      let states = data.jointStates
      //上肢部分
      this.leftPitchShoulder_qa = this.toDegrees(states.find(obj => obj.name === "left_pitch_shoulder").qa);
      this.leftPitchShoulder_qdota = this.toDegrees(states.find(obj => obj.name === "left_pitch_shoulder").qdota);
      this.leftPitchShoulder_taua = states.find(obj => obj.name === "left_pitch_shoulder").taua.toFixed(2);
      this.leftRollShoulder_qa = this.toDegrees(states.find(obj => obj.name === "left_roll_shoulder").qa);
      this.leftRollShoulder_qdota = this.toDegrees(states.find(obj => obj.name === "left_roll_shoulder").qdota);
      this.leftRollShoulder_taua = states.find(obj => obj.name === "left_roll_shoulder").taua.toFixed(2);
      this.leftYawShoulder_qa = this.toDegrees(states.find(obj => obj.name === "left_yaw_shoulder").qa);
      this.leftYawShoulder_qdota = this.toDegrees(states.find(obj => obj.name === "left_yaw_shoulder").qdota);
      this.leftYawShoulder_taua = states.find(obj => obj.name === "left_yaw_shoulder").taua.toFixed(2);
      this.leftElbow_qa = this.toDegrees(states.find(obj => obj.name === "left_elbow").qa);
      this.leftElbow_qdota = this.toDegrees(states.find(obj => obj.name === "left_elbow").qdota);
      this.leftElbow_taua = states.find(obj => obj.name === "left_elbow").taua.toFixed(2);
      this.leftYawWrist_qa = this.toDegrees(states.find(obj => obj.name === "left_yaw_wrist").qa);
      this.leftYawWrist_qdota = this.toDegrees(states.find(obj => obj.name === "left_yaw_wrist").qdota);
      this.leftYawWrist_taua = states.find(obj => obj.name === "left_yaw_wrist").taua.toFixed(2);
      this.leftRollWrist_qa = this.toDegrees(states.find(obj => obj.name === "left_roll_wrist").qa);
      this.leftRollWrist_qdota = this.toDegrees(states.find(obj => obj.name === "left_roll_wrist").qdota);
      this.leftRollWrist_taua = states.find(obj => obj.name === "left_roll_wrist").taua.toFixed(2);
      this.leftPitchWrist_qa = this.toDegrees(states.find(obj => obj.name === "left_pitch_wrist").qa);
      this.leftPitchWrist_qdota = this.toDegrees(states.find(obj => obj.name === "left_pitch_wrist").qdota);
      this.leftPitchWrist_taua = states.find(obj => obj.name === "left_pitch_wrist").taua.toFixed(2);
      this.rightPitchShoulder_qa = this.toDegrees(states.find(obj => obj.name === "right_pitch_shoulder").qa);
      this.rightPitchShoulder_qdota = this.toDegrees(states.find(obj => obj.name === "right_pitch_shoulder").qdota);
      this.rightPitchShoulder_taua = states.find(obj => obj.name === "right_pitch_shoulder").taua.toFixed(2);
      this.rightRollShoulder_qa = this.toDegrees(states.find(obj => obj.name === "right_roll_shoulder").qa);
      this.rightRollShoulder_qdota = this.toDegrees(states.find(obj => obj.name === "right_roll_shoulder").qdota);
      this.rightRollShoulder_taua = states.find(obj => obj.name === "right_roll_shoulder").taua.toFixed(2);
      this.rightYawShoulder_qa = this.toDegrees(states.find(obj => obj.name === "right_yaw_shoulder").qa);
      this.rightYawShoulder_qdota = this.toDegrees(states.find(obj => obj.name === "right_yaw_shoulder").qdota);
      this.rightYawShoulder_taua = states.find(obj => obj.name === "right_yaw_shoulder").taua.toFixed(2);
      this.rightElbow_qa = this.toDegrees(states.find(obj => obj.name === "right_elbow").qa);
      this.rightElbow_qdota = this.toDegrees(states.find(obj => obj.name === "right_elbow").qdota);
      this.rightElbow_taua = states.find(obj => obj.name === "right_elbow").taua.toFixed(2);
      this.rightYawWrist_qa = this.toDegrees(states.find(obj => obj.name === "right_yaw_wrist").qa);
      this.rightYawWrist_qdota = this.toDegrees(states.find(obj => obj.name === "right_yaw_wrist").qdota);
      this.rightYawWrist_taua = states.find(obj => obj.name === "right_yaw_wrist").taua.toFixed(2);
      this.rightRollWrist_qa = this.toDegrees(states.find(obj => obj.name === "right_roll_wrist").qa);
      this.rightRollWrist_qdota = this.toDegrees(states.find(obj => obj.name === "right_roll_wrist").qdota);
      this.rightRollWrist_taua = states.find(obj => obj.name === "right_roll_wrist").taua.toFixed(2);
      this.rightPitchWrist_qa = this.toDegrees(states.find(obj => obj.name === "right_pitch_wrist").qa);
      this.rightPitchWrist_qdota = this.toDegrees(states.find(obj => obj.name === "right_pitch_wrist").qdota);
      this.rightPitchWrist_taua = states.find(obj => obj.name === "right_pitch_wrist").taua.toFixed(2);
      //下肢部分
      this.leftHipPitch_qa = this.toDegrees(states.find(obj => obj.name === "left_hip_pitch").qa);
      this.leftHipPitch_qdota = this.toDegrees(states.find(obj => obj.name === "left_hip_pitch").qdota);
      this.leftHipPitch_taua = states.find(obj => obj.name === "left_hip_pitch").taua.toFixed(2);
      this.leftHipYaw_qa = this.toDegrees(states.find(obj => obj.name === "left_hip_yaw").qa);
      this.leftHipYaw_qdota = this.toDegrees(states.find(obj => obj.name === "left_hip_yaw").qdota);
      this.leftHipYaw_taua = states.find(obj => obj.name === "left_hip_yaw").taua.toFixed(2);
      this.leftHipRoll_qa = this.toDegrees(states.find(obj => obj.name === "left_hip_roll").qa);
      this.leftHipRoll_qdota = this.toDegrees(states.find(obj => obj.name === "left_hip_roll").qdota);
      this.leftHipRoll_taua = states.find(obj => obj.name === "left_hip_roll").taua.toFixed(2);
      this.leftKnee_qa = this.toDegrees(states.find(obj => obj.name === "left_knee_pitch").qa);
      this.leftKnee_qdota = this.toDegrees(states.find(obj => obj.name === "left_knee_pitch").qdota);
      this.leftKnee_taua = states.find(obj => obj.name === "left_knee_pitch").taua.toFixed(2);
      this.leftAnklePitch_qa = this.toDegrees(states.find(obj => obj.name === "left_ankle_pitch").qa);
      this.leftAnklePitch_qdota = this.toDegrees(states.find(obj => obj.name === "left_ankle_pitch").qdota);
      this.leftAnklePitch_taua = states.find(obj => obj.name === "left_ankle_pitch").taua.toFixed(2);
      this.leftAnkleRoll_qa = this.toDegrees(states.find(obj => obj.name === "left_ankle_roll").qa);
      this.leftAnkleRoll_qdota = this.toDegrees(states.find(obj => obj.name === "left_ankle_roll").qdota);
      this.leftAnkleRoll_taua = states.find(obj => obj.name === "left_ankle_roll").taua.toFixed(2);
      this.rightHipPitch_qa = this.toDegrees(states.find(obj => obj.name === "right_hip_pitch").qa);
      this.rightHipPitch_qdota = this.toDegrees(states.find(obj => obj.name === "right_hip_pitch").qdota);
      this.rightHipPitch_taua = states.find(obj => obj.name === "right_hip_pitch").taua.toFixed(2);
      this.rightHipYaw_qa = this.toDegrees(states.find(obj => obj.name === "right_hip_yaw").qa);
      this.rightHipYaw_qdota = this.toDegrees(states.find(obj => obj.name === "right_hip_yaw").qdota);
      this.rightHipYaw_taua = states.find(obj => obj.name === "right_hip_yaw").taua.toFixed(2);
      this.rightHipRoll_qa = this.toDegrees(states.find(obj => obj.name === "right_hip_roll").qa);
      this.rightHipRoll_qdota = this.toDegrees(states.find(obj => obj.name === "right_hip_roll").qdota);
      this.rightHipRoll_taua = states.find(obj => obj.name === "right_hip_roll").taua.toFixed(2);
      this.rightKnee_qa = this.toDegrees(states.find(obj => obj.name === "right_knee_pitch").qa);
      this.rightKnee_qdota = this.toDegrees(states.find(obj => obj.name === "right_knee_pitch").qdota);
      this.rightKnee_taua = states.find(obj => obj.name === "right_knee_pitch").taua.toFixed(2);
      this.rightAnklePitch_qa = this.toDegrees(states.find(obj => obj.name === "right_ankle_pitch").qa);
      this.rightAnklePitch_qdota = this.toDegrees(states.find(obj => obj.name === "right_ankle_pitch").qdota);
      this.rightAnklePitch_taua = states.find(obj => obj.name === "right_ankle_pitch").taua.toFixed(2);
      this.rightAnkleRoll_qa = this.toDegrees(states.find(obj => obj.name === "right_ankle_roll").qa);
      this.rightAnkleRoll_qdota = this.toDegrees(states.find(obj => obj.name === "right_ankle_roll").qdota);
      this.rightAnkleRoll_taua = states.find(obj => obj.name === "right_ankle_roll").taua.toFixed(2);
      this.headYaw_qa = this.toDegrees(states.find(obj => obj.name === "head_yaw").qa);
      this.headYaw_qdota = this.toDegrees(states.find(obj => obj.name === "head_yaw").qdota);
      this.headYaw_taua = states.find(obj => obj.name === "head_yaw").taua.toFixed(2);
      this.headPitch_qa = this.toDegrees(states.find(obj => obj.name === "head_pitch").qa);
      this.headPitch_qdota = this.toDegrees(states.find(obj => obj.name === "head_pitch").qdota);
      this.headPitch_taua = states.find(obj => obj.name === "head_pitch").taua.toFixed(2);
      this.headRoll_qa = this.toDegrees(states.find(obj => obj.name === "head_roll").qa);
      this.headRoll_qdota = this.toDegrees(states.find(obj => obj.name === "head_roll").qdota);
      this.headRoll_taua = states.find(obj => obj.name === "head_roll").taua.toFixed(2);
      this.waistYaw_qa = this.toDegrees(states.find(obj => obj.name === "waist_yaw").qa);
      this.waistYaw_qdota = this.toDegrees(states.find(obj => obj.name === "waist_yaw").qdota);
      this.waistYaw_taua = states.find(obj => obj.name === "waist_yaw").taua.toFixed(2);
      this.waistPitch_qa = this.toDegrees(states.find(obj => obj.name === "waist_pitch").qa);
      this.waistPitch_qdota = this.toDegrees(states.find(obj => obj.name === "waist_pitch").qdota);
      this.waistPitch_taua = states.find(obj => obj.name === "waist_pitch").taua.toFixed(2);
      this.waistRoll_qa = this.toDegrees(states.find(obj => obj.name === "waist_roll").qa);
      this.waistRoll_qdota = this.toDegrees(states.find(obj => obj.name === "waist_roll").qdota);
      this.waistRoll_taua = states.find(obj => obj.name === "waist_roll").taua.toFixed(2);
      this.xSpeed = data.basestate.vx.toFixed(2);
      this.ySpeed = data.basestate.vy.toFixed(2);
    },
    //获取log列表
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
    //弧度转角度
    toDegrees(e) {
      var degrees = e * (180 / Math.PI);
      return degrees.toFixed(2);
    },
    //更新两侧图表
    updateSideCharts(item, type) {
      if (!document.getElementById("leftChartLower") || !document.getElementById("rightChartLower"))
        return
      if (this.leftChartData.length > 11)//每超过10条数据，删除最旧的一条
        this.leftChartData.shift();
      if (this.rightChartData.length > 11)
        this.rightChartData.shift();
      switch (item) {
        case "hipPitch":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipPitch_qa))
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipPitch_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipPitch_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipPitch_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipPitch_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipPitch_taua));
          }
          break;
        case "hipYaw":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipYaw_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipYaw_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipYaw_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipYaw_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipYaw_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipYaw_taua));
          }
          break;
        case "hipRoll":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipRoll_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipRoll_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipRoll_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipRoll_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftHipRoll_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightHipRoll_taua));
          }
          break;
        case "knee":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftKnee_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightKnee_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftKnee_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightKnee_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftKnee_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightKnee_taua));
          }
          break;
        case "anklePitch":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnklePitch_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnklePitch_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnklePitch_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnklePitch_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnklePitch_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnklePitch_taua));
          }
          break;
        case "ankleRoll":
          if (type == "angle") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_qa));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_qa));
          } else if (type == "Avelocity") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_qdota));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_qdota));
          } else if (type == "torque") {
            this.leftChartData.push(this.xAxisDataFmt(this.leftAnkleRoll_taua));
            this.rightChartData.push(this.xAxisDataFmt(this.rightAnkleRoll_taua));
          }
          break;
        default:
          break;
      }
      let leftChart = echarts.getInstanceByDom(document.getElementById("leftChartLower"));
      leftChart.setOption({
        series: [
          {
            name: type,
            data: this.leftChartData
          }
        ]
      });
      let rightChart = echarts.getInstanceByDom(document.getElementById("rightChartLower"));
      rightChart.setOption({
        series: [
          {
            name: type,
            data: this.rightChartData
          }
        ]
      });
    },
    //更新速度图表
    updateSpeedCharts() {

    },
    // x轴格式化成时间轴数据
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
      this.leftChartData = [];
      this.rightChartData = [];
    },
    changeType(e) {
      this.activatedType = e;
      this.leftChartData = [];
      this.rightChartData = [];
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

.logTitle {
  font-size: 1.5833vw;
  font-family: Alibaba-PuHuiTi-M;
  font-weight: normal;
  color: #FFFFFF;
}

.leftBox {
  position: absolute;
  left: 3.0833vw;
  top: 5.7083vw;
  height: 38.2083vw;
  width: 553px;

  .humanModel {
    height: 32.125vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logBox {
    height: 30.8333vw;
    padding: 1.2917vw 1.25vw 0 2.4583vw;
    box-shadow: 0 .1042vw .2083vw 0 rgba(41, 72, 152, 0.01), 0 .4688vw .4167vw 0 rgba(41, 72, 152, 0.02);
    border-radius: .2604vw;
    background-color: rgba(255, 255, 255, 0.1);

    .logMain {
      margin-top: 1.0417vw;
      overflow-y: auto;
      height: 26.6667vw;
      // width: 33.8333vw;

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

    .logMain::-webkit-scrollbar {
      width: .5vw;
    }

    // .logMain::-webkit-scrollbar-track {
    //   background-color: rgba(81, 82, 85, 0.1);
    // }

    .logMain::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: .125vw;
    }

    .logMain::-webkit-scrollbar-corner {
      background-color: transparent;
    }
  }



  .modelChose {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3.7083vw;
    width: 23.0417vw;
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

.chartBox {
  position: absolute;
  top: 5.7083vw;
  right: 2.5833vw;
  width: 67.75vw;
  height: 8.625vw;
  background: rgba(255, 255, 255, 0.08);
  border-radius: .25vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .leftSide {
    width: 33.75vw;
    height: 8.625vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .chartSize {
      width: 16.875vw;
    }
  }

  .middleDivider {
    width: .125vw;
    height: 4.4167vw;
    background: rgba(255, 255, 255, 0.1)
  }

  .rightSide {
    width: 33.875vw;
  }
}

.upper {
  right: 37.0833vw;
}

.lower {
  right: 2.5833vw;
}

.rightBox {
  position: absolute;
  top: 16vw;
  width: 33.25vw;
  height: 27.5833vw;
  box-shadow: 0 .1042vw .2083vw 0 rgba(41, 72, 152, 0.01), 0 .4688vw .4167vw 0 rgba(41, 72, 152, 0.02);
  border-radius: .2604vw;

  .rightTitle {
    display: flex;
    justify-content: space-between;
    padding: 1.1667vw 1.25vw .75vw 2.4583vw;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: .2604vw .2604vw 0 0;
    font-size: 1.25vw;
    font-family: AlibabaPuHuiTiM;
    color: #FFFFFF;

    .typeImg {
      width: 1.4583vw;
      height: 1.4583vw;
      margin-left: 1.25vw;
    }

    .notAct {
      opacity: 0.3;
    }
  }

  .sideChart {
    height: 6.2917vw;
    padding: 0 1.25vw;
    background-color: rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
  }

  .rightTable {
    height: 15.5vw;
    padding: 1.9583vw 1.25vw 0 1.25vw;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 0 0 .2604vw .2604vw;
  }

  .tableItem {
    height: 2.2083vw;
    width: 100%;
    display: flex;
    align-items: center;

    .itemChild {
      color: #FFFFFF;
      flex: 3;
      font-size: 1.0417vw;
      text-align: center;
    }

    .middleCurr {
      flex: 2;
      background-color: #0075B8;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .middle {
      flex: 2;
      color: #85888b;
    }

    // .downArrow {
    //   margin-left: .2604vw;
    //   width: 0;
    //   height: 0;
    //   background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
    //   border-left: .3125vw solid transparent;
    //   border-right: .3125vw solid transparent;
    //   border-bottom: .5208vw solid #FFFFFF;
    // }
  }

  .tableItem:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.1);
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

.unity-robot {
  width: 18.9063vw;
  height: 29.0625vw;
}
</style>
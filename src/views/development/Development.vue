<template>
  <div class="black-bkg">
    <rtc-header>
      <div class="headState" @click="headChange()">
        <span class="headTxt common-font">{{ $t("developerMode") }}</span>
        <div class="arrow"></div>
      </div>
    </rtc-header>
    <!-- 模式切换 -->
    <div
      class="headBox flex-column"
      :style="headBoxWidth"
      v-if="headBoxVisible"
      ref="headBoxRef"
    >
      <div @click="changeMode('remoteMode')">
        {{ $t("remoteMode") }}
      </div>
      <div class="divider" :style="dividerWidth"></div>
      <div @click="changeMode('developerMode')">
        {{ $t("developerMode") }}
      </div>
    </div>
    <div class="tabBox">
      <!-- 机器人姿态 -->
      <div
        class="txt"
        :class="{ activeTab: activated == 'robot' }"
        @click="changeModel('robot')"
      >
        <div class="tab common-font" :class="{ opt: activated != 'robot' }">
          <img class="iconConnect" src="@/assets/images/icon_robotTem.png" />
          <div style="margin-left: 1.25vw">
            {{ $t("robotPose") }}
          </div>
        </div>
      </div>
      <!-- 执行器 -->
      <div
        class="txt"
        :class="{ activeTab: activated == 'motor' }"
        style="top: 47%"
        @click="changeModel('motor')"
      >
        <div class="tab common-font" :class="{ opt: activated != 'motor' }">
          <img class="iconConnect" src="@/assets/images/icon_chipTem.png" />
          <div style="margin-left: 1.25vw">
            {{ $t("motor") }}
          </div>
        </div>
      </div>
      <!-- Log日志 -->
      <div
        class="txt"
        :class="{ activeTab: activated == 'log' }"
        style="top: 94%"
        @click="changeModel('log')"
      >
        <div class="tab common-font" :class="{ opt: activated != 'log' }">
          <img class="iconSysState" src="@/assets/images/icon_log.png" />
          <div style="margin-left: 1.25vw">
            {{ $t("logFile") }}
          </div>
        </div>
      </div>
    </div>
    <!-- 机器人姿态 -->
    <div v-show="activated == 'robot'">
      <!-- 人形模型 -->
      <div class="humanModel flex-center" v-show="activated == 'robot'">
        <iframe
          ref="unityIfm"
          style="
            border: none;
            margin-top: 6vw;
            width: 26.0417vw;
            height: 32.4583vw;
          "
          :src="iframeUrl"
        ></iframe>
      </div>
      <div class="poseBox">
        <span class="poseTxt common-font">{{ $t("currentPosture") }}</span>
        <div class="poseContent flex-center">无运动</div>
      </div>
      <!-- IMU表 -->
      <div class="poseTable">
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
        >
        </div>
      </div>
    </div>
    <!-- log日志 -->
    <div class="logBox" v-show="activated == 'log'">
      <div class="logTitle common-font">{{ $t("logFile") }}</div>
      <div class="logMain">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logList"
            :key="index"
            :type="activity.type"
            :timestamp="activity.timestamp"
            :placement="activity.placement"
          >
            <p class="logTxt common-font">{{ activity.content }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!-- 头部上肢 -->
    <div class="rightBox upper" v-show="activated == 'motor'">
      <div class="rightTitle">
        <div>{{ $t("headPart") }}</div>
      </div>
      <!-- 左右侧图表 -->
      <div class="sideChart">
        <!-- Head Yaw -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
        >
          <div class="itemChild">{{ $t("head") }}{{ $t("yaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ headYaw_qa ? headYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ headYaw_qdota ? headYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ headYaw_taua ? headYaw_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Head Pitch -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0.1)"
        >
          <div class="itemChild">{{ $t("head") }}{{ $t("pitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ headPitch_qa ? headPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ headPitch_qdota ? headPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ headPitch_taua ? headPitch_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Head Roll -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
        >
          <div class="itemChild">{{ $t("head") }}{{ $t("roll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ headRoll_qa ? headRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ headRoll_qdota ? headRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ headRoll_taua ? headRoll_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
      </div>
      <!-- 数值切换显示Table -->
      <div class="rightTable">
        <div
          style="height: 2.125vw; width: 100%; display: flex; color: #85888b"
        >
          <div class="itemChild" style="font-size: 1.25vw; color: #ffffff">
            {{ $t("upperBody") }}
          </div>
          <div class="itemChild">
            {{ $t("left") }}
          </div>
          <div class="itemChild">
            {{ $t("right") }}
          </div>
        </div>
        <!-- Shoulder Pitch -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("shoulderPitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftPitchShoulder_qa ? leftPitchShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftPitchShoulder_qdota ? leftPitchShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftPitchShoulder_taua ? leftPitchShoulder_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightPitchShoulder_qa ? rightPitchShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{
              rightPitchShoulder_qdota ? rightPitchShoulder_qdota + "°/s" : ""
            }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightPitchShoulder_taua ? rightPitchShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Shoulder Roll -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("shoulderRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftRollShoulder_qa ? leftRollShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftRollShoulder_qdota ? leftRollShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftRollShoulder_taua ? leftRollShoulder_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightRollShoulder_qa ? rightRollShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightRollShoulder_qdota ? rightRollShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightRollShoulder_taua ? rightRollShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Shoulder Yaw -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("shoulderYaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftYawShoulder_qa ? leftYawShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftYawShoulder_qdota ? leftYawShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftYawShoulder_taua ? leftYawShoulder_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightYawShoulder_qa ? rightYawShoulder_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightYawShoulder_qdota ? rightYawShoulder_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightYawShoulder_taua ? rightYawShoulder_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Elbow -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("elbow") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftElbow_qa ? leftElbow_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftElbow_qdota ? leftElbow_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftElbow_taua ? leftElbow_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightElbow_qa ? rightElbow_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightElbow_qdota ? rightElbow_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightElbow_taua ? rightElbow_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Yaw -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("wristYaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftYawWrist_qa ? leftYawWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftYawWrist_qdota ? leftYawWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftYawWrist_taua ? leftYawWrist_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightYawWrist_qa ? rightYawWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightYawWrist_qdota ? rightYawWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightYawWrist_taua ? rightYawWrist_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Roll -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("wristRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftRollWrist_qa ? leftRollWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftRollWrist_qdota ? leftRollWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftRollWrist_taua ? leftRollWrist_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightRollWrist_qa ? rightRollWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightRollWrist_qdota ? rightRollWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightRollWrist_taua ? rightRollWrist_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Wrist Pitch -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("wristPitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftPitchWrist_qa ? leftPitchWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftPitchWrist_qdota ? leftPitchWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftPitchWrist_taua ? leftPitchWrist_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightPitchWrist_qa ? rightPitchWrist_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightPitchWrist_qdota ? rightPitchWrist_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightPitchWrist_taua ? rightPitchWrist_taua + "N.m" : "" }}
          </div>
        </div>
      </div>
    </div>
    <!-- 下肢数据 -->
    <div class="rightBox lower" v-show="activated == 'motor'">
      <div class="rightTitle">
        <div>{{ $t("waistPart") }}</div>
      </div>
      <!-- 左右侧图表 -->
      <div class="sideChart">
        <!-- Waist Yaw -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
        >
          <div class="itemChild">{{ $t("waist") }}{{ $t("yaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ waistYaw_qa ? waistYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ waistYaw_qdota ? waistYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ waistYaw_taua ? waistYaw_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Waist Pitch -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0.1)"
        >
          <div class="itemChild">{{ $t("waist") }}{{ $t("pitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ waistPitch_qa ? waistPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ waistPitch_qdota ? waistPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ waistPitch_taua ? waistPitch_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
        <!-- Waist Roll -->
        <div
          class="tableItem"
          style="background-color: rgba(255, 255, 255, 0)"
        >
          <div class="itemChild">{{ $t("waist") }}{{ $t("roll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ waistRoll_qa ? waistRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ waistRoll_qdota ? waistRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ waistRoll_taua ? waistRoll_taua + "N.m" : "" }}
          </div>
          <div class="itemChild"></div>
        </div>
      </div>
      <!-- 数值切换显示Table -->
      <div class="rightTable">
        <div
          style="height: 2.125vw; width: 100%; display: flex; color: #85888b"
        >
          <div class="itemChild" style="font-size: 1.25vw; color: #ffffff">
            {{ $t("lowerBody") }}
          </div>
          <div class="itemChild">
            {{ $t("left") }}
          </div>
          <div class="itemChild">
            {{ $t("right") }}
          </div>
        </div>
        <!-- Hip Roll -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("hipRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftHipRoll_qa ? leftHipRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftHipRoll_qdota ? leftHipRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftHipRoll_taua ? leftHipRoll_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightHipRoll_qa ? rightHipRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightHipRoll_qdota ? rightHipRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightHipRoll_taua ? rightHipRoll_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Hip Yaw -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("hipYaw") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftHipYaw_qa ? leftHipYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftHipYaw_qdota ? leftHipYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftHipYaw_taua ? leftHipYaw_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightHipYaw_qa ? rightHipYaw_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightHipYaw_qdota ? rightHipYaw_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightHipYaw_taua ? rightHipYaw_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Hip Pitch -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("hipPitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftHipPitch_qa ? leftHipPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftHipPitch_qdota ? leftHipPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftHipPitch_taua ? leftHipPitch_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightHipPitch_qa ? rightHipPitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightHipPitch_qdota ? rightHipPitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightHipPitch_taua ? rightHipPitch_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Knee -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("knee") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftKnee_qa ? leftKnee_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftKnee_qdota ? leftKnee_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftKnee_taua ? leftKnee_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightKnee_qa ? rightKnee_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightKnee_qdota ? rightKnee_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightKnee_taua ? rightKnee_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Ankle Pitch -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("anklePitch") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftAnklePitch_qa ? leftAnklePitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftAnklePitch_qdota ? leftAnklePitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftAnklePitch_taua ? leftAnklePitch_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightAnklePitch_qa ? rightAnklePitch_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightAnklePitch_qdota ? rightAnklePitch_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightAnklePitch_taua ? rightAnklePitch_taua + "N.m" : "" }}
          </div>
        </div>
        <!-- Ankle Roll -->
        <div
          class="tableItem"
        >
          <div class="itemChild">{{ $t("ankleRoll") }}</div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ leftAnkleRoll_qa ? leftAnkleRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ leftAnkleRoll_qdota ? leftAnkleRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ leftAnkleRoll_taua ? leftAnkleRoll_taua + "N.m" : "" }}
          </div>
          <div v-if="activatedType == 'angle'" class="itemChild itemTxt">
            {{ rightAnkleRoll_qa ? rightAnkleRoll_qa + "°" : "" }}
          </div>
          <div
            v-else-if="activatedType == 'Avelocity'"
            class="itemChild itemTxt"
          >
            {{ rightAnkleRoll_qdota ? rightAnkleRoll_qdota + "°/s" : "" }}
          </div>
          <div v-else-if="activatedType == 'torque'" class="itemChild itemTxt">
            {{ rightAnkleRoll_taua ? rightAnkleRoll_taua + "N.m" : "" }}
          </div>
        </div>
        <div class="tableItem"></div>
      </div>
    </div>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import { mapState } from "vuex";
export default {
  components: { rtcHeader },
  computed: {
    ...mapState(["connected"]),
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
  },
  data() {
    return {
      activated: "robot", //机器人姿态:robot Log日志:log 执行器:motor
      logList: [], //日志列表
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
      activatedType: "angle",
      headBoxVisible: false,
      iframeUrl: "Build/index.html",
      lastMessageReceivedTime: Date.now(),
      wsInterval: null,
    };
  },
  created() {},
  destroyed() {
    clearInterval(this.wsInterval);
    //关闭监听
    this.robotWs.robot.disable_debug_state();
    this.$bus.$off("robotOnmessage");
  },
  mounted() {
    //开启状态发送
    this.$nextTick(() => {
      this.robotWs.robot.enable_debug_state(1);
    });
    this.createWsInterval();
    this.$bus.$on("robotOnmessage", (data) => {
      console.log("development=============", data);
      this.lastMessageReceivedTime = Date.now();
      if (data.data.log && data.data.log.logBuffer)
        this.getLog(data.data.log.logBuffer);
      this.assignData(data.data.states);
    });
  },
  methods: {
    createWsInterval() {
      if (!this.wsInterval) {
        this.wsInterval = setInterval(() => {
          const currentTime = Date.now();
          const timeSinceLastMessage =
            currentTime - this.lastMessageReceivedTime;
          // 如果超过了阈值3秒，认为连接断开
          const threshold = 3000;
          if (timeSinceLastMessage > threshold) {
            console.log("WebSocket connection might be disconnected.");
            this.robotWs.robot.enable_debug_state(50);
            clearInterval(this.wsInterval);
          }
        }, 1000); // 每秒检查一次
      }
    },
    changeModel(e) {
      console.log("changeModel", e);
      this.activated = e;
    },
    // 格式化当前数据
    assignData(data) {
      let states = data.jointStates;
      //上肢部分
      this.leftPitchShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_shoulder").qa
      );
      this.leftPitchShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_shoulder").qdota
      );
      this.leftPitchShoulder_taua = states
        .find((obj) => obj.name === "left_pitch_shoulder")
        .taua.toFixed(2);
      this.leftRollShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_shoulder").qa
      );
      this.leftRollShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_shoulder").qdota
      );
      this.leftRollShoulder_taua = states
        .find((obj) => obj.name === "left_roll_shoulder")
        .taua.toFixed(2);
      this.leftYawShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_shoulder").qa
      );
      this.leftYawShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_shoulder").qdota
      );
      this.leftYawShoulder_taua = states
        .find((obj) => obj.name === "left_yaw_shoulder")
        .taua.toFixed(2);
      this.leftElbow_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_elbow").qa
      );
      this.leftElbow_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_elbow").qdota
      );
      this.leftElbow_taua = states
        .find((obj) => obj.name === "left_elbow")
        .taua.toFixed(2);
      this.leftYawWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_wrist").qa
      );
      this.leftYawWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_yaw_wrist").qdota
      );
      this.leftYawWrist_taua = states
        .find((obj) => obj.name === "left_yaw_wrist")
        .taua.toFixed(2);
      this.leftRollWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_wrist").qa
      );
      this.leftRollWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_roll_wrist").qdota
      );
      this.leftRollWrist_taua = states
        .find((obj) => obj.name === "left_roll_wrist")
        .taua.toFixed(2);
      this.leftPitchWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_wrist").qa
      );
      this.leftPitchWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_pitch_wrist").qdota
      );
      this.leftPitchWrist_taua = states
        .find((obj) => obj.name === "left_pitch_wrist")
        .taua.toFixed(2);
      this.rightPitchShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_shoulder").qa
      );
      this.rightPitchShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_shoulder").qdota
      );
      this.rightPitchShoulder_taua = states
        .find((obj) => obj.name === "right_pitch_shoulder")
        .taua.toFixed(2);
      this.rightRollShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_shoulder").qa
      );
      this.rightRollShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_shoulder").qdota
      );
      this.rightRollShoulder_taua = states
        .find((obj) => obj.name === "right_roll_shoulder")
        .taua.toFixed(2);
      this.rightYawShoulder_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_shoulder").qa
      );
      this.rightYawShoulder_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_shoulder").qdota
      );
      this.rightYawShoulder_taua = states
        .find((obj) => obj.name === "right_yaw_shoulder")
        .taua.toFixed(2);
      this.rightElbow_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_elbow").qa
      );
      this.rightElbow_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_elbow").qdota
      );
      this.rightElbow_taua = states
        .find((obj) => obj.name === "right_elbow")
        .taua.toFixed(2);
      this.rightYawWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_wrist").qa
      );
      this.rightYawWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_yaw_wrist").qdota
      );
      this.rightYawWrist_taua = states
        .find((obj) => obj.name === "right_yaw_wrist")
        .taua.toFixed(2);
      this.rightRollWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_wrist").qa
      );
      this.rightRollWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_roll_wrist").qdota
      );
      this.rightRollWrist_taua = states
        .find((obj) => obj.name === "right_roll_wrist")
        .taua.toFixed(2);
      this.rightPitchWrist_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_wrist").qa
      );
      this.rightPitchWrist_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_pitch_wrist").qdota
      );
      this.rightPitchWrist_taua = states
        .find((obj) => obj.name === "right_pitch_wrist")
        .taua.toFixed(2);
      //下肢部分
      this.leftHipPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_pitch").qa
      );
      this.leftHipPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_pitch").qdota
      );
      this.leftHipPitch_taua = states
        .find((obj) => obj.name === "left_hip_pitch")
        .taua.toFixed(2);
      this.leftHipYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_yaw").qa
      );
      this.leftHipYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_yaw").qdota
      );
      this.leftHipYaw_taua = states
        .find((obj) => obj.name === "left_hip_yaw")
        .taua.toFixed(2);
      this.leftHipRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_roll").qa
      );
      this.leftHipRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_hip_roll").qdota
      );
      this.leftHipRoll_taua = states
        .find((obj) => obj.name === "left_hip_roll")
        .taua.toFixed(2);
      this.leftKnee_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_knee_pitch").qa
      );
      this.leftKnee_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_knee_pitch").qdota
      );
      this.leftKnee_taua = states
        .find((obj) => obj.name === "left_knee_pitch")
        .taua.toFixed(2);
      this.leftAnklePitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_pitch").qa
      );
      this.leftAnklePitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_pitch").qdota
      );
      this.leftAnklePitch_taua = states
        .find((obj) => obj.name === "left_ankle_pitch")
        .taua.toFixed(2);
      this.leftAnkleRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_roll").qa
      );
      this.leftAnkleRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "left_ankle_roll").qdota
      );
      this.leftAnkleRoll_taua = states
        .find((obj) => obj.name === "left_ankle_roll")
        .taua.toFixed(2);
      this.rightHipPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_pitch").qa
      );
      this.rightHipPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_pitch").qdota
      );
      this.rightHipPitch_taua = states
        .find((obj) => obj.name === "right_hip_pitch")
        .taua.toFixed(2);
      this.rightHipYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_yaw").qa
      );
      this.rightHipYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_yaw").qdota
      );
      this.rightHipYaw_taua = states
        .find((obj) => obj.name === "right_hip_yaw")
        .taua.toFixed(2);
      this.rightHipRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_roll").qa
      );
      this.rightHipRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_hip_roll").qdota
      );
      this.rightHipRoll_taua = states
        .find((obj) => obj.name === "right_hip_roll")
        .taua.toFixed(2);
      this.rightKnee_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_knee_pitch").qa
      );
      this.rightKnee_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_knee_pitch").qdota
      );
      this.rightKnee_taua = states
        .find((obj) => obj.name === "right_knee_pitch")
        .taua.toFixed(2);
      this.rightAnklePitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_pitch").qa
      );
      this.rightAnklePitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_pitch").qdota
      );
      this.rightAnklePitch_taua = states
        .find((obj) => obj.name === "right_ankle_pitch")
        .taua.toFixed(2);
      this.rightAnkleRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_roll").qa
      );
      this.rightAnkleRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "right_ankle_roll").qdota
      );
      this.rightAnkleRoll_taua = states
        .find((obj) => obj.name === "right_ankle_roll")
        .taua.toFixed(2);
      this.headYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "head_yaw").qa
      );
      this.headYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "head_yaw").qdota
      );
      this.headYaw_taua = states
        .find((obj) => obj.name === "head_yaw")
        .taua.toFixed(2);
      this.headPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "head_pitch").qa
      );
      this.headPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "head_pitch").qdota
      );
      this.headPitch_taua = states
        .find((obj) => obj.name === "head_pitch")
        .taua.toFixed(2);
      this.headRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "head_roll").qa
      );
      this.headRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "head_roll").qdota
      );
      this.headRoll_taua = states
        .find((obj) => obj.name === "head_roll")
        .taua.toFixed(2);
      this.waistYaw_qa = this.toDegrees(
        states.find((obj) => obj.name === "waist_yaw").qa
      );
      this.waistYaw_qdota = this.toDegrees(
        states.find((obj) => obj.name === "waist_yaw").qdota
      );
      this.waistYaw_taua = states
        .find((obj) => obj.name === "waist_yaw")
        .taua.toFixed(2);
      this.waistPitch_qa = this.toDegrees(
        states.find((obj) => obj.name === "waist_pitch").qa
      );
      this.waistPitch_qdota = this.toDegrees(
        states.find((obj) => obj.name === "waist_pitch").qdota
      );
      this.waistPitch_taua = states
        .find((obj) => obj.name === "waist_pitch")
        .taua.toFixed(2);
      this.waistRoll_qa = this.toDegrees(
        states.find((obj) => obj.name === "waist_roll").qa
      );
      this.waistRoll_qdota = this.toDegrees(
        states.find((obj) => obj.name === "waist_roll").qdota
      );
      this.waistRoll_taua = states
        .find((obj) => obj.name === "waist_roll")
        .taua.toFixed(2);
    },
    //获取log列表
    getLog(data) {
      data.forEach((element) => {
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
      var formattedDate =
        year + "/" + month + "/" + day + " " + hours + ":" + minutes;
      return formattedDate;
    },
    //弧度转角度
    toDegrees(e) {
      var degrees = e * (180 / Math.PI);
      return degrees.toFixed(2);
    },
    headChange() {
      this.headBoxVisible = !this.headBoxVisible;
    },
    changeMode(e) {
      if (e == "remoteMode") {
        this.$router.push({
          name: "controller",
        });
      } else if (e == "developerMode") {
        this.headBoxVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.headState {
  position: absolute;
  top: 1vw;
  left: 10.9375vw;
  z-index: 99;
  display: flex;
  align-items: center;
  .headTxt {
    font-size: 1.9792vw;
    color: $white;
  }

  .arrow {
    margin-left: 0.5vw;
    width: 0;
    height: 0;
    background: linear-gradient(274deg, #1a1919 0%, #004c81 100%);
    border-left: 0.4167vw solid transparent;
    border-right: 0.4167vw solid transparent;
    border-top: 0.5208vw solid $white;
  }
}

.logTitle {
  font-size: 1.5833vw;
  color: $white;
}

.humanModel {
  height: 32.125vw;
  position: absolute;
  left: 37.2917vw;
  top: 5.7083vw;
}
.poseBox {
  position: absolute;
  top: 13.375vw;
  right: 18.2083vw;
  width: 18.2083vw;
  height: 13.375vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  .poseTxt {
    font-size: 1vw;
    color: $white;
    padding-bottom: 0.9167vw;
  }
  .poseContent {
    width: 18.2083vw;
    height: 11.0833vw;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.625vw;
    font-size: 1.9583vw;
    font-family: AlibabaPuHuiTiM;
    color: $white;
  }
}

.poseTable {
  position: absolute;
  right: 2.4583vw;
  bottom: 2.4583vw;
  width: 67.75vw;
  height: 10.4583vw;
  background: rgba(255, 255, 255, 0.08);
  border-radius: .25vw;
}

.logBox {
  height: 30.8333vw;
  padding: 1.2917vw 1.25vw 0 2.4583vw;
  box-shadow: 0 0.1042vw 0.2083vw 0 rgba(41, 72, 152, 0.01),
    0 0.4688vw 0.4167vw 0 rgba(41, 72, 152, 0.02);
  border-radius: 0.2604vw;
  background-color: rgba(255, 255, 255, 0.1);

  .logMain {
    margin-top: 1.0417vw;
    overflow-y: auto;
    height: 26.6667vw;

    .logTxt {
      font-size: $size-30;
      color: $white;
    }

    .txtErr {
      color: #dc4253;
    }
  }

  .logMain::-webkit-scrollbar {
    width: 0.5vw;
  }

  .logMain::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.125vw;
  }

  .logMain::-webkit-scrollbar-corner {
    background-color: transparent;
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
  top: 15.5417vw;
  width: 33.25vw;
  height: 28.3333vw;
  box-shadow: 0 0.1042vw 0.2083vw 0 rgba(41, 72, 152, 0.01),
    0 0.4688vw 0.4167vw 0 rgba(41, 72, 152, 0.02);
  border-radius: 0.2604vw;

  .rightTitle {
    display: flex;
    justify-content: space-between;
    padding: 1.1667vw 1.25vw 0.75vw 2.4583vw;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 0.2604vw 0.2604vw 0 0;
    font-size: $size-30;
    color: $white;

    .notAct {
      opacity: 0.3;
    }
  }

  .sideChart {
    height: 6.2917vw;
    padding: 0 1.25vw;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .rightTable {
    height: 16.7917vw;
    padding: 1.9583vw 1.25vw 0 1.25vw;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 0 0 0.2604vw 0.2604vw;
  }

  .tableItem {
    height: 2.0833vw;
    width: 100%;
    display: flex;
    align-items: center;
    color: #85888b;
  }

  .tableItem:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  .itemChild {
    flex: 1;
    font-size: 1vw;
    margin-left: 1.25vw;
  }

  .itemTxt {
    color: $white;
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

.unity-robot {
  width: 18.9063vw;
  height: 29.0625vw;
}
.tabBox {
  position: absolute;
  left: 0;
  top: 6.9167vw;
  width: 23.4167vw;
  height: 17.0833vw;

  .tab {
    position: absolute;
    left: 20%;
    width: 23.4167vw;
    height: 6.1667vw;
    font-size: 1.8333vw;
    color: $white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .txt {
    width: 23.3854vw;
    height: 6.1458vw;
    margin-bottom: 1.9167vw;
  }

  .activeTab {
    background: linear-gradient(
      274deg,
      rgba(26, 25, 25, 0.4) 0%,
      rgba(0, 76, 129, 0.4) 100%
    );
  }

  .activeTab::after {
    position: absolute;
    content: " ";
    left: 0;
    border-width: 6.1vw 3.3021vw 2.3021vw 0;
    border-style: solid;
    border-color: $light-blue transparent transparent transparent;
  }

  .iconConnect {
    width: 2.0833vw;
    height: 2.0833vw;
  }

  .iconSysState {
    width: 1.4063vw;
    height: 1.5625vw;
    padding: 0 0.35vw;
  }

  .opt {
    opacity: 0.3;
  }
}
</style>

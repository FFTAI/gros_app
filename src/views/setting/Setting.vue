<template>
  <div class="black-bkg">
    <rtc-header :isSetting="true" @connect="toConnect()">
      <div class="headState">
        <span class="headTxt common-font">{{ $t("systemSettings") }}</span>
      </div>
    </rtc-header>
    <!-- 左侧Tab标签栏 -->
    <div class="tabBox">
      <!-- 通用设置 -->
      <div
        class="txt"
        :class="{ activeTab: isActivated == 'status' }"
        style="top: 94%"
        @click="changeTab('status')"
      >
        <div class="tab common-font" :class="{ opt: isActivated != 'status' }">
          <img class="iconSysState" src="@/assets/images/icon_sysState.png" />
          <div style="margin-left: 1.25vw">
            {{ $t("systemInfo") }}
          </div>
        </div>
      </div>
      <!-- 机器人设置 -->
      <div
        class="txt"
        :class="{ activeTab: isActivated == 'robotSettings' }"
        @click="changeTab('robotSettings')"
      >
        <div
          class="tab common-font"
          :class="{ opt: isActivated != 'robotSettings' }"
        >
          <img
            class="iconConnect"
            src="@/assets/images/icon_robotsetting.png"
          />
          <div style="margin-left: 1.25vw">
            {{ $t("robotSettings") }}
          </div>
        </div>
      </div>
      <!-- 机器人状态 -->
      <div
        class="txt"
        :class="{ activeTab: isActivated == 'robotStatus' }"
        style="top: 47%"
        @click="changeTab('robotStatus')"
      >
        <div
          class="tab common-font"
          :class="{ opt: isActivated != 'robotStatus' }"
        >
          <img
            style="width: 1.7083vw; height: 1.7083vw"
            src="@/assets/images/icon_robot status.png"
          />
          <div style="margin-left: 1.25vw">
            {{ $t("robotStatus") }}
          </div>
        </div>
      </div>
    </div>
    <!-- 机器人设置标签页 -->
    <div class="listBox" v-if="isActivated == 'robotSettings'">
      <!-- 控制程序 -->
      <div>
        <div
          @click="openLabel('controlProgram')"
          class="item flex-between common-font"
          :class="{ labelBorder: cpActivated }"
          v-if="connected"
        >
          <span>{{ $t("controlProgram") }}</span>
          <img
            v-if="cpActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div class="labelActivated" v-if="cpActivated">
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("upperBody") }}
              <span style="font-size: 1.25vw; color: #ffffff; opacity: 0.5">
                （{{ $t("upperArm") }}+{{ $t("extremity") }}）</span
              >
            </div>
            <switchButton
              @openVal="openUpper()"
              :open="upperActivated"
            ></switchButton>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <span>{{ $t("headPart") }}</span>
            <switchButton
              @openVal="openHead()"
              :open="headActivated"
            ></switchButton>
          </div>
        </div>
      </div>
      <!-- 运动控制 -->
      <div>
        <div
          @click="openLabel('motionControl')"
          class="item flex-between common-font"
          :class="{ labelBorder: mcActivated }"
          v-if="connected"
        >
          <span>{{ $t("motionControl") }}</span>
          <img
            v-if="mcActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div
          class="labelActivated"
          style="height: 39.3333vw"
          v-if="mcActivated"
        >
          <!-- 运动速度 -->
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("movementSpeed") }}
            </div>
            <tagButton :speed="currSpeed" @changeTag="changeSpeed"></tagButton>
          </div>
          <div class="divider"></div>
          <!-- 机器高度 -->
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("machineHeight") }}
            </div>
            <tagButton
              :height="currHeight"
              @changeTag="changeHeight"
            ></tagButton>
            <!-- <div class="tagBtn">
              <div
                class="tagItem flex-center"
                :class="{
                  chosedTag: currHeight == 'low',
                  chosedLeft: currHeight == 'low',
                }"
                style="width: 6.1667vw"
                @click="changeHeight('low')"
              >
                {{ $t("low") }}
              </div>
              <div
                class="tagItem flex-center"
                :class="{
                  chosedTag: currHeight == 'middle',
                }"
                style="width: 6.1667vw"
                @click="changeHeight('middle')"
              >
                {{ $t("middle") }}
              </div>
              <div
                class="tagItem flex-center"
                :class="{
                  chosedTag: currHeight == 'high',
                  chosedRight: currHeight == 'high',
                }"
                style="width: 6.1667vw"
                @click="changeHeight('high')"
              >
                {{ $t("high") }}
              </div>
            </div> -->
          </div>
          <div class="divider"></div>
          <!-- 质心质量 -->
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("centroidMass") }}
            </div>
            <div>
              <el-slider
                class="splider"
                v-model="cmVal"
                :show-tooltip="false"
                :marks="cmMarks"
              ></el-slider>
              {{ cmVal }}
            </div>
          </div>
          <div class="divider"></div>
          <!-- 质心位置 -->
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("centroidPosition") }}
            </div>
            <div>
              <el-slider
                class="splider"
                v-model="cpVal"
                :show-tooltip="false"
                :marks="cpMarks"
              ></el-slider>
              {{ -cpVal }}
            </div>
          </div>
          <div class="divider"></div>
          <!-- 力控比例 -->
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("forceControlRatio") }}
            </div>
            <div>
              <el-slider
                class="splider"
                v-model="frVal"
                :show-tooltip="false"
                :marks="frMarks"
              ></el-slider>
              {{ frVal }}
            </div>
          </div>
          <div class="divider"></div>
          <!-- 胯宽 -->
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("crotchWidth") }}
            </div>
            <div>
              <el-slider
                class="splider"
                v-model="cwVal"
                :show-tooltip="false"
                :marks="cwMarks"
              ></el-slider>
              {{ cwVal }}
            </div>
          </div>
        </div>
      </div>
      <!-- 感知交互 -->
      <div>
        <div
          @click="openLabel('perceptualInteraction')"
          class="item flex-between common-font"
          :class="{ labelBorder: piActivated }"
          v-if="connected"
        >
          <span>{{ $t("perceptualInteraction") }}</span>
          <img
            v-if="piActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div
          class="labelActivated"
          style="height: 29.6667vw"
          v-if="piActivated"
        >
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("voice") }}
            </div>
            <switchButton
              @openVal="openVoice()"
              :open="voiceActivated"
            ></switchButton>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("volume") }}
            </div>
            <div>
              <el-slider
                class="splider"
                v-model="volumeVal"
                :show-tooltip="false"
              ></el-slider>
              {{ volumeVal }}
            </div>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("perceptualPointCloud") }}
            </div>
            <switchButton
              @openVal="openPerceptualPointCloud()"
              :open="ppActivated"
            ></switchButton>
          </div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("obstacleAvoidance") }}
            </div>
            <switchButton
              @openVal="openObstacleAvoidance()"
              :open="oaActivated"
            ></switchButton>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("imageTransmission") }}
            </div>
            <switchButton
              @openVal="openImageTransmission()"
              :open="itActivated"
            ></switchButton>
          </div>
        </div>
      </div>
      <!-- 机器人校准 -->
      <div>
        <div
          @click="openLabel('robotCalibration')"
          class="item flex-between common-font"
          :class="{ labelBorder: rcActivated }"
          v-if="connected"
        >
          <span>{{ $t("robotCalibration") }}</span>
          <img
            v-if="rcActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div class="labelActivated" style="height: 24.875vw" v-if="rcActivated">
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("headPart") }}
            </div>
            <div class="flex-center">
              <span class="itemTxt" style="margin-right: 0.6667vw">{{
                $t("calibration")
              }}</span>
              <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("waistPart") }}
            </div>
            <div class="flex-center">
              <span class="itemTxt" style="margin-right: 0.6667vw">{{
                $t("calibration")
              }}</span>
              <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("upperBody") }}
            </div>
            <div class="flex-center">
              <span class="itemTxt" style="margin-right: 0.6667vw">{{
                $t("calibration")
              }}</span>
              <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("lowerBody") }}
            </div>
            <div class="flex-center">
              <span class="itemTxt" style="margin-right: 0.6667vw">{{
                $t("calibration")
              }}</span>
              <img class="iconTo" src="@/assets/images/icon_to.png" />
            </div>
          </div>
        </div>
      </div>
      <!-- 电源管理 -->
      <div>
        <div
          @click="openLabel('powerManagement')"
          class="item flex-between common-font"
          :class="{ labelBorder: pmActivated }"
          v-if="connected"
        >
          <span>{{ $t("powerManagement") }}</span>
          <img
            v-if="pmActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div class="labelActivated" v-if="pmActivated">
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("lowPowerMode") }}
            </div>
            <switchButton
              @openVal="openLowPowerMode()"
              :open="lowPowerModeActivated"
            ></switchButton>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("lowBatteryAlarm") }}
            </div>
            <div>
              <el-slider
                class="splider"
                v-model="lowBatteryVal"
                :show-tooltip="false"
              ></el-slider>
              {{ lowBatteryVal }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 机器人状态标签页 -->
    <div class="listBox" v-if="isActivated == 'robotStatus'">
      <!-- 设备自检 -->
      <div>
        <div
          @click="openLabel('deviceSelfCheck')"
          class="item flex-between common-font"
          :class="{ labelBorder: dscActivated }"
          v-if="connected"
        >
          <span>{{ $t("deviceSelfCheck") }}</span>
          <div class="flex-center">
            <span class="itemTxt" style="margin-right: 0.75vw">{{
              $t("selfCheck")
            }}</span>
            <img
              v-if="dscActivated"
              class="arrowDown"
              src="@/assets/images/btn_arrowUp.png"
            />
            <img
              v-else
              class="arrowDown"
              src="@/assets/images/btn_arrowDown.png"
            />
          </div>
        </div>
        <div
          class="labelActivated"
          style="height: 46.9583vw"
          v-if="dscActivated"
        >
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("visualCamera") }}
            </div>
            <span>{{ $t("normal") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("controlModule") }}
            </div>
            <span>{{ $t("normal") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("actuator") }}
            </div>
            <span style="color: #ff6656">{{ $t("anomaly") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("battery") }}
            </div>
            <span style="color: #ff6656">{{ $t("anomaly") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("screen") }}
            </div>
            <span>{{ $t("normal") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">IMU</div>
            <span>{{ $t("normal") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("voiceModule") }}
            </div>
            <span>{{ $t("normal") }}</span>
          </div>
        </div>
      </div>
      <!-- 电池状态 -->
      <div>
        <div
          @click="openLabel('batteryStatus')"
          class="item flex-between common-font"
          :class="{ labelBorder: bsActivated }"
          v-if="connected"
        >
          <span>{{ $t("batteryStatus") }}</span>
          <img
            v-if="bsActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div
          class="labelActivated"
          style="height: 39.5417vw"
          v-if="bsActivated"
        >
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("batteryCapacity") }}
            </div>
            <span>960wh</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("batteryLevel") }}
            </div>
            <span>80%</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("batteryVoltage") }}
            </div>
            <span>45v</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("batteryTemperature") }}
            </div>
            <span>31°C</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("chargingAndDischarging") }}
            </div>
            <span>{{ $t("dischargeInProgress") }}</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("cycleCount") }}
            </div>
            <span>20</span>
          </div>
        </div>
      </div>
      <!-- Wi-Fi状态 -->
      <div>
        <div
          @click="openLabel('wifiStatus')"
          class="item flex-between common-font"
          :class="{ labelBorder: wifiActivated }"
          v-if="connected"
        >
          <span>{{ $t("wifiStatus") }}</span>
          <img
            v-if="wifiActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div
          class="labelActivated"
          style="height: 24.8333vw"
          v-if="wifiActivated"
        >
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("wifiName") }}
            </div>
            <span>小傅</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("wifiSignal") }}
            </div>
            <span>90</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("ip") }}
            </div>
            <span>192.168.233.68</span>
          </div>
          <div class="divider"></div>
          <div class="itemChild">
            <div class="flex-center">
              {{ $t("mac") }}
            </div>
            <span>*********</span>
          </div>
        </div>
      </div>
      <!-- 异常报警 -->
      <div>
        <div
          @click="openLabel('abnormalAlarm')"
          class="item flex-between common-font"
          :class="{ labelBorder: aaActivated }"
          v-if="connected"
        >
          <span>{{ $t("abnormalAlarm") }}</span>
          <img
            v-if="aaActivated"
            class="arrowDown"
            src="@/assets/images/btn_arrowUp.png"
          />
          <img
            v-else
            class="arrowDown"
            src="@/assets/images/btn_arrowDown.png"
          />
        </div>
        <div class="labelActivated" v-if="aaActivated" style="height: auto">
          <div class="itemChild" v-if="errorList.length == 0">暂无异常报警</div>
          <div v-else>
            <div
              class="itemChild"
              style="flex-direction: column; justify-content: start"
              v-for="(error, index) in errorList"
              :key="index"
            >
              <div style="margin-bottom: 1.6667vw">
                <div class="grayTxt">{{ error.time }}</div>
                <div class="redTxt">{{ error.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="powerBtn flex-center common-font">
        <img
          style="width: 1.4583vw; height: 1.5208vw; margin-right: 0.75vw"
          src="@/assets/images/icon_poweroff.png"
        />
        <div @click="openPoweroff()">
          {{ $t("powerOff") }}
        </div>
      </div>
    </div>
    <!-- 通用设置标签页 -->
    <div class="listBox" v-if="isActivated == 'status'">
      <div class="item flex-between common-font">
        <span>{{ $t("serialNumber") }}</span>
        <span>GR123OT0001</span>
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("productModel") }}</span>
        <span>GR-1</span>
      </div>
      <div class="item flex-between common-font" @click="changeNickname()">
        <span>{{ $t("customNickname") }}</span>
        <span class="itemTxt">小傅小傅</span>
        <img class="iconTo" src="@/assets/images/icon_to.png" />
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("connectionStatus") }}</span>
        <span>Wi-Fi</span>
      </div>
      <!-- 多语言选择 -->
      <div class="item flex-between common-font">
        <span>{{ $t("appLanguage") }}</span>
        <div class="tagBtn">
          <div
            class="tagItem flex-center"
            :class="{
              chosedTag: currLanguage == 'zh',
              chosedLeft: currLanguage == 'zh',
            }"
            @click="changeLanguage('zh')"
          >
            {{ $t("simplifiedChinese") }}
          </div>
          <div
            class="tagItem flex-center"
            :class="{
              chosedTag: currLanguage == 'en',
              chosedRight: currLanguage == 'en',
            }"
            @click="changeLanguage('en')"
          >
            {{ $t("English") }}
          </div>
        </div>
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("robotVersion") }}</span>
        <div @click="detectUpdates('robotVersion')">
          <span style="margin-right: 1.8333vw">{{
            robotVersion ? robotVersion : "V3.0.0"
          }}</span>
          <span class="itemTxt">{{ $t("detectUpdates") }}</span>
        </div>
        <img class="iconTo" src="@/assets/images/icon_to.png" />
      </div>
      <div class="item flex-between common-font">
        <span>{{ $t("appVersion") }}</span>
        <div @click="detectUpdates('appVersion')">
          <span style="margin-right: 1.8333vw">V3.0.0</span>
          <span class="itemTxt">{{ $t("detectUpdates") }}</span>
        </div>
        <img class="iconTo" src="@/assets/images/icon_to.png" />
      </div>
      <div class="powerBtn flex-center common-font">
        <img
          style="width: 1.4583vw; height: 1.5208vw; margin-right: 0.75vw"
          src="@/assets/images/icon_poweroff.png"
        />
        <div @click="openPoweroff()">
          {{ $t("powerOff") }}
        </div>
      </div>
    </div>
    <prompt-box
      :prompt="prompt"
      :loading="isloading"
      v-if="
        !connected ||
        ['update', 'selfcheck', 'shutdown', 'nickname'].includes(prompt)
      "
    ></prompt-box>
  </div>
</template>

<script>
import rtcHeader from "@/components/rtcHeader.vue";
import promptBox from "@/components/promptBox.vue";
import switchButton from "@/components/switchButton.vue";
import tagButton from "@/components/tagButton.vue";
import { mapState } from "vuex";
import Heartbeat from "@/mixin/Heartbeat";
export default {
  mixins: [Heartbeat],
  components: { rtcHeader, promptBox, switchButton, tagButton },
  computed: {
    ...mapState(["connected"]),
    prompt() {
      if (!this.connected) {
        return "reconnect";
      } else {
        return this.promptVal;
      }
    },
    isloading() {
      if (["update", "selfcheck", "shutdown"].includes(this.promptVal)) {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      promptVal: "",
      isActivated: "status", //当前活动Tab
      logOpen: true,
      nickname: false,
      microphone: false,
      speech: false,
      currLanguage: "zh",
      languageActivated: false,
      volume: 70,
      microphoneOpen: true,
      speechOpen: false,
      robotVersion: "",
      cpActivated: false, //控制程序展开
      mcActivated: false, //运动控制展开
      piActivated: false, //感知交互展开
      rcActivated: false, //机器人校准展开
      pmActivated: false, //电源管理展开
      bsActivated: false, //电池状态展开
      wifiActivated: false, //wifi状态展开
      aaActivated: false, //异常报警展开
      dscActivated: false, //设备自检展开
      upperActivated: false,
      headActivated: false,
      voiceActivated: false,
      ppActivated: false,
      oaActivated: false,
      itActivated: false,
      lowPowerModeActivated: false,
      currSpeed: "slow",
      currHeight: "low",
      cmVal: 80,
      cpVal: 20,
      frVal: 40,
      cwVal: 30,
      volumeVal: 80,
      lowBatteryVal: 30,
      cmMarks: {
        50: "50",
      },
      cpMarks: {
        50: "0",
      },
      frMarks: {
        50: "50%",
      },
      cwMarks: {
        50: "30",
      },
      errorList: [
        {
          time: "2023/08/08 17:49:21",
          content: "Error! Actuator temperature too high！",
        },
        {
          time: "2023/08/08 17:49:21",
          content: "Error! Disconnected！",
        },
        {
          time: "2023/08/08 17:49:21",
          content: "Error! Actuator temperature too high！",
        },
        {
          time: "2023/08/08 17:49:21",
          content: "Error! Disconnected！",
        },
        {
          time: "2023/08/08 17:49:21",
          content: "Error! Actuator temperature too high！",
        },
        {
          time: "2023/08/08 17:49:21",
          content: "Error! Disconnected！",
        },
      ],
    };
  },
  mounted() {
    this.currLanguage = localStorage.getItem("lang");
    this.getVersion();
  },
  methods: {
    changeTab(e) {
      this.isActivated = e;
    },
    changeLanguage(e) {
      this.currLanguage = e;
      this.$i18n.locale = e;
      localStorage.setItem("lang", e);
      this.languageActivated = false;
    },
    toConnect() {
      this.$router.push({
        name: "robotStartup",
      });
    },
    openLog() {
      this.logOpen = !this.logOpen;
    },
    openMicrophone() {
      this.microphoneOpen = !this.microphoneOpen;
    },
    openSpeech() {
      this.speechOpen = !this.speechOpen;
    },
    getVersion() {
      this.$http
        .request({
          baseURL: process.env.VUE_APP_URL,
          method: "GET",
          url: "/system/version",
        })
        .then((response) => {
          this.robotVersion = response.data.data.server;
          console.log("success---version", response.data.data);
        })
        .catch((error) => {
          console.log("error---version", error);
        });
    },
    openLabel(e) {
      switch (e) {
        case "controlProgram":
          this.cpActivated = !this.cpActivated;
          break;
        case "motionControl":
          this.mcActivated = !this.mcActivated;
          break;
        case "perceptualInteraction":
          this.piActivated = !this.piActivated;
          break;
        case "robotCalibration":
          this.rcActivated = !this.rcActivated;
          break;
        case "powerManagement":
          this.pmActivated = !this.pmActivated;
          break;
        case "batteryStatus":
          this.bsActivated = !this.bsActivated;
          break;
        case "wifiStatus":
          this.wifiActivated = !this.wifiActivated;
          break;
        case "abnormalAlarm":
          this.aaActivated = !this.aaActivated;
          break;
        case "deviceSelfCheck":
          this.dscActivated = !this.dscActivated;
          this.promptVal = "selfcheck";
        default:
          break;
      }
    },
    openUpper() {
      this.upperActivated = !this.upperActivated;
    },
    openHead() {
      this.headActivated = !this.headActivated;
    },
    openVoice() {
      this.voiceActivated = !this.voiceActivated;
    },
    openPerceptualPointCloud() {
      this.ppActivated = !this.ppActivated;
    },
    openObstacleAvoidance() {
      this.oaActivated = !this.oaActivated;
    },
    openImageTransmission() {
      this.itActivated = !this.itActivated;
    },
    openLowPowerMode() {
      this.lowPowerModeActivated = !this.lowPowerModeActivated;
    },
    //选择运动速度
    changeSpeed(e) {
      console.log(e);
      this.currSpeed = e;
    },
    //选择机器高度
    changeHeight(e) {
      console.log(e);
      this.currHeight = e;
    },
    //检测更新
    detectUpdates(e) {
      this.promptVal = "update";
    },
    openPoweroff() {
      this.promptVal = "shutdown";
    },
    changeNickname() {
      this.promptVal = "nickname";
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

  .headTxt {
    font-size: $size-47;
    color: $white;
    line-height: 2.7083vw;
  }
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
    width: 1.5625vw;
    height: 1.5625vw;
  }

  .iconSysState {
    width: 1.7083vw;
    height: 1.8333vw;
  }

  .opt {
    opacity: 0.3;
  }
}

.listBox {
  position: absolute;
  right: 3.625vw;
  top: 6.2917vw;
  width: 65.2083vw;
  height: 49.4792vw;
  overflow-y: auto;

  .item {
    width: 55.625vw;
    height: 6.1667vw;
    background-color: rgba(255, 255, 255, 0.08);
    margin-bottom: 1.25vw;
    padding: 0 3.5vw 0 2.4583vw;
    font-size: $size-41;
    align-items: center;
    border-radius: 0.625vw;
    color: $white;
  }

  .itemChild {
    font-family: AlibabaPuHuiTiM;
    font-size: $size-35;
    color: $white;
    font-style: normal;
    display: flex;
    justify-content: space-between;
  }

  .expandLabel {
    margin-bottom: 0;
    border-radius: 0.25vw 0.25vw 0 0;
  }

  .iconTo {
    position: absolute;
    right: 5.4167vw;
    width: 0.625vw;
    height: 1.1979vw;
  }

  .itemTxt {
    color: $light-blue;
  }

  .tagItem {
    width: 9.2917vw;
    height: 3.7083vw;
    opacity: 0.1;
  }

  .chosedTag {
    background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
    opacity: 1;
  }

  .chosedLeft {
    border-radius: 0.625vw 0 0 0.625vw;
  }

  .chosedRight {
    border-radius: 0 0.625vw 0.625vw 0;
  }

  .tagBtn {
    width: 18.5833vw;
    height: 3.7083vw;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.625vw;
    display: flex;
    font-size: 1.4583vw;
    font-style: normal;
  }

  .iconChose {
    width: 1.25vw;
    height: 1.25vw;
  }

  .visibility {
    visibility: hidden;
  }

  .splider {
    width: 24.625vw;
    font-size: initial;
    display: inline-block;
    margin-right: 1.25vw;
    position: absolute;
    right: 9vw;
  }

  .powerBtn {
    width: 34.5vw;
    height: 4.1667vw;
    background: $base-bkg;
    border-radius: 2.0833vw;
    font-size: $size-41;
    color: $white;
    margin-left: 14.8333vw;
    margin-top: 2.4583vw;
  }

  .scItem {
    height: 25.3333vw;
    flex-direction: column;
    justify-content: space-around;
    align-items: normal;
    border-radius: 0 0 0.25vw 0.25vw;
    .scChild {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
}

@media screen and (min-width: 2400px) and (max-height: 1080px) {
  .listBox {
    height: 38vw;
  }
}

.listBox::-webkit-scrollbar {
  width: 0.25vw;
}

.listBox::-webkit-scrollbar-track {
  background-color: rgba(81, 82, 85, 0.2);
}

.listBox::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.125vw;
}

.listBox::-webkit-scrollbar-corner {
  background-color: transparent;
}

.switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 0.5833vw;
  line-height: 0.8333vw;
  height: 2.7083vw;
  vertical-align: middle;

  .switchCore {
    margin: 0;
    position: relative;
    width: 5.1667vw;
    height: 2.7083vw;
    border: 0.0417vw solid #dcdfe6;
    outline: 0;
    border-radius: 1.5vw;
    box-sizing: border-box;
    background: #dcdfe6;
    transition: border-color 0.3s, background-color 0.3s;
    vertical-align: middle;
  }

  .switchCore::after {
    content: "";
    position: absolute;
    top: 0.2083vw;
    left: 0.0417vw;
    border-radius: 100%;
    transition: all 0.3s;
    width: 2.1667vw;
    height: 2.1667vw;
    background-color: #fff;
  }
}

.switch.isChecked .switchCore {
  border-color: $light-blue;
  background-color: $light-blue;
}

.switch.isChecked .switchCore::after {
  left: 100%;
  margin-left: -2.1667vw;
}

.el-slider__button {
  width: 1.3333vw;
  height: 1.3333vw;
}

.arrowDown {
  position: absolute;
  left: 57.75vw;
  width: 1.375vw;
  height: 0.75vw;
}

.labelBorder {
  background: linear-gradient(
      230deg,
      rgba(25, 139, 255, 0.08) 0%,
      rgba(0, 134, 209, 0.08) 100%
    ),
    rgba(255, 255, 255, 0.08);
  border-radius: 0.625vw 0.625vw 0 0 !important;
  border: 0.0417vw solid #0075b8;
  width: 55.5417vw !important;
  height: 6.0833vw !important;
}
.labelActivated {
  width: 56.6667vw;
  height: 10vw;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0 0 0.625vw 0.625vw;
  margin-top: -1.25vw;
  margin-bottom: 1.25vw;
  padding: 2.4583vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.divider {
  width: 56.6667vw;
  height: 0.0417vw;
  background: rgba(255, 255, 255, 0.2);
}
.splider ::v-deep .el-slider__runway {
  height: 0.5vw;
  background-color: rgba(216, 216, 216, 0.2);
}
.splider ::v-deep .el-slider__bar {
  height: 0.5vw;
}
.splider ::v-deep .el-slider__button-wrapper {
  top: -0.8333vw;
}
.splider ::v-deep .el-slider__button {
  width: 2.0833vw;
  height: 2.0833vw;
  box-shadow: 0 0.125vw 0.2917vw 0 rgba(63, 63, 63, 0.5);
  border: 0;
}
.splider ::v-deep .el-slider__marks .el-slider__marks-text {
  font-family: AlibabaPuHuiTiM;
  font-size: 1.25vw;
  color: #ffffff;
  font-style: normal;
}
.splider ::v-deep .el-slider__stop {
  width: 0.875vw;
  height: 0.875vw;
  background: #ffffff;
  border: 0.25vw solid rgba(25, 139, 255, 1);
  top: -0.4167vw;
  // border-image: linear-gradient(
  //     230deg,
  //     rgba(25, 139, 255, 1),
  //     rgba(0, 134, 209, 1)
  //   )
  //   6 6;
  // border-radius: 100%;
}
.grayTxt {
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 1vw;
  color: #ffffff;
  font-style: normal;
  opacity: 0.4;
}
.redTxt {
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 1.25vw;
  color: #dc4253;
  font-style: normal;
}
</style>

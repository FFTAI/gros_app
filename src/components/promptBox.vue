<template>
  <div class="wrapper flex-center">
    <div class="prompt vertically-centered common-font">
      <div class="title" v-if="prompt == 'returnMain'">
        {{ $t("tip") }}
      </div>
      <div
        class="promptContent"
        :style="promptContentWidth"
        v-if="(!loading || selfcheckFail) && prompt != 'nickname'"
      >
        <img
          v-if="prompt != 'returnMain' && !lowBattery"
          class="warningIcon"
          src="@/assets/images/warning1.png"
        />
        <img
          v-if="lowBattery"
          class="warningIcon"
          src="@/assets/images/icon_warning.png"
        />
        <div class="promptTxt">
          <span v-if="prompt == 'closeProgram'">{{ $t("closeShPrompt") }}</span>
          <span v-else-if="prompt == 'returnMain'">{{ $t("returnMain") }}</span>
          <span v-else-if="prompt == 'reconnect'">{{
            $t("reconnectPrompt")
          }}</span>
          <span v-else-if="prompt == 'powerOff'">{{ $t("powerOffTip") }}</span>
          <span v-else-if="prompt == 'calibration'">{{
            $t("calibrationTips")
          }}</span>
          <span v-else-if="selfcheckFail">{{ $t("selfcheckFail") }}</span>
          <span v-else-if="lowBattery">{{ $t("lowBattery") }}</span>
        </div>
      </div>
      <div class="promptInputContent" v-else-if="prompt == 'nickname'">
        <span class="promtTitle">{{ $t("setNikename") }}</span>
        <div class="promptInput">
          <el-input v-model="nickname" placeholder="输入1～6个中文文字"></el-input>
        </div>
      </div>
      <div class="loadingPart" v-else-if="loading && !updateFinish">
        <i class="el-icon-loading" v-if="!updateFinish"></i>
        <span style="margin-top: 1.25vw">{{ promptValue }}</span>
      </div>
      <div class="finishPart" v-else-if="loading && updateFinish">
        {{ $t("latestVersion") }}
      </div>
      <div
        v-if="prompt == 'reconnect'"
        class="btnBox flex-between"
        style="left: 11.7083vw"
      >
        <div class="btn blue" @click="reconnect()">{{ $t("reconnect") }}</div>
      </div>
      <div
        v-else-if="prompt != 'reconnect' && !loading"
        class="btnBox flex-between"
      >
        <div class="btn white01-bkg" @click="cancel()">{{ $t("cancel") }}</div>
        <div class="btn blue" @click="confirm()">
          {{ $t("confirm") }}
        </div>
      </div>
      <div v-else-if="selfcheckFail" class="btnBox flex-between">
        <div class="btn white01-bkg" @click="cancel()">{{ $t("cancel") }}</div>
        <div class="btn blue" @click="restart()">
          {{ $t("restart") }}
        </div>
      </div>
      <div v-else-if="updateFinish" class="btnBox flex-center">
        <div class="btn blue" @click="confirm()">
          {{ $t("confirm") }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "promptBox",
  props: {
    prompt: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    contentStyle() {
      let style = { left: "9.5417vw" };
      if (this.prompt == "returnMain") style.left = "13.9167vw";
      if (this.prompt == "calibration") style.left = "5.1667vw";
      return style;
    },
    txtStyle() {
      let style = { width: "10.2083vw " };
      if (this.prompt == "calibration") style.width = "16vw";
      return style;
    },
    promptContentWidth() {
      let style = { width: "16vw" };
      if (this.$i18n.locale == "en") style.width = "26vw";
      if (this.prompt == "calibration" && this.$i18n.locale == "zh")
        style.width = "20vw";
      if (this.prompt == "calibration" && this.$i18n.locale == "en")
        style.width = "30vw";
      if (this.prompt == "reconnect" && this.$i18n.locale == "zh")
        style.width = "15vw";
      if (this.prompt == "reconnect" && this.$i18n.locale == "en")
        style.width = "20vw";
      if (this.lowBattery) style.width = "18vw";
      return style;
    },
    promptValue() {
      let value = "";
      switch (this.prompt) {
        case "update":
          this.$i18n.locale == "zh"
            ? (value = "更新中…")
            : (value = "Updating…");
          this.finishUpdate();
          break;
        case "selfcheck":
          this.$i18n.locale == "zh"
            ? (value = "设备自检中…")
            : (value = "Device self-checking…");
          this.selfcheckWarning();
          break;
        case "shutdown":
          this.$i18n.locale == "zh"
            ? (value = "设备关机中…")
            : (value = "Device is shutting down…");
          break;
        default:
          break;
      }
      return value;
    },
  },
  mounted() {
    console.log(this.prompt, this.loading);
  },
  data() {
    return {
      updateFinish: false,
      selfcheckFail: false,
      lowBattery: false,
      nickname: ""
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
    restart() {},
    reconnect() {
      let main = plus.android.runtimeMainActivity();
      let Intent = plus.android.importClass("android.content.Intent");
      let mIntent = new Intent("android.settings.WIFI_SETTINGS");
      main.startActivity(mIntent);
    },
    finishUpdate() {
      setTimeout(() => {
        this.updateFinish = true;
      }, 2000);
    },
    selfcheckWarning() {
      setTimeout(() => {
        this.selfcheckFail = true;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.prompt {
  z-index: 999;
  width: 35.7083vw;
  height: 20.9167vw;
  background-image: url("../assets/images/image_card.png");
  background-repeat: no-repeat;
  background-size: cover;
  font-size: $size-41;
  color: $white;
  display: flex;
  justify-content: center;
}

.title {
  position: absolute;
  top: 1.7917vw;
}

.promptContent {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 11.2083vw;

  .promptTxt {
    font-size: $size-35;
    display: inline-block;
    margin: auto;
  }
}

.warningIcon {
  width: 4.9167vw;
  height: 4.5417vw;
  margin-right: $size-35;
}

.btnBox {
  width: 27.0833vw;
  font-size: 1.7083vw;
  position: absolute;
  bottom: 2.7083vw;
}

.btn {
  width: 12.3333vw;
  height: 4.1667vw;
  border-radius: 2.2083vw;
  line-height: 4.1667vw;
  text-align: center;
}

.blue {
  background: $base-bkg;
}
.loadingPart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.finishPart {
  margin-top: 6.0833vw;
}
.promptInputContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  .promtTitle {
    font-family: AlibabaPuHuiTiM;
    font-size: 1.9583vw;
    color: #ffffff;
    font-style: normal;
    margin-top: 1.7917vw;
  }
  .promptInput {
    width: 15.5833vw;
    height: 2.3333vw;
    padding: 1.2917vw 5.7083vw 1.2917vw 5.7917vw;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.25vw;
    margin-top: 1.9583vw;
  }
}
.promptInputContent ::v-deep .el-input{
    font-size: 1.7083vw;
  }
.promptInputContent ::v-deep .el-input .el-input__inner{
    height: 2.3333vw;
    padding: 0;
    background-color: rgba(255, 255, 255, 0);
    color: #fff;
    border: none;
  }
</style>

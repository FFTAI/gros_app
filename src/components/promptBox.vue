<template>
  <div class="wrapper flex-center">
    <div class="prompt vertically-centered common-font">
      <div class="promptContent" :style="promptContentWidth">
        <div class="promptTxt">
          <el-input v-model="robotVal" placeholder="输入需绑定机器人名"></el-input>
        </div>
      </div>
      <div class="btnBox flex-between">
        <div class="btn blue" @click="cancel()">{{ $t("cancel") }}</div>
        <div class="btn white01-bkg" @click="confirm()">
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
    robotVal: {
      type: String,
      default: "",
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
      if (this.prompt == "calibration" && this.$i18n.locale == "zh") style.width = "20vw";
      if (this.prompt == "calibration" && this.$i18n.locale == "en") style.width = "30vw";
      if (this.prompt == "reconnect" && this.$i18n.locale == "zh") style.width = "15vw";
      if (this.prompt == "reconnect" && this.$i18n.locale == "en") style.width = "20vw";
      return style;
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
    reconnect() {
      let main = plus.android.runtimeMainActivity();
      let Intent = plus.android.importClass("android.content.Intent");
      let mIntent = new Intent("android.settings.WIFI_SETTINGS");
      main.startActivity(mIntent);
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
</style>

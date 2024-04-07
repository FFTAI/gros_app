<template>
  <div class="tagBtn">
    <div
      class="tagItem flex-center"
      :class="{
        chosedTag: tagName('left'),
        chosedLeft: tagName('left'),
      }"
      style="width: 6.1667vw"
      @click="changeTag('left')"
    >
      <span v-if="speed!=''">{{ $t("slow") }}</span>
      <span v-if="height!=''">{{ $t("low") }}</span>
    </div>
    <div
      class="tagItem flex-center"
      :class="{
        chosedTag: tagName('center'),
      }"
      style="width: 6.1667vw"
      @click="changeTag('center')"
    >
      <span>{{ $t("middle") }}</span>
    </div>
    <div
      class="tagItem flex-center"
      :class="{
        chosedTag: tagName('right'),
        chosedRight: tagName('right'),
      }"
      style="width: 6.1667vw"
      @click="changeTag('right')"
    >
      <span v-if="speed!=''">{{ $t("fast") }}</span>
      <span v-if="height!=''">{{ $t("high") }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    speed: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tagName(e) {
        switch (e) {
          case "left":
            if (this.speed != "") return this.speed == "slow";
            if (this.height != "") return this.height == "low";
          case "center":
            if (this.speed != "") return this.speed == "middle";
            if (this.height != "") return this.height == "middle";
          case "right":
            if (this.speed != "") return this.speed == "fast";
            if (this.height != "") return this.height == "high";
          default:
            break;
        }
      },
    };
  },
  methods: {
    changeTag(e) {
        let val = ""
        switch (e) {
          case "left":
            if (this.speed != "")  val = "slow";
            if (this.height != "")  val = "low";
            break;
          case "center":
            if (this.speed != "")  val = "middle";
            if (this.height != "")  val = "middle";
            break;
          case "right":
            if (this.speed != "")  val = "fast";
            if (this.height != "")  val = "high";
            break;
          default:
            break;
        }
        // console.log(e,val)
      this.$emit("changeTag", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.tagBtn {
  width: 18.5833vw;
  height: 3.7083vw;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.625vw;
  display: flex;
  font-size: 1.4583vw;
  font-style: normal;
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
}
</style>
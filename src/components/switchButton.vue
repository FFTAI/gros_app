<template>
  <div class="switch" :class="{ isChecked: open }" @click="switchOpen()">
    <span class="switchCore"></span>
  </div>
</template>

<script>
export default {
  name: "switchButton",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    switchOpen() {
      this.$emit('openVal',!this.open)
    }
  }
};
</script>

<style lang="scss" scoped>
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
    height: 2.5833vw;
    outline: 0;
    border-radius: 1.2917vw;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.2);
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
  border-color: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
  background: linear-gradient(230deg, #198bff 0%, #0086d1 100%);
}

.switch.isChecked .switchCore::after {
  left: 100%;
  margin-left: -2.1667vw;
}
</style>
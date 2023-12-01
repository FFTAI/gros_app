<template>
  <div class="dialog-wrapper">
    <div class="connectDialog">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "rDialog",
  props: {},
};
</script>

<style lang="scss" scoped>
.dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.connectDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  width: 30.2083vw;
  height: 17.9167vw;
  background-image: url("../assets/images/image_dialog.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  font-size: 1.7083vw;
  font-family: Alibaba-PuHuiTi-M, Alibaba-PuHuiTi;
  font-weight: normal;
  color: #ffffff;
}
</style>

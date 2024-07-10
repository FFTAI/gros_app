<template>
  <div class="main flex-center common-bkg">
    <img class="logobk" src="../../assets/images/image_logo.png" />
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push({
        //首页logo3秒后跳转
        name: "connectionManagement",
      });
    }, 2000);
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-image: url("../../assets/images/image_bkg.png");
}
.logobk{
  width: 100vw;
  height: 56.25vw;
}
</style>

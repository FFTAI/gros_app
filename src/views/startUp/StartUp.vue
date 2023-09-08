<template>
    <div class="main">
        <img src="../../assets/images/image_logo.png" />
    </div>
</template>

<script>
export default {
    mounted() {
        setTimeout(() => {
            this.$router.push({//首页logo3秒后跳转
                name: 'login'
            })
        }, 3000);
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss">
.main {
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/images/image_bkg.png");
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
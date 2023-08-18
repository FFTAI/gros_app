<template>
    <div class="connectDialog">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "rDialog",
    props: {

    }
}
</script>

<style lang="scss" scoped>
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
}
</style>
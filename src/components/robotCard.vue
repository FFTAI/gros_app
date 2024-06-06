<template>
    <div class="rb-card">
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
</template>

<script>
export default {
    name: "",
    props: {
    },
    computed: {
    },
    data() {
        return {
            iframeUrl: "Build/index.html",
        };
    },
    mounted() {

    },
    methods: {
    },
};
</script>

<style lang="scss" scoped>
// @keyframes slideFromRightToLeft {
//   0% {
//     transform: translateX(100%);
//   }
//   100% {
//     transform: translateX(0);
//   }
// }

.rb-card {
    position: absolute;
    top: 6.25vw;
    left: 2.2396vw;
    width: 20.8333vw;
    height: 11.7188vw;
    background: rgba(233, 246, 255, 0.6);
    border-radius: .4167vw;
    z-index: 888;
    // animation: slideFromRightToLeft 2s ease-out forwards; /* 设置动画名称、时长、缓动函数和填充模式 */
}
</style>
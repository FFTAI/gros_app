<template>
  <div class="pc common-bkg">
    <div ref="sceneContainer"></div>
  </div>
</template>

<script>
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default {
  name: "PointCloud",
  data() {
    return {};
  },
  created() {},
  mounted() {
    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      120,
      this.$el.clientWidth / this.$el.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    this.$refs.sceneContainer.appendChild(renderer.domElement);

    // 创建点云材质
    const material = new THREE.PointsMaterial({ color: 0x44d8fb, size: 0.01 });

    // 加载CSV格式的点云数据
    const loader = new THREE.FileLoader();
    loader.load("./dianyun.Csv", (data) => {
      const geometry = new THREE.BufferGeometry();

      // 将CSV数据解析为Float32Array
      const lines = data.split("\n");
      console.log("dianyun", lines);
      const positions = new Float32Array(lines.length * 3);
      let index = 0;

      for (let i = 2; i < lines.length; i++) {
        const parts = lines[i].split(",");
        positions[index++] = parseFloat(parts[0]);
        positions[index++] = parseFloat(parts[1]);
        positions[index++] = parseFloat(parts[2]);
      }

      console.log(positions);

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const points = new THREE.Points(geometry, material);
      scene.add(points);
    });

    // 手动相机控制
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;

    const transformControls = new TransformControls(
      camera,
      renderer.domElement
    );
    renderer.domElement.addEventListener("mousemove", (event) => {
      x = event.offsetX;
      y = event.offsetY;
      width = renderer.domElement.offsetWidth;
      height = renderer.domElement.offsetHeight;
      mouse.x = (x / width) * 2 - 1;
      mouse.y = (-y * 2) / height + 1;
    });
    let transing = false;
    transformControls.addEventListener("mouseDown", (event) => {
      transing = true;
      return event;
    });
    // 鼠标点击事件
    renderer.domElement.addEventListener("click", (event) => {
      if (transing) {
        transing = false;
        return;
      }
      scene.remove(transformControls); // 移除变换控制器
      transformControls.enabled = false; // 停用变换控制器
      raycaster.setFromCamera(mouse, camera); // 配置射线发射器，传递鼠标和相机对象
      const intersection = raycaster.intersectObjects(scene.children); // 获取射线发射器捕获的模型列表，传进去场景中所以模型，穿透的会返回我们
      if (intersection.length) {
        const object = intersection[0].object; // 获取第一个模型
        console.log(object);
        scene.add(transformControls); // 添加变换控制器
        transformControls.enabled = true; // 启用变换控制器
        transformControls.attach(object);
      }
      return event;
    });

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.mouseButtons = {
      // 设置鼠标功能键（轨道控制器）
      LEFT: null, // 左键无事件
      MIDDLE: THREE.MOUSE.DOLLY, // 中键缩放
      RIGHT: THREE.MOUSE.ROTATE, // 右键旋转
    };
    scene.add(transformControls);

    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.pc {
  position: relative;
  background-color: #d6eaff;
}
</style>
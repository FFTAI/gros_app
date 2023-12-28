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
    return {
      pcData: [],
      scene: null,
      camera: null,
      renderer: null,
      points: null,
    };
  },
  created() {},
  mounted() {
    this.$bus.$on("robotOnmessage", (data) => {
      this.pcData.push(...data.data);
      console.log("pointcloud===========", this.pcData);
      this.updatePointCloud();
    });
    this.createPc();
    this.addHelpers();
  },
  destroyed() {
    this.$bus.$off("robotOnmessage");
  },
  methods: {
    createPc() {
      // 创建场景
      this.scene = new THREE.Scene();

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(
        120,
        this.$el.clientWidth / this.$el.clientHeight,
        0.1,
        1000
      );
      // this.camera.position.z = 15;
      this.camera.position.set(0, 0, 15);
      // this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
      this.$refs.sceneContainer.appendChild(this.renderer.domElement);

      // 创建点云材质
      const material = new THREE.PointsMaterial({
        color: 0x44d8fb,
        size: 0.05,
      });

      material.onBeforeCompile = (shader) => {
        //修改片元着色器
        shader.fragmentShader = shader.fragmentShader.replace(
          `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
          `float d=distance(gl_PointCoord, vec2(0.5, 0.5));if(d>0.5) discard;gl_FragColor = vec4(outgoingLight , diffuseColor.a );`
        );
      };

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
        this.scene.add(points);
      });
      // const geometry = new THREE.BufferGeometry();
      // const positions = new Float32Array(0);
      // const colors = new Float32Array(0);

      // geometry.setAttribute(
      //   "position",
      //   new THREE.BufferAttribute(positions, 3)
      // );
      // geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // this.points = new THREE.Points(geometry, material);
      // this.scene.add(this.points);

      // 手动相机控制
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;

      const transformControls = new TransformControls(
        this.camera,
        this.renderer.domElement
      );
      this.renderer.domElement.addEventListener("mousemove", (event) => {
        x = event.offsetX;
        y = event.offsetY;
        width = this.renderer.domElement.offsetWidth;
        height = this.renderer.domElement.offsetHeight;
        mouse.x = (x / width) * 2 - 1;
        mouse.y = (-y * 2) / height + 1;
      });
      let transing = false;
      transformControls.addEventListener("mouseDown", (event) => {
        transing = true;
        return event;
      });
      // 鼠标点击事件
      this.renderer.domElement.addEventListener("click", (event) => {
        if (transing) {
          transing = false;
          return;
        }
        this.scene.remove(transformControls); // 移除变换控制器
        transformControls.enabled = false; // 停用变换控制器
        raycaster.setFromCamera(mouse, this.camera); // 配置射线发射器，传递鼠标和相机对象
        const intersection = raycaster.intersectObjects(this.scene.children); // 获取射线发射器捕获的模型列表，传进场景中模型，返回穿透
        if (intersection.length) {
          const object = intersection[0].object; // 获取第一个模型
          console.log(object);
          this.scene.add(transformControls); // 添加变换控制器
          transformControls.enabled = true; // 启用变换控制器
          transformControls.attach(object);
        }
        return event;
      });

      const orbitControls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      orbitControls.mouseButtons = {
        // 设置鼠标功能键（轨道控制器）
        LEFT: null, // 左键无事件
        MIDDLE: THREE.MOUSE.DOLLY, // 中键缩放
        RIGHT: THREE.MOUSE.ROTATE, // 右键旋转
      };
      this.scene.add(transformControls);

      // 渲染循环
      const animate = () => {
        requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
      };

      animate();
    },
    updatePointCloud() {
      const geometry = this.points.geometry;
      const positions = new Float32Array(this.pcData.length * 3);
      const colors = new Float32Array(this.pcData.length * 3);
      let index = 0;

      this.pcData.forEach((point) => {
        positions[index++] = point.x;
        positions[index++] = point.y;
        positions[index++] = point.z;

        const reflectivity = point.r / 255;
        colors[index - 3] = reflectivity;
        colors[index - 2] = 0;
        colors[index - 1] = 1 - reflectivity;
      });

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const colors11 = new Float32Array([
            1, 0, 0, //顶点1颜色
            0, 1, 0, //顶点2颜色
            0, 0, 1, //顶点3颜色
            1, 1, 0, //顶点4颜色
            0, 1, 1, //顶点5颜色
            1, 0, 1, //顶点6颜色
       ]);
       console.log(colors11)
      console.log(colors)
      geometry.attributes.color = new THREE.BufferAttribute(colors, 3)

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    },
    addHelpers() {
      // 添加网格辅助线
      const gridHelper = new THREE.GridHelper(200, 20);
      gridHelper.position.set(0, -10, 0);
      this.scene.add(gridHelper);

    },
  },
};
</script>

<style lang="scss" scoped>
.pc {
  position: relative;
  background-color: #d6eaff;
}
</style>
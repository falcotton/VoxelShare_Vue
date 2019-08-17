<template>
  <div>
    <div v-show="isRendering">
      <v-layout justify-center>
        <v-progress-circular :size="200" :width="20" indeterminate color="primary"></v-progress-circular>
      </v-layout>
    </div>
    <div v-show="!isRendering" id="view_field" ref="view_field"></div>
  </div>
</template>
<script>
import * as THREE from "three";
import axios from "axios";
import aws_exports from "../aws-exports";

const OrbitControls = require("three-orbit-controls")(THREE);

export default {
  name: "ModelField",
  props: {
    modelpath: {
      type: String
    }
  },
  data() {
    // === scene ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // === renderer ===
    const renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true
    });

    // === camera ===
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    //===OrbitControl===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // === light ===
    var ambientLight = new THREE.AmbientLight(0xd0d0d0);
    const directionalLight = new THREE.DirectionalLight(0x000000);
    directionalLight.position.set(1000, 1000, 1000).normalize();

    let response_status;
    let isRendering = true;
    return {
      scene: scene,
      renderer: renderer,
      camera: camera,
      ambientLight: ambientLight,
      directionalLight: directionalLight,
      gridHelper: null,
      voxel: null,
      loop: true,
      response_status: response_status,
      isRendering: isRendering
    };
  },

  created() {
    let that = this;
    let ModelPath = that.modelpath;

    axios
      .get(
        `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/${ModelPath}`
      )
      .then(response => {
        const startTime = performance.now();

        let metadata = response["data"]["metadata"];
        let vertex = response["data"]["vertex"];
        let faces = response["data"]["face"];
        let color = response["data"]["color"];

        // === girdhelper ===
        const gridsize = Math.max(
          metadata["fieldsize"][0],
          metadata["fieldsize"][2]
        );
        that.gridHelper = new THREE.GridHelper(gridsize, gridsize);
        that.gridHelper.castShadow = true;
        that.scene.add(that.gridHelper);

        that.camera.position.set(
          metadata["fieldsize"][0] * 0,
          metadata["fieldsize"][1],
          -metadata["fieldsize"][2] * 1.5
        );
        that.camera.lookAt(0, 5, 0);

        // === model ===
        var material = new THREE.MeshLambertMaterial({
          vertexColors: THREE.FaceColors
        });
        material.side = THREE.DoubleSide;

        //create a triangular geometry
        var geometry = new THREE.Geometry();

        var normal = new THREE.Vector3(0, 0, 0); //optional
        var materialIndex = 0; //optional

        for (let i in vertex) {
          //console.log(vertex[i]);
          geometry.vertices.push(
            new THREE.Vector3(
              -vertex[i][0] * 1 + gridsize / 2,
              vertex[i][1] * 1,
              vertex[i][2] * 1 - gridsize / 2
            )
          );
        }
        for (let i in faces) {
          let colorindex = faces[i][3];
          let facecolor = new THREE.Color(parseInt(color[colorindex], 16)); //optional
          let face = new THREE.Face3(
            faces[i][0],
            faces[i][1],
            faces[i][2],
            normal,
            facecolor,
            materialIndex
          );
          geometry.faces.push(face);
        }

        geometry.computeFaceNormals();
        //下を入れると面の描画が汚くなる
        //geometry.computeVertexNormals();
        that.voxel = new THREE.Mesh(geometry, material);
        that.scene.add(that.voxel);
        let canvas = document.getElementsByTagName("canvas")[0];

        canvas.getContext("experimental-webgl", {
          preserveDrawingBuffer: true
        });

        const endTime = performance.now();
        console.log("Renderring Time", endTime - startTime);
        that.isRendering = false;
      })
      .catch(e => console.log(e));

    this.scene.add(this.camera);
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
  },
  mounted() {
    this.$refs.view_field.appendChild(this.renderer.domElement);
    this.animate();
  },
  methods: {
    animate() {
      if (!this.$refs.view_field) {
        return;
      }
      this.renderer.setSize(
        this.$refs.view_field.clientWidth,
        (window.innerHeight / window.innerWidth) *
          this.$refs.view_field.clientWidth
      );
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);

      if (this.loop) {
        requestAnimationFrame(this.animate);
      }
    }
  },
  beforeDestroy() {
    this.loop = false;
  }
};
</script>

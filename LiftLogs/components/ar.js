import React from "react";
import { StyleSheet, Text, View, PixelRatio, Dimensions } from 'react-native';
import { AR } from "expo";
import ExpoTHREE, { THREE } from "expo-three"
import { View as GraphicsView } from 'expo-graphics';
import { Camera as ARCamera, BackgroundTexture as ARbg } from 'expo-three-ar';
import 'three';
// import { THREE } from 'three';

export default class Ar extends React.Component {
  render() {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
      // isArEnabled
      // arTrackingConfiguration={AR.TrackingConfigurations.World}
      // // Bonus: debug props
      // isArRunningStateEnabled
      // isArCameraStateEnabled
      />
    );
  }

  // onContextCreate = async ({ gl, scale: PixelRatio, width, height }) => {
  onContextCreate = async gl => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scale = PixelRatio.get();

    // renderer
    this.renderer = new ExpoTHREE.Renderer(
      gl,
    );
    console.log('hi');
    this.renderer.capabilities.maxVertexUniforms = 52502;
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width / scale, height / scale);
    this.renderer.setClearColor(0x000000, 1.0);

    /// Standard Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    this.camera.position.set(0, 6, 12);
    this.camera.lookAt(0, 0, 0);

    this.setupScene();
    await this.loadModelsAsync().catch(e => console.log);

    // AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // // not sure what the width and height variables are coming from and why
    // // they are so wrong

    // // had to define these constants
    // const screenWidth = Math.round(Dimensions.get('window').width);
    // const screenHeight = Math.round(Dimensions.get('window').height);

    // // Create a 3D renderer
    // this.renderer = new ExpoTHREE.Renderer({
    //   gl,
    //   PixelRatio,
    //   screenWidth,
    //   screenHeight,
    // });

    // // We will add all of our meshes to this scene.
    // this.scene = new THREE.Scene();

    // this.camera = new ARCamera(screenWidth, screenHeight, 0.01, 1000);
    // // this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    // this.scene.background = new ARbg(this.renderer);

    // // Define our shape (Below is a tetrahedron, but can be whatever)
    // const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0);
    // // Define the material, Below is material with hex color #00ff00
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // // Define the full 3-D object
    // const objectToRender = new THREE.Mesh(geometry, material);

    // this.scene.add(objectToRender);
    // await this.loadModelsAsync();
    // this.scene.add(new THREE.AmbientLight(0xffffff));
  };

  setupScene = () => {
    // scene
    this.scene = new THREE.Scene();

    // Standard Background
    this.scene.background = new THREE.Color(0x999999);
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    this.scene.add(new THREE.GridHelper(50, 50, 0xffffff, 0x555555));

    this.setupLights();
  };

  setupLights = () => {
    // lights
    const directionalLightA = new THREE.DirectionalLight(0xffffff);
    directionalLightA.position.set(1, 1, 1);
    this.scene.add(directionalLightA);

    const directionalLightB = new THREE.DirectionalLight(0xffeedd);
    directionalLightB.position.set(-1, -1, -1);
    this.scene.add(directionalLightB);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this.scene.add(ambientLight);
  };

  // Magic happens here!
  loadModelsAsync = async () => {
    // Get all the files in the mesh
    const model = {
      'thomas.obj': require('./../thomas/thomas.obj'),
      'thomas.mtl': require('./../thomas/thomas.mtl'),
      'thomas.png': require('./../thomas/thomas.png'),
    };

    /// Load model!
    const mesh = await ExpoTHREE.loadAsync(
      [model['thomas.obj'], model['thomas.mtl']],
      null,
      name => model[name],
    );

    /// Update size and position
    ExpoTHREE.utils.scaleLongestSideToSize(mesh, 5);
    ExpoTHREE.utils.alignMesh(mesh, { y: 1 });
    /// Smooth mesh
    // ExpoTHREE.utils.computeMeshNormals(mesh);

    /// Add the mesh to the scene
    this.scene.add(mesh);

    /// Save it so we can rotate
    this.mesh = mesh;
  };

  onRender = (delta) => {
    this.mesh.rotation.y += 0.4 * delta;
    this.renderer.render(this.scene, this.camera);
  };

  onResize = ({ width, height }) => {
    const scale = PixelRatio.get();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);
    // ExpoTHREE.suppressWarnings();
  }

}
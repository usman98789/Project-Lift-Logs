import React from "react";
import { StyleSheet, Text, View, PixelRatio, Dimensions } from 'react-native';
import { AR } from "expo";
import ExpoTHREE, { THREE as eTHREE } from "expo-three"
import { View as GraphicsView } from 'expo-graphics';
import { Camera as ARCamera, BackgroundTexture as ARbg } from 'expo-three-ar';
import { THREE } from 'three';

export default class Ar extends React.Component {
  render() {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        isArEnabled
        arTrackingConfiguration={AR.TrackingConfigurations.World}
        // // Bonus: debug props
        isArRunningStateEnabled
        isArCameraStateEnabled
      />
    );
  }

  onContextCreate = async ({ gl, scale: PixelRatio, width, height }) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // not sure what the width and height variables are coming from and why
    // they are so wrong

    // had to define these constants
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      PixelRatio,
      screenWidth,
      screenHeight,
    });

    // We will add all of our meshes to this scene.
    this.scene = new eTHREE.Scene();

    this.camera = new ARCamera(screenWidth, screenHeight, 0.01, 1000);
    // this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.scene.background = new ARbg(this.renderer);

    // Define our shape (Below is a tetrahedron, but can be whatever)
    const geometry = new eTHREE.TetrahedronBufferGeometry(0.1, 0);
    // Define the material, Below is material with hex color #00ff00
    const material = new eTHREE.MeshBasicMaterial({ color: 0x00ff00 });
    // Define the full 3-D object
    const objectToRender = new eTHREE.Mesh(geometry, material);

    this.scene.add(objectToRender);
    await this.loadModelsAsync();

    // // instantiate a loader
    // var loader = new THREE.AnimationLoader();

    // // load a resource
    // loader.load(
    //   // resource URL
    //   '../mike/mike_test_three.js',

    //   // onLoad callback
    //   function (animations) {
    //     // animations is an array of AnimationClips
    //     this.scene(animationns)
    //   },

    //   // onProgress callback
    //   function (xhr) {
    //     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //   },

    //   // onError callback
    //   function (err) {
    //     console.log('An error happened');
    //   }
    // );



    // const mesh = await ExpoTHREE.loadObjAsync({ asset: require('../mike/mike_test.obj') });
    // this.scene.add(mesh);

    // let objLoader = THREE.ObjectLoader();
    // objLoader.setPath('../mike/');
    // objLoader.load('mike_test.obj', (object) => {
    //   this.scene.add(object);
    // });





    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   objectToRender.rotation.x += 0.01;
    //   objectToRender.rotation.y += 0.01;
    //   this.mesh.rotation.y += 0.01;
    //   this.mesh.rotation.x += 0.01;
    //   this.renderer.render(this.scene, this.camera);
    //   gl.endFrameEXP();
    // };
    // animate();

    this.scene.add(new eTHREE.AmbientLight(0xffffff));
  }

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

  onRender = () => {
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
    eTHREE.suppressExpoWarnings(true);
    // ExpoTHREE.suppressWarnings();
  }

}
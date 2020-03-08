import React from "react";
import { StyleSheet, Text, View, PixelRatio, Dimensions } from 'react-native';
import { AR } from "expo";
import ExpoTHREE, {THREE} from "expo-three"
import { View as GraphicsView } from 'expo-graphics';
import { Camera as ARCamera, BackgroundTexture as ARbg } from 'expo-three-ar';


export default class Ar extends React.Component {
  render() {
    return(         
      <GraphicsView
        style={{ flex: 1}}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        isArEnabled
        arTrackingConfiguration={AR.TrackingConfigurations.World}
        // // Bonus: debug props
        isArRunningStateEnabled
        isArCameraStateEnabled
      />
    );
  }

  onContextCreate = async ({gl, scale: PixelRatio, width, height}) => {
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // not sure what the width and height variables are coming from and why
    // they are so wrong

    // had to define these constants
    const screenWidth =  Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      PixelRatio,
      screenWidth,
      screenHeight,
    });

    // We will add all of our meshes to this scene.
    this.scene = new THREE.Scene();

    this.camera = new ARCamera(screenWidth, screenHeight, 0.01, 1000);
    // this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.scene.background = new ARbg(this.renderer);

    // Define our shape (Below is a tetrahedron, but can be whatever)
    const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0);
    // Define the material, Below is material with hex color #00ff00
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // Define the full 3-D object
    const objectToRender = new THREE.Mesh(geometry, material);

    this.scene.add(objectToRender);

    const animate = () => {      
      requestAnimationFrame(animate);      
      objectToRender.rotation.x += 0.01;      
      objectToRender.rotation.y += 0.01;      
      this.renderer.render(this.scene, this.camera);      
      gl.endFrameEXP();    
    };
    animate();

    this.scene.add(new THREE.AmbientLight(0xffffff));
  }

  onRender = () => {
    this.renderer.render(this.scene, this.camera);
  };

  componentDidMount() {
    // Turn off extra warnings
    THREE.suppressExpoWarnings(true);
    // ExpoTHREE.suppressWarnings();
  }

}
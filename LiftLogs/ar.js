import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { GLView } from "expo-gl";
// import Expo from "expo";
import * as THREE from "three";
import ExpoTHREE from "expo-three"


export default class Ar extends React.Component {
  render() {
    return(       
      <GLView
        ref={(ref) => this._glView = ref}
        style={{ flex: 1 }}           
        onContextCreate={this._onGLContextCreateAR}/>    
    );
  }
  
  _onGLContextCreateAr = async(gl) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    const arSession = await this._glView.startARSessionAsync();

    const scene = new THREE.Scene();
    const camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);

    // Edit the box dimensions here and see changes immediately!
    const geometry = new THREE.BoxGeometry(0.07, 0.07, 0.07);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = -0.4;
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.07;
      cube.rotation.y += 0.04;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  }

  _onGLContextCreate = async (gl) => {
    // Here is where we will define our scene, camera and renderer
    // 1. Scene
    var scene = new THREE.Scene(); 
    // // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    // // 3. Renderer
    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Define our shape (Below is a tetrahedron, but can be whatever)
    const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0);
    // Define the material, Below is material with hex color #00ff00
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // Define the full 3-D object
    const objectToRender = new THREE.Mesh(geometry, material);

    // Specifying the cameras Z position will allow the object to appear in front of the camera rather that in line (which the camera which is the default)
    camera.position.z = 2;

    scene.add(objectToRender);

    const animate = () => {      
      requestAnimationFrame(animate);      
      objectToRender.rotation.x += 0.01;      
      objectToRender.rotation.y += 0.01;      
      renderer.render(scene, camera);      
      gl.endFrameEXP();    
    };
    animate();
  }
}
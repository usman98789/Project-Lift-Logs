import 'prop-types';
import 'three';

import ExpoGraphics from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import { PixelRatio } from 'react-native';
require('../FBXLoader.js');

export default class Scene extends React.Component {
    render() {
        return (
            <ExpoGraphics.View
                style={{ flex: 1 }}
                onContextCreate={this.onContextCreate}
                onRender={this.onRender}
                onResize={this.onResize}
            />
        );
    }

    onContextCreate = async ({ gl }) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const scale = PixelRatio.get();

        this.renderer = new ExpoTHREE.Renderer({
            gl,
        });

        this.renderer.capabilities.maxVertexUniforms = 52502;
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width / scale, height / scale);
        this.renderer.setClearColor(0x000000, 1.0);

        /// Standard Camera
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
        this.camera.position.set(0, 6, 12);
        this.camera.lookAt(0, 0, 0);

        this.setupScene();
        await this.loadModelsAsync();
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

    /// Magic happens here!    
    loadModelsAsync = async () => {
        /// Get all the files in the mesh
        // const model = {
        //     'thomas.obj': require('../thomas/thomas.obj'),
        //     'thomas.mtl': require('../thomas/thomas.mtl'),
        //     'thomas.png': require('../thomas/thomas.png'),
        // };

        // /// Load model!
        // const mesh = await ExpoTHREE.loadAsync(
        //     [model['thomas.obj'], model['thomas.mtl']],
        //     null,
        //     name => model[name],
        // );

        const model = {
            // 'mike_test_no_ss.fbx': require('../mike/mike_test_no_ss.fbx'),
            'mike_test.obj': require('../mike/mike_test_2.obj'),
            'mike_test.mtl': require('../mike/mike_test_2.mtl'),
            // 'mike.png': require('../mike/mike.png'),
        };

        /// Load model!
        const mesh = await ExpoTHREE.loadAsync(
            // [model['mike_test_no_ss.fbx']],//, model['mike_test.mtl']],
            [model['mike_test.obj'], model['mike_test.mtl']],
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

    onResize = ({ width, height }) => {
        const scale = PixelRatio.get();

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(scale);
        this.renderer.setSize(width, height);
    };

    onRender = delta => {
        this.mesh.rotation.y += 0.4 * delta;
        this.renderer.render(this.scene, this.camera);
    };
}

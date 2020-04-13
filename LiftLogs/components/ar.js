import "three";
import { AR } from "expo";
import ExpoGraphics from "expo-graphics";
import ExpoTHREE, { THREE } from "expo-three";
import {
	Camera as ARCamera,
	BackgroundTexture as ARbg,
	MagneticObject
} from "expo-three-ar";
import React from "react";
import { PixelRatio, Dimensions } from "react-native";

export default class Ar extends React.Component {
	constructor(props) {
		super(props);
	}

	UNSAFE_componentWillMount() {
		THREE.suppressExpoWarnings(true);
		ExpoTHREE.THREE.suppressExpoWarnings(true);
		console.disableYellowBox = true;
	}

	render() {
		return (
			<ExpoGraphics.View
				key={this.props.chosen}
				style={{ flex: 1 }}
				onContextCreate={this.onContextCreate}
				isArEnabled
				arTrackingConfiguration={AR.TrackingConfigurations.World}
				onRender={this.onRender}
				onResize={this.onResize}
			/>
		);
	}

	onContextCreate = async ({ gl }) => {
		AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

		const screenWidth = Math.round(Dimensions.get("window").width);
		const screenHeight = Math.round(Dimensions.get("window").height);

		const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
		const scale = PixelRatio.get();

		this.renderer = new ExpoTHREE.Renderer({
			gl
		});

		this.renderer.capabilities.maxVertexUniforms = 52502;
		this.renderer.setPixelRatio(scale);
		this.renderer.setSize(width / scale, height / scale);
		this.renderer.setClearColor(0x000000, 1.0);

		this.camera = new ARCamera(screenWidth, screenHeight, 0.001, 10000000);
		this.camera.position.set(0, 6, 12);
		this.camera.lookAt(0, 0, 0);

		this.setupScene();

		await this.loadModelsAsync();
	};

	setupScene = () => {
		// scene
		this.scene = new THREE.Scene();

		this.scene.background = new ARbg(this.renderer);
		this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

		this.setupLights();
	};

	setupLights = () => {
		const directionalLightA = new THREE.DirectionalLight(0xffffff);
		directionalLightA.position.set(1, 1, 1);
		this.scene.add(directionalLightA);

		const directionalLightB = new THREE.DirectionalLight(0xffeedd);
		directionalLightB.position.set(-1, -1, -1);
		this.scene.add(directionalLightB);

		const ambientLight = new THREE.AmbientLight(0x222222);
		this.scene.add(ambientLight);
	};

	loadModelsAsync = async () => {
		let temp = "";
		let i = 0;
		if (this.props.chosen === "Stretch") {
			model = { "sci_fi5.fbx": require("../FBX/sci_fi5.fbx") };
			temp = "sci_fi5.fbx";
		} else if (this.props.chosen === "Walk") {
			model = { "base.fbx": require("../FBX/base.fbx") };
			temp = "base.fbx";
		}

		const obj = await ExpoTHREE.loadAsync(
			model[temp],
			null,
			name => model[name]
		);

		this.mixer = new THREE.AnimationMixer(obj);
		this.action = this.mixer.clipAction(obj.animations[i]);
		this.action.play();

		if (this.props.chosen === "Walk") obj.rotation.x += 11;
		ExpoTHREE.utils.scaleLongestSideToSize(obj, 0.25);
		obj.scale.multiplyScalar(1.5);
		0;
		obj.matrixWorld.setPosition(new THREE.Vector3(1000, 0, 0));

		this.scene.add(obj);
	};

	onResize = ({ width, height }) => {
		const scale = PixelRatio.get();

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setPixelRatio(scale);
		this.renderer.setSize(width, height);
	};

	onRender = delta => {
		this.renderer.render(this.scene, this.camera);
		this.mixer.update(delta);
	};
}

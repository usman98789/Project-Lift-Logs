import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroBox,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
} from 'react-viro';

export default function App() {
  return (
  <ViroARScene onTrackingUpdated={this._onInitialized} >
    <Viro3DObject source={require('./res/object_coffee_mug.vrx')}
              // resources={[require('./res/texture1.jpg'),
              //             require('./res/texture2.jpg'),
              //             require('./res/texture3.jpg')]}
              position={[0.0, 0.0, -10]}
              scale={[0.1, 0.1, 0.1]}
              type="VRX"
    />
  </ViroARScene>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

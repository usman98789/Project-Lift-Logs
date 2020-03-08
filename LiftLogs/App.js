import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ar from "./components/ar.js";

export default function App() {
  return (
    <Ar/>
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

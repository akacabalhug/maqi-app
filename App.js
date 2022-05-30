import React, { useState, useEffect } from "react";
import init from "react-native-mqtt";
import { AsyncStorage } from "react-native";
import ClassMqtt from "./components/Class/";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorageStatic,
  Button,
} from "react-native";
import MQTTConnection from "./src/MQTTConnection";
import Constants from "expo-constants";
import * as Location from "expo-location";
import Header from "./components/header";
import { Buffer } from "buffer";
global.Buffer = Buffer;

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [pressed]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>

        <ClassMqtt />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});


        {/* <Button
          title="Send data"
          onPress={() => {
            this.mqttConnect.send(
              "tb/mqtt-integration-tutorial/sensors/Device_2/temperature",
              "{'temperature':42}"
            );
            setPressed(!pressed);
          }}
        /> */}
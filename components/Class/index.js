import React, { Component } from "react";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { AppState, Platform, StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import init from "react_native_mqtt";
import * as Location from "expo-location";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default class ClassMqtt extends Component {
  constructor(props) {
    super(props);
    //this.manager = new BleManager();
    this.state = {
      info: null,
      device: null,
      latitude: null,
      longitude: null,
      time: null,
      counter: null,
      key: null,
      payload: null,
      error: null,
      con_type: null,
      values: {},
    };
  }

  updateValues(key, value) {
    this.setState({
      values: {
        ...this.state.values,
        [key]: value,
      },
    });
  }

  info(message) {
    this.setState({ info: message });
  }

  error(message) {
    this.setState({
      info: "Error" + message,
    });
  }

  counter(message) {
    this.setState({ counter: message });
  }

  key(message) {
    this.setState({ key: message });
  }

  payload(message) {
    this.setState({ payload: message });
  }

  con_type(message) {
    this.setState({ con_type: message });
  }

  dump(message) {
    this.setState({ dump: message });
  }

  dump_data(message) {
    this.setState({ dump_data: message });
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
    this.watchId = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 20000,
        distanceInterval: 10,
      },
      (position) => {
        // console.log("position", position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          time: position.timestamp,
          error: null,
        });
      }
    );
    //NetInfo.addEventListener("connectionChange", (connectionInfo) => {
    NetInfo.addEventListener((connectionInfo) => {
      if (connectionInfo.type == "wifi" || connectionInfo.type == "cellular") {
        console.log("connection type", connectionInfo.type);
        //this.dump_mem()
      } else {
        this.dump("Change is not to Wifi");
      }
    });
    this.send_payload({
      temperature: 25,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      altitude: 33.1589241027832,
      humidity: 30,
      pm10: 10,
      pm25: 3,
    });
  }

  UNSAFE_componentWillMount() {
    clearInterval(this.intervalID);
    console.log("mounted");
    NetInfo.fetch().then((connectionInfo) => {
      this.con_type(connectionInfo.type);
      const isWifiOrCell = this.state.con_type;
      if (isWifiOrCell == "wifi" || isWifiOrCell == "cellular") {
        console.log("this.con_type", this.con_type);
        console.log("state con_type", this.state.con_type);
        this.con_type(isWifiOrCell);
        //this.dump_mem();
      } else {
        this.con_type(isWifiOrCell);
      }
    });
    // const subscription = this.manager.onStateChange((state) => {
    //   if (state == "PoweredOn") {
    //     this.scanAndConnect();
    //     subscription.remove();
    //   }
    // }, true)console.log("latitude", this.state.latitude);
  }

  tick() {
    this.setState({ time: new Date().toLocaleString() });
  }

  // scanAndConnect() {
  //   this.manager.startDeviceScan(null, null, (error, device) => {
  //     console.log(device);
  //     if (error) {
  //       this.error(error.message);
  //       this.scanAndConnect();
  //       return;
  //     }
  //     if (device_name == "CoE 199") {
  //       this.info("Connecting to CoE 198");
  //       console.log("Connecting to CoE 198");
  //       this.manager.stopDeviceScan();
  //       device
  //         .connect({ requestMTU: 180 })
  //         .then((device) => {
  //           this.info("Discovering services and characteristics");
  //           console.log("Discovering services and characteristics");
  //           return device.discoverAllServicesAndCharacteristics();
  //         })
  //         .then((device) => {
  //           this.info("Setting notifications");
  //           console.log("Setting notifications");
  //           return this.setupNotifications(device);
  //         })
  //         .then((device) => {
  //           this.info("Connected to BLE");
  //           console.log("Connected to BLE");
  //         })
  //         .catch((error) => {
  //           this.error(error.message);
  //           this.scanAndConnect();
  //         });
  //     }
  //   });
  // }

  // async setupNotifications(device) {
  //   device.writeCharacteristicWithoutResponseForService(
  //     "000000ff-0000-1000-8000-00805f9b34fb",
  //     "0000ff01-0000-1000-8000-00805f9b34fb",
  //     "AQA="
  //   );
  //   device.monitorCharacteristicForService(
  //     "000000ff-0000-1000-8000-00805f9b34fb",
  //     "0000ff01-0000-1000-8000-00805f9b34fb",
  //     (error, characteristic) => {
  //       if (error) {
  //         this.error(error.message);
  //         this.scanAndConnect();
  //         return;
  //       }
  //       this.updateValue(characteristic.uuid, characteristic.value);
  //       const data = this.state.values["0000ff01-0000-1000-8000-00805f9b34fb"];
  //       const long = this.state.longitude;
  //       const lat = this.state.latitude;
  //       const timestamp = this.state.time;
  //       const time_epoch = Date.parse(timestamp);
  //       const decode_data = base64.decode(data);
  //       const split_data = decode_data.split("-", 1);
  //       const long_readable = '"longitude":"' + long + '",';
  //       const lat_readable = '"latitude":"' + lat + '"' + "}}";
  //       const time_readable = '{"ts":"' + time_epoch + '",';
  //       const long_base64 = base64.encode(long_readable);
  //       const lat_base64 = base64.encode(lat_readable);
  //       const time_base64 = base64.encode(time_readable);
  //       // this.server_data(split_data);
  //       // this.server_long(long_readable);
  //       // this.server_lat(lat_readable);
  //       // this.server_time(time_readable);
  //       device.writeCharacteristicWithoutResponseForService(
  //         "000000ff-0000-1000-8000-00805f9b34fb",
  //         "0000ff02-0000-1000-8000-00805f9b34fb",
  //         long_base64
  //       );
  //       device.writeCharacteristicWithoutResponseForService(
  //         "000000ff-0000-1000-8000-00805f9b34fb",
  //         "0000ff03-0000-1000-8000-00805f9b34fb",
  //         lat_base64
  //       );
  //       device.writeCharacteristicWithoutResponseForService(
  //         "000000ff-0000-1000-8000-00805f9b34fb",
  //         "0000ff04-0000-1000-8000-00805f9b34fb",
  //         time_base64
  //       );
  //       const mqtt_payload =
  //         "" + time_readable + split_data + long_readable + lat_readable;
  //       this.payload(mqtt_payload);

  //       NetInfo.getConnectionInfo().then((connectionInfo) => {
  //         this.con_type(connectionInfo.type);
  //         const isWifi = this.state.con_type;
  //         if (isWifi == "wifi" || isWifi == "cellular") {
  //           this.save_payload(mqtt_payload);
  //           this.send_payload(mqtt_payload);
  //         } else {
  //           this.save_payload(mqtt_payload);
  //         }
  //       });
  //     }
  //   );
  // }

  async dump_mem() {
    // Send and Delete Entries in memory
    this.dump("Dumping All Contents!");
    this.dump_data("Dumping current Content");
    var message = "";
    await AsyncStorage.removeItem("counter");
    client = new Paho.MQTT.Client("3.0.58.83", 8083, "/mqtt", "");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
    var dump_counter = 0;
    async function onConnect() {
      while (dump_counter < 64) {
        const dump_key = "mqtt_payload_" + dump_counter;
        const mqtt_payload_dump = await AsyncStorage.getItem(dump_key);
        if (mqtt_payload_dump == null) {
          dump_counter = 64;
        } else {
          message = new Paho.MQTT.Message(
            mqtt_payload_dump,
            "v1/devices/me/telemetry",
            1,
            0
          );
          message.destinationName = "v1/devices/me/telemetry";
          client.publish(message);
          await AsyncStorage.removeItem(dump_key);
          dump_counter = dump_counter + 1;
        }
      }
    }
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    }
    function onMessageArrived(message) {
      console.log("onMessageArrived:" + message.payloadString);
    }
    return;
  }

  async save_payload(item) {
    // Save from mqtt_payload_0 to mqtt_payload_64
    var value = await AsyncStorage.getItem("counter");
    if (value == null || value == "64") {
      await AsyncStorage.setItem("counter", "0");
      value = await AsyncStorage.getItem("counter");
    } else {
      value = await AsyncStorage.getItem("counter");
    }
    this.counter(value);
    const key = "mqtt_payload_" + value;
    this.key(key);
    await AsyncStorage.setItem(key, item);
    const payload = await AsyncStorage.getItem(key);
    this.payload(payload);
    const val_int = parseInt(value);
    const new_val_int = val_int + 1;
    const new_val = "" + new_val_int;
    await AsyncStorage.setItem("counter", new_val);
    return;
  }

  async send_payload(item) {
    console.log("payload", JSON.stringify(item));
    client = new Paho.MQTT.Client("13.215.176.140", 8083, "/mqtt", "");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect, onFailure: onConnectionLost });
    function onConnect() {
      console.log("connected");
      const message = new Paho.MQTT.Message(
        JSON.stringify(item),
        "v1/devices/me/telemetry",
        1,
        0
      );
      message.destinationName = "v1/devices/me/telemetry";
      client.publish(message);
      console.log("Done publishing");
    }
    function onConnectionLost(responseObject) {
      console.log("disconnected");
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    }
    function onMessageArrived(message) {
      console.log("onMessageArrived:" + message.payloadString);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info}> {this.state.info}</Text>
        <Text style={styles.welcome}>Welcome to BLE Daemon!</Text>
        <Text style={styles.info}>Latitude: {this.state.latitude}</Text>
        <Text style={styles.info}>Longitude: {this.state.longitude}</Text>
        <Text style={styles.info}>Timestamp: {this.state.time}</Text>
        <Text style={styles.info}> {this.state.dump}</Text>
        <Text style={styles.info}> {this.state.dump_data}</Text>
        <Text style={styles.infoheader}>Notify</Text>
        <Text style={styles.infoheader}>MQTT and Save</Text>
        <Text style={styles.info}>The con_type is {this.state.con_type}</Text>
        <Text style={styles.info}>
          The MQTT Counter is {this.state.counter}
        </Text>
        <Text style={styles.info}>The Key is {this.state.key}</Text>
        <Text style={styles.info}>
          The MQTT Payload string is {this.state.payload}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  infoheader: {
    fontSize: 20,
    textAlign: "right",
    color: "#333333",
    marginBottom: 5,
    marginTop: 20,
  },
  info: {
    fontSize: 15,
    textAlign: "center",
    color: "#333333",
  },
});

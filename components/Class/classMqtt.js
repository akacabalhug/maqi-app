import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import init from 'react_native_mqtt';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {}
});

export default class ClassMqtt extends Component {
    constructor(props) {
        super(props)
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
            values: {}
        }
    }

    updateValues(key, value) {
        this.setState({
            values: {
                ...this.state.values,
                [key]: value
            }
        })
    }

    info(message) {
        this.setState({info: message})
    }

    error(message) {
        this.setState({
            info: "Error" + message
        })
    }

    counter(message) {
        this.setState({counter: message})
    }

    key(message) {
        this.setState({key: message})
    }

    payload(message) {
        this.setState({payload: message})
    }

    con_type(message) {
        this.setState({con_type: message})
    }

    dump(message) {
        this.setState({dump: message})
    }

    dump_data(message) {
        this.setState({dump_data: message})
    }

    componentDidMount() {
        this.interval
    }

    componentWillMount() {
        console.log("mounted")
        this.sendData({
            temperature: 25,
            latitude: 14.3108,
            longitude: 121.041,
            altitude: 33.1589241027832,
            humidity: 30,
            pm10: 10,
            pm25: 3
        })
    }

    sendData(item) {
        client = new Paho.MQTT.Client('3.0.58.83', 8083, '/mqtt', '')
        client.onConnectionLost = onConnectionLost
        client.onMessageArrived = onMessageArrived
        client.connect({onSuccess: onConnect})
        function onConnect() {
            const message = new Paho.MQTT.Message(item, "v1/devices/me/telemetry", 1, 0)
            message.destinationName = 'v1/devices/me/telemetry'
            client.publish(message)
        }
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }
        function onMessageArrived(message) {
            console.log("onMessageArrived:" + message.payloadString);
        }
    }

    render() {
        return (<View style={
            styles.container
        }>
            <Text style={
                styles.info
            }> {
                this.state
            } </Text>
        </View>)
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    infoheader: {
        fontSize: 20,
        textAlign: 'right',
        color: '#333333',
        marginBottom: 5,
        marginTop: 20
    },
    info: {
        fontSize: 15,
        textAlign: 'center',
        color: '#333333'
    }
});

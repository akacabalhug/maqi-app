import React, { createContext, useEffect, useState } from "react";
import Connection from "./Connection";
import Subscriber from "./Subscriber";
import Publisher from "./Publisher";
import Receiver from "./Receiver";
import mqtt from "mqtt/dist/mqtt";

export const QosOption = createContext([]);
const qosOption = [
  {
    label: "0",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
];

const HookMqtt = () => {
  const [client, setClient] = useState(null);
  const [isSubed, setIsSub] = useState(false);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };

  const mqttDisconnect = () => {
    console.log("here");
    if (client) {
      client.end(() => {
        setConnectStatus("Connect");
      });
    }
  };

  const mqttPublish = (context) => {
    console.log("publish context:", context);
    if (client) {
      const { topic, qos, payload } = context;

      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        setIsSub(true);
      });
    }
    console.log("Subscribed:", isSubed);
  };

  const mqttUnSub = (subscription) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
          return;
        }
        setIsSub(false);
      });
    }
  };

  useEffect(() => {
    console.log("client", client);
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        console.log("messages", message);
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  return (
    <>
      <Connection
        connect={mqttConnect}
        disconnect={mqttDisconnect}
        connectBtn={connectStatus}
      />
      <QosOption.Provider value={qosOption}>
        <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
        <Publisher publish={mqttPublish} />
      </QosOption.Provider>
    </>
  );
};

export default HookMqtt;

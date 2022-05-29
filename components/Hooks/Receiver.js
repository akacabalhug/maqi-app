import React, { useEffect, useState } from "react";
import { Card, List } from "antd";
import { View, Text } from "react-native";

const Receiver = ({ payload }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (payload.topic) {
      setMessages((messages) => [...messages, payload]);
    }
  }, [payload]);

  return (
    <>
      <View>
        <Text>"Receiver"</Text>
        {messages.map((message) => {
          <Text>{message}</Text>;
        })}
      </View>
    </>
  );
};

export default Receiver;

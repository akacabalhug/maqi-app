import React, { useContext } from "react";
import { Card, Form, Input, Row, Col, Select } from "antd";
import { View, Button } from "react-native";
import { QosOption } from "./index";

const Subscriber = ({ sub, unSub, showUnsub }) => {
  const [form] = Form.useForm();
  const qosOptions = useContext(QosOption);

  const record = {
    topic: "testtopic/react",
    qos: 0,
  };

  const onFinish = () => {
    sub(record);
  };

  const handleUnsub = () => {
    const values = form.getFieldsValue();
    unSub(values);
  };

  return (
    <>
      <View>
        <Button
          title="Subscribe"
          type="primary"
          onPress={() => {
            console.log("clicked subscribe");
            onFinish();
          }}
        />
      </View>
    </>
  );
};

export default Subscriber;

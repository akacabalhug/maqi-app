import React from "react";
import { Card, Form, Input, Row, Col } from "antd";
import { View, Button } from "react-native";

const Connection = ({ connect, disconnect, connectBtn }) => {
  const [form] = Form.useForm();
  const record = {
    host: "broker.emqx.io",
    // host: "broker.hivemq.com",
    clientId: `Device_1`,
    // port: 1883,
    port: 8083,
  };
  const onFinish = () => {
    console.log("here onFinish");
    const { host, clientId, port, username, password } = record;
    const url = `ws://${host}:${port}/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
      rejectUnauthorized: false,
    };
    options.clientId = clientId;
    options.username = username;
    options.password = password;
    connect(url, options);
  };

  const handleConnect = () => {
    // form.submit();
    onFinish();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const ConnectionForm = (
    <Form
      layout="vertical"
      name="basic"
      form={form}
      initialValues={record}
      onFinish={onFinish}
    >
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item label="Host" name="host">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Port" name="port">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Client ID" name="clientId">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Password" name="password">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      <View>
        <Button
          title={connectBtn}
          type="primary"
          onPress={() => {
            console.log("clicked");
            handleConnect();
          }}
        />
        <Button title="Disconnect" danger onClick={handleDisconnect} />
      </View>
    </>
  );
};

export default Connection;

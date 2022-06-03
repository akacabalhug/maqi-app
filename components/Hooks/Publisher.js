import React, { useContext } from "react";
import { Card, Form, Input, Row, Col, Select } from "antd";
import { View, Button } from "react-native";
import { QosOption } from ".";

const Publisher = ({ publish }) => {
  const [form] = Form.useForm();
  const qosOptions = useContext(QosOption);

  const record = {
    topic: "testtopic/maqi",
    qos: 0,
  };

  const onFinish = () => {
    publish({
      temperature: 25,
      latitude: 14.3108,
      longitude: 121.041,
      altitude: 33.1589241027832,
      humidity: 30,
      pm10: 10,
      pm25: 3,
      ...record,
    });
  };

  const PublishForm = (
    <Form
      layout="vertical"
      name="basic"
      form={form}
      initialValues={record}
      onFinish={onFinish}
    >
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item label="Topic" name="topic">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="QoS" name="qos">
            <Select options={qosOptions} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Payload" name="payload">
            <Input.TextArea />
          </Form.Item>
        </Col>
        <Col span={8} offset={16} style={{ textAlign: "right" }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Publish
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  //   return <Card title="Publisher">{PublishForm}</Card>;
  return (
    <>
      <View>
        <Button
          title="Publish"
          type="primary"
          onPress={() => {
            console.log("clicked publish");
            onFinish();
          }}
        />
      </View>
    </>
  );
};

export default Publisher;

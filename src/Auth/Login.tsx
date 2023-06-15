import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Input, Checkbox, Button } from "antd";

interface IProps {}

const Login: React.FC<IProps> = (props) => {

  const [userEmail, setUserEmail] = useState<string>();
  const [userPassword, setUserPassword] = useState<string>();

  let navigate = useNavigate();

  const onFinish = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleLogin", userEmail, userPassword);
    if (userEmail === 'mail@kyanon.digital' && userPassword === 'admin123') {
      console.log('Success');
      navigate('/profile');
    } else {
      alert('Wrong Email or Password')
    }
  };


  const handleChangeUserEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };
  const handleChangeUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
    },   
  };

  
  return (
    <>
      <div style={{ padding: 24 }}>
        <h1 style={{ display: 'flex', justifyContent: 'center' }}>Task Manager</h1>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          validateMessages={validateMessages}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Please input your email!' }]}
          >
            <Input
            placeholder='example@kyanon.digital'
            onChange={handleChangeUserEmail} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6, max: 12, message: 'Please input your password!' }]}
          >
            <Input.Password
            placeholder='*********' 
            onChange={handleChangeUserPassword} />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default Login
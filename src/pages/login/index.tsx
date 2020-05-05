import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from "antd";
import axios from "axios";
import qs from "qs";
import { Redirect } from "react-router-dom";
import { WrappedFormUtils } from "antd/lib/form/Form";
import "./style.css";

interface FormFields {
  password: string;
}
interface Props {
  form: WrappedFormUtils<FormFields>;
}

class LoginForm extends Component<Props> {
  state = {
    isLogin: false,
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values) => {
      if (!err) {
        axios
          .post(
            "/api/login",
            qs.stringify({
              password: values.password,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((res) => {
            if (res.data?.data) {
              this.setState({
                isLogin: true,
              });
            } else {
              message.error("登录失败!");
            }
          });
      }
    });
  };

  render() {
    const { isLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return isLogin ? (
      <Redirect to="/home" />
    ) : (
      <div className="login-page">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码!" }],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedLoginForm = Form.create({ name: "normal_login" })(LoginForm);

export default WrappedLoginForm;

import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon, Upload } from 'antd';
const FormItem = Form.Item;

export class SettingPassword extends React.Component {
  render(){
    return (
      <WrappedSettingPasswordForm />
    )
  }
}

class SettingPasswordForm extends React.Component {
  state={
    formData:{
      password: '',
      newPassword:'',
      newPasswordRepeat: '',
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formData = this.state.formData;

      return (
        <Form onSubmit={this.handleSubmit} style={{ paddingTop:20 }}>
          <FormItem {...formItemLayout} label="Old Password">
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                message: 'The old password cannot be empty！',
              }],
              initialValue: formData.password
            })(
              <Input placeholder="Please enter the old password" type="password" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="New Password">
            {getFieldDecorator('newPassword', {
              rules: [{
                  required: true,
                  message: 'New password cannot be empty！'
                }],
                initialValue: formData.newPassword
            })(
              <Input placeholder="Please enter the new password" type="password" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Repeat New Password">
            {getFieldDecorator('newPasswordRepeat', {
              rules: [{
                  required: true,
                  message: 'Duplicate new password cannot be empty！'
                }],
                initialValue: formData.newPasswordRepeat
            })(
              <Input placeholder="Please re enter your new password" type="password" />
            )}
          </FormItem>
          <FormItem {...formTailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      )
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        axios.post(window.apiURL + 'users/1/password', values)
        .then(function (response) {
          if (response.data.status == 0) {
            message.success(response.data.message);
            location.reload();
          }else {
            message.error(response.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
          message.error('error');
        });
      }
    });
  }
}

const WrappedSettingPasswordForm = Form.create()(SettingPasswordForm);

//Form layout
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon, Upload, Alert } from 'antd';
const FormItem = Form.Item;

export class SettingPersonal extends React.Component {
  render(){
    return (
      <WrappedSettingPersonalForm />
    )
  }
}

class SettingPersonalForm extends React.Component {
  state={
    formData:{
      name: '',
      email: ''
    }
  }
  componentWillMount() {
    if (master) {
        this.setState({
            formData: master,
        })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formData = this.state.formData;
    const props = {
      action: '',
      listType: "picture-card",
      className: "avatar-uploader",
      showUploadList: false,
      beforeUpload: this.beforeUpload,
      headers:{
        'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
      }
    };
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

      return (
        <Form onSubmit={this.handleSubmit} style={{ paddingTop:20 }}>
          <FormItem {...formItemLayout} label="name">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: 'username can not be empty！',
              }],
              initialValue: formData.name
            })(
              <Input placeholder="Please enter your name" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="email" extra={<Alert message="After changing the email, you need to use a new email to log in." type="warning" showIcon />}>
            {getFieldDecorator('email', {
              rules: [{
                  required: true,
                  message: 'E-mail can not be empty！'
                },{
                    type: 'email',
                    message: 'E-mail format is incorrect！'
                }],
                initialValue: formData.email
            })(
              <Input placeholder="please enter your email" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="avatar">
            {getFieldDecorator('avatar', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload {...props}>
                {this.state.imageUrl ? <img src={this.state.imageUrl} style={{width:'100%'}} alt="avatar" /> : uploadButton}
              </Upload>
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
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('Only upload images in JPG format!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image size can\'t be larger than 1MB');
    }
    if (isJPG && isLt1M) {
        this.getBase64(file, imageUrl => this.setState({
          imageUrl
        }));
    }
    return false;
  }
  //Get image base64 address
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  //Form submission
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (values[key]) {
                if (key == 'avatar') {
                    formData.append(key, values[key][0].originFileObj);
                }else {
                    formData.append(key, values[key]);
                }
            }
        })
        axios.post(window.apiURL + 'users/1', formData)
        .then(function (response) {
          message.success(response.data.message);
          location.reload();
        })
        .catch(function (error) {
          console.log(error);
          message.error('error');
        });
      }
    });
  }
}

const WrappedSettingPersonalForm = Form.create()(SettingPersonalForm);

//Form layout
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

import React, { Component } from 'react';
import { Form, Input, Button, message, Spin, Icon, Radio, Popover, Badge, Alert, Switch } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class SettingWeb extends React.Component {
  render(){
    return (
        <WrappedSettingWebForm />
    )
  }
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class SettingWebForm extends React.Component {
  state={
    loading: true,
    formData:{
      web_name:'',
      file_disk:'',
      comment_email:0,
      reply_email:0,
      web_icp:'',
    }
  }
  componentWillMount() {
    let that = this;
    let keys = [];
    for(let i in this.state.formData){
      keys.push(i);
    }
    axios.get(window.apiURL + 'settings?keys='+ keys.join(','))
    .then((response) => {
      console.log(response);
      this.setState({
        loading: false,
        formData: response.data.data
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formData = this.state.formData;

    if (this.state.loading) {
      return (
        <Spin
          style={{margin:'30px 50%'}}
          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}/>
      )
    }else {
      return (
        <Form onSubmit={this.handleSubmit} style={{ paddingTop:20 }}>
          <FormItem {...formItemLayout} label="Web Name" extra={<Alert message="Website name should not be easily changed, affecting SEO ranking" type="warning" showIcon />}>
            {getFieldDecorator('web_name', {
              rules: [{
                required: true,
                message: 'Site name cannot be empty！',
              }],
              initialValue: formData.web_name
            })(
              <Input placeholder="Enter your web site name" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Image storage location" extra={<Alert message="Unsynced images will not be displayed after switching image storage locations" type="warning" showIcon />}>
            {getFieldDecorator('file_disk', {
              rules: [{
                required: true,
                message: 'Please select a picture storage location！',
              }],
              initialValue: formData.file_disk
            })(
                <RadioGroup>
                    <Popover
                      content={(
                        <div>
                            <Badge status="default" text="No need to configure, use directly" /><br/>
                            <Badge status="warning" text="The local system disk space is small. It is not recommended to use the system disk to store pictures.！" />
                        </div>
                      )}>
                        <RadioButton value="local">Local system disk</RadioButton>
                    </Popover>
                    <Popover content={(
                        <div>
                            <Badge status="default" text="Need to manually complete the configuration to use, see readme" /><br/>
                            <Badge status="processing" text="Static storage access is fast and space is large. It is recommended to use this method！" />
                        </div>
                      )}>
                        <RadioButton value="google_drive">Google drive Storage</RadioButton>
                    </Popover>
                </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Article review email reminder" extra={<Alert message="After turning on, the blogger will receive an email after receiving a comment." type="info" showIcon />}>
            {getFieldDecorator('comment_email', {
              rules: [{
                required: true,
                message: 'Please choose whether to set the article comment email reminder'
              }],
              initialValue: Boolean(parseInt(formData.comment_email)),
              valuePropName: 'checked',
            })(
              <Switch checkedChildren="on" unCheckedChildren="off" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Comment reply email reminder" extra={<Alert message="After turning on, blogger will receive an email after receiving a reply." type="info" showIcon />}>
            {getFieldDecorator('reply_email', {
              rules: [{
                required: true,
                message: 'Please choose whether to enable comment reply email reminder'
              }],
              initialValue: Boolean(parseInt(formData.reply_email)),
              valuePropName: 'checked',
            })(
              <Switch checkedChildren="on" unCheckedChildren="off" />
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
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post(window.apiURL + 'settings', values)
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

const WrappedSettingWebForm = Form.create()(SettingWebForm);

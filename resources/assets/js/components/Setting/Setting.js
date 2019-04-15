import React, { Component } from 'react';
import { Layout, Menu, Form, Input, Button } from 'antd';
const { Sider, Content } = Layout;
const FormItem = Form.Item;
import { Route, Link } from 'react-router-dom'
import { SettingWeb } from './SettingWeb';
import { SettingPersonal } from './SettingPersonal';
import { SettingPassword } from './SettingPassword';

export class Setting extends React.Component {
  render(){
    return (
      <div>
        <Menu
          mode="horizontal"
          selectedKeys={[this.props.match.params.module]}>
          <Menu.Item key="web">
            <Link to="/settings/web">
              Blog settings
            </Link>
          </Menu.Item>
          <Menu.Item key="personal">
            <Link to="/settings/personal">
              Personal Settings
            </Link>
          </Menu.Item>
          <Menu.Item key="password">
            <Link to="/settings/password">
              Change Password
            </Link>
          </Menu.Item>
        </Menu>
        <Route path="/settings/web" exact component={SettingWeb}/>
        <Route path="/settings/personal" exact component={SettingPersonal}/>
        <Route path="/settings/password" exact component={SettingPassword}/>
      </div>
    )
  }
  //new function
}

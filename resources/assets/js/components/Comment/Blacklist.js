import React, { Component } from 'react';
import { Breadcrumb, Icon, Table, Button, Tooltip, Modal, message } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { Link } from 'react-router-dom';

export class Blacklist extends React.Component {
  constructor() {
    super();
    this.state = {
      blacks:[],
      loading:true,
    };
  }
  componentWillMount() {
    this.fetchData()
  }
  render (){
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },{
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },{
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
    },{
      title: 'Action',
      key: 'action',
      width: 150,
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Tooltip title="Delete">
              <Button icon="delete" onClick={this.handleDelete.bind(this, record.id)}/>
            </Tooltip>
          </ButtonGroup>
        </span>
      ),
    },];
    return (
      <div style={{padding:20}}>
        <Breadcrumb style={{ marginBottom:20 }}>
          <Breadcrumb.Item>
            <Link to="/comments">
            <Icon type="home" />
            <span> Article Management</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Black List
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table
          size="small"
          bordered
          dataSource={this.state.blacks}
          loading={this.state.loading}
          columns={columns}
          pagination={{
            showSizeChanger:true,
            showQuickJumper:true
          }}/>
      </div>
    )
  }
  fetchData(){
    this.setState({ loading:true });
    axios.get(window.apiURL + 'blacklist')
    .then((response) => {
      this.setState({
        blacks:response.data.blacks,
        loading:false,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  handleDelete = (id) =>{
    confirm({
      title: 'Confirm Deletion',
      content: 'This will remove this IP address from the blacklist, continue？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:() => {
        axios.get(window.apiURL + 'blacklist/delete/' + id)
        .then((response) => {
          if (response.status == 200) {
            this.fetchData()
            message.success(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
        });
      },
      onCancel:() => {
        console.log('Not delete');
      },
    });
  }
  //new function
}

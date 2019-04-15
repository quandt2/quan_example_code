import React, { Component } from 'react';
import { Breadcrumb, Icon, Table, Button, Tooltip, Modal, message } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { Link } from 'react-router-dom';

export class Tag extends React.Component {
  constructor() {
    super();
    this.state = {
      tags:[],
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },{
      title: 'Article number',
      dataIndex: 'article_num',
      key: 'article_num',
    },{
      title: 'Search number',
      dataIndex: 'search_num',
      key: 'search_num',
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
            <Link to="/articles">
            <Icon type="home" />
            <span> Article management</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
              Label management
          </Breadcrumb.Item>
        </Breadcrumb>
        <Table
          size="small"
          bordered
          dataSource={this.state.tags}
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
    axios.get(window.apiURL + 'tags')
    .then((response) => {
      this.setState({
        tags:response.data.tags,
        loading:false,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleDelete = (id) =>{
    confirm({
      title: 'Confirm delete',
      content: 'This action will permanently delete this tag, confirm to continue？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:() => {
        axios.get(window.apiURL + 'tags/delete/' + id)
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

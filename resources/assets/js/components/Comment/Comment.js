import React, { Component } from 'react';
import { Table, Tooltip, Button, Modal, message, Badge, Dropdown, Menu, Icon } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import { Link } from 'react-router-dom';

export class Comment extends React.Component {
  constructor() {
    super();
    this.state = {
      //评论数据
      comments:[],
      pagination: {
        showSizeChanger:true,
        showQuickJumper:true,
        defaultCurrent:1,
        defaultPageSize:10
      },
      loading:true,
    };
  }
  componentWillMount() {
    this.fetchData()
  }
  render(){
    const columns = [{
      title: 'Article Name',
      dataIndex: 'article_name',
      key: 'article_name',
    },{
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },{
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },{
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },{
      title: 'City',
      dataIndex: 'city',
      key: 'city',
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
            <Tooltip title="Link">
              <Button icon="link" onClick={this.handleView.bind(this, record.location)}/>
            </Tooltip>
            <Tooltip title="Delete">
              <Button icon="delete" onClick={this.handleDelete.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="Black List">
              <Button icon="frown" onClick={this.handleBlack.bind(this, record.ip)}/>
            </Tooltip>
          </ButtonGroup>
        </span>
      ),
    },];
    return (
      <div style={{padding:20}}>
        <Link to={'/blacklist'}>
          <Button icon="bars">Blacklist management</Button>
        </Link>
        <Table
          size="small"
          bordered
          dataSource={this.state.comments}
          loading={this.state.loading}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          style={{marginTop:10}}/>
      </div>
    )
  }
  //Retrieve data
  fetchData = (currentPage=null, pageSize=null) => {
    const pager = { ...this.state.pagination };
    if (!currentPage) {
      currentPage = pager.current ? pager.current : pager.defaultCurrent;
    }
    if (!pageSize) {
      pageSize = pager.pageSize ? pager.pageSize : pager.defaultPageSize;
    }
    this.setState({ loading:true });
    let url = window.apiURL + 'comments?pagesize=' + pageSize + '&page=' + currentPage;
    axios.get(url)
    .then((response) => {
      const pager = { ...this.state.pagination };
      pager.total = response.data.total;
      pager.current = response.data.current_page;
      pager.pageSize = Number(response.data.per_page);
      this.setState({
        comments:response.data.data,
        pagination: pager,
        loading:false,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  //Delete form
  handleDelete = (id) =>{
    confirm({
      title: 'Confirm Delele',
      content: 'This action will permanently delete this comment, continue？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:() => {
        axios.get(window.apiURL + 'comments/delete/' + id)
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
  //Blacklist IP
  handleBlack = (ip) =>{
    axios.post(window.apiURL + 'blacklist/',{
      ip:ip
    })
    .then((response) => {
      if (response.status == 200) {
        message.success(response.data.message)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchData(pagination.current, pagination.pageSize);
  }

  handleView = (location) =>{
    window.open(location)
  }
}

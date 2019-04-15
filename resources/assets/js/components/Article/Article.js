import React, { Component } from 'react';
import { Table, Input, Button, Icon, message, Modal, Tooltip, Badge, Avatar, Select, Popover, Dropdown, Menu, Drawer, Form, Row, Col, DatePicker, Alert } from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;
import { Link } from 'react-router-dom';

export class Article extends React.Component {
  constructor() {
    super();
    this.state = {
      //dataTable
      articles:[],
      pagination: {
        showSizeChanger:true,
        showQuickJumper:true,
        defaultCurrent:1,
        defaultPageSize:10
      },
      order:'created_at',
      status:null,
      top:null,
      key:null,
      loading:true,
    };
  }
  componentWillMount() {
    this.fetchData();
  }
  render(){
    //render colums
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },{
      title: 'Cover',
      key: 'cover',
      render: (text, record) => (
        <Popover content={<img src={record.cover? imageURL(record.cover) : 'default.jpg'} style={{maxWidth:500}}/>} placement="right">
          <Avatar shape="square" src={record.cover? imageURL(record.cover) : 'default.jpg'} style={{ cursor:'pointer' }}/>
        </Popover>
      )
    },{
      title: 'Tittle',
      key: 'title',
      render: (text, record) => (
        <span>
            <Link to={'/articles/update/' + record.id}>
              {record.title}
            </Link>
        </span>
      )
    },{
      title: 'Content',
      dataIndex: 'content_html',
      key: 'content_html',
    },{
      title: 'Status',
      key: 'is_hidden',
      width: 80,
      render: (text, record) => {
        if (record.is_hidden)
          return <Badge status="warning" text="Hidden" />
        else
          return <Badge status="processing" text="Published" />
      }
    },{
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      width:60
    },{
      title: 'Updated at',
      dataIndex: 'updated_at_diff',
      key: 'updated_at',
      width:80
    },{
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      width:90
    },{
      title: 'Action',
      key: 'action',
      width: 150,
      render: (text, record) => (
        <span>
          <ButtonGroup>
            <Tooltip title="Preview">
              <Button icon="link" onClick={this.handleView.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="Published">
              <Button icon="book" onClick={this.handlePublish.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="Top">
              <Button style={{ backgroundColor: record.is_top?'gray':'white'}} icon="up-square" onClick={this.handleTop.bind(this, record.id)}/>
            </Tooltip>
            <Tooltip title="Delete">
              <Button icon="delete" onClick={this.handleDelete.bind(this, record.id)}/>
            </Tooltip>
          </ButtonGroup>
        </span>
      ),
    },];
    return (
      <div style={{padding:20}}>
        <div style={{overflow:'hidden'}}>
          <Select defaultValue="created_at" style={{ width: 120, marginRight: 10 }} onChange={this.handleChangeOrder}>
            <Option value="created_at">Newest</Option>
            <Option value="view">Most Viewed</Option>
            <Option value="comment">Most comments</Option>
          </Select>
          <Select placeholder="Filter by status" style={{ width: 140, marginRight: 10 }} onChange={this.handleChangeStatus} allowClear>
            <Option value={0}>Published</Option>
            <Option value={1}>Hidden</Option>
          </Select>
          <Select placeholder="Filter by top status" style={{ width: 140, marginRight: 10 }} onChange={this.handleChangeTop} allowClear>
            <Option value={0}>Unrated</Option>
            <Option value={1}>Top</Option>
          </Select>
          <Search
            placeholder="Search title"
            onSearch={this.handleSearch}
            style={{ width: 200, marginRight: 10 }}
          />

          <Dropdown
            placement="bottomRight"
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  <Link to="/articles/create/richtext">
                    <Icon type="file-word" /> Rich text editor
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/articles/create/markdown">
                    <Icon type="file-markdown" /> Markdown editor
                  </Link>
                </Menu.Item>
              </Menu>
            }>
            <Button type="primary" icon="edit" style={{float: 'right'}}>Edit</Button>
          </Dropdown>
          <Link to={'/tags'}>
            <Button icon="tag" style={{float: 'right', marginRight: 10}}>Tag Manage</Button>
          </Link>
          {/*<Dropdown
            placement="bottomCenter"
            trigger={['click']}
            overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="import"><Icon type="select" />Import article from DB</Menu.Item>
              </Menu>
            }>
            <Button style={{float: 'right', marginRight: 10}}>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>*/}
        </div>
        <Table
          size="small"
          bordered
          dataSource={this.state.articles}
          loading={this.state.loading}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          style={{marginTop:10}}/>

        <DrawerImportForm wrappedComponentRef={ref => this.refDrawerImportForm = ref} />
      </div>
    )
  }

  fetchData = (currentPage=null, pageSize=null) =>{
    const pager = { ...this.state.pagination };
    if (!currentPage) {
      currentPage = pager.current ? pager.current : pager.defaultCurrent;
    }
    if (!pageSize) {
      pageSize = pager.pageSize ? pager.pageSize : pager.defaultPageSize;
    }
    this.setState({ loading:true });
    let url = window.apiURL + 'articles?order=' + this.state.order + '&pagesize=' + pageSize + '&page=' + currentPage;
    if (this.state.status != null) {
      url = url + '&status=' + this.state.status;
    }
    if (this.state.top != null) {
      url = url + '&top=' + this.state.top;
    }
    if (this.state.search != null) {
      url = url + '&search=' + this.state.search;
    }
    axios.get(url)
    .then((response) => {
      const pager = { ...this.state.pagination };
      pager.total = response.data.total;
      pager.current = response.data.current_page;
      pager.pageSize = Number(response.data.per_page);
      this.setState({
        articles:response.data.data,
        pagination: pager,
        loading:false,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleView = (id) =>{
    window.open('/articles/' + id)
  }
  handlePublish = (id) =>{
    var that = this
    axios.get(window.apiURL + 'articles/publish/' + id)
    .then(function (response) {
      if (response.status == 200) {
        that.fetchData()
        message.success(response.data.message)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleTop = (id) =>{
    var that = this
    axios.get(window.apiURL + 'articles/top/' + id)
    .then(function (response) {
      if (response.status == 200) {
        that.fetchData()
        message.success(response.data.message)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  //Delete Article
  handleDelete = (id) =>{
    var that = this
    confirm({
      title: 'Delete Confirm',
      content: 'This will permanently delete this article, are you sure to continue？',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        //Get article data
        axios.get(window.apiURL + 'articles/delete/' + id)
        .then(function (response) {
          if (response.status == 200) {
            that.fetchData()
            message.success(response.data.message)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      onCancel() {
        console.log('Not delete');
      },
    });
  }
  handleChangeOrder = (value) =>{
    this.setState({ order:value }, () => this.fetchData());
  }
  handleChangeStatus = (value) =>{
    this.setState({ status:value }, () => this.fetchData());
  }
  handleChangeTop = (value) =>{
    this.setState({ top:value }, () => this.fetchData());
  }
  handleSearch = (value) => {
    this.setState({ search:value }, () => this.fetchData());
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchData(pagination.current, pagination.pageSize);
  }
  handleMenuClick = (e) => {
    if (e.key == 'import') {
      this.refDrawerImportForm.showDrawer();
    }
  }
  // new function
}

const DrawerImportForm  = Form.create()(
  class extends React.Component {
    state = { visible: false };

    componentWillReceiveProps(nextProps) {
      this.setState({visible:nextProps.visible});
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          <Drawer
            title="Import articles from the database"
            width={720}
            placement="right"
            onClose={this.closeDrawer}
            maskClosable={false}
            visible={this.state.visible}
            style={{
              height: 'calc(100% - 55px)',
              overflow: 'auto',
              paddingBottom: 53,
            }}
          >
            <Form layout="vertical" >
              <Row gutter={16}>
                <Col span={24}>
                  <Alert message="Only importing data from other data tables in the current database is supported. The import process is irreversible. Please backup the current article data first.！" type="warning" showIcon style={{marginBottom:20}} />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Data table name">
                    {getFieldDecorator('table', {
                      rules: [{ required: true, message: 'Data table name cannot be empty' }],
                    })(<Input placeholder="The name of the data table to import" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Title field">
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: 'Title field cannot be empty' }],
                    })(<Input placeholder="Store the field name of the title" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Image field" extra={<Badge status="processing" text="Save as default image without filling" />}>
                    {getFieldDecorator('cover', {
                    })(<Input placeholder="Save the image page" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="content" extra={<Badge status="processing" text="Non-plain text content may break the format" />}>
                    {getFieldDecorator('content', {
                    })(<Input placeholder="Content of article" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="IsTop" extra={<Badge status="processing" text="column name|value, for example:：is_top|1" />}>
                    {getFieldDecorator('is_top', {
                    })(<Input placeholder="Article top or not" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Hidden" extra={<Badge status="processing" text="Rule: column name|hidden value, for example: is_hidden|1" />}>
                    {getFieldDecorator('is_hidden', {
                    })(<Input placeholder="Is hidden " />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Pageview" extra={<Badge status="processing" text="0 if not enter" />}>
                    {getFieldDecorator('view', {
                    })(<Input placeholder="View of Article" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Comment" extra={<Badge status="processing" text="0" />}>
                    {getFieldDecorator('comment', {
                    })(<Input placeholder="Comment of article" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Created At" extra={<Badge status="processing" text="now" />}>
                    {getFieldDecorator('created_at', {
                    })(<Input placeholder="Created time" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button
                style={{
                  marginRight: 8,
                }}
                onClick={this.closeDrawer}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>Submit</Button>
            </div>
          </Drawer>
        </div>
      );
    }
    showDrawer = () => {
      this.setState({visible: true});
    }
    closeDrawer = () => {
      this.setState({visible: false});
    }
    handleSubmit = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          axios.post(window.apiURL + 'import', values)
          .then((response) => {
            message.success(response.data.message);
            this.closeDrawer();
            location.reload();
          })
          .catch((error) => {
            console.log(error);
            message.error('error');
          });
        }
      });
    }
  }
)

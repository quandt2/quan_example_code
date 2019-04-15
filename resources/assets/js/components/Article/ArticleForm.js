import React, { Component } from 'react';
import { Icon, Form, Input, Button, Upload, message, Modal, Badge, Select, Switch, Popover } from 'antd';
import BraftEditor from 'braft-editor';
import ReactMarkdown from 'react-markdown';
import {markdown} from 'markdown';
import 'braft-editor/dist/index.css'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const ButtonGroup = Button.Group;

export class ArticleForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id: 0,
      title: '',
      tags: [],
      cover: '',
      editorState: BraftEditor.createEditorState(null),
      editorMarkdown: '',

      tagsArr: [],

      loading: false,

      visibleCoverUploadModal: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.article) {
      this.setState({
        id: nextProps.article.id,
        title: nextProps.article.title,
        tags: nextProps.article.tags,
        cover: nextProps.article.cover,
        editorState: BraftEditor.createEditorState(nextProps.article.content_raw),
        editorMarkdown: nextProps.article.content_markdown,
      });
    }
    if (nextProps.tagsArr) {
      this.setState({tagsArr: nextProps.tagsArr});
    }
    this.setState({isMarkdown:nextProps.isMarkdown});
  }
  render() {
    const formItemLayout = {
      wrapperCol: {
        sm:{ span:24 },
        md:{ span:24 },
        lg:{ span: 20, offset: 2 }
      },
    };
    const children = [];
    this.state.tagsArr.map((tag) => {
      children.push(<Option key={tag}>{tag}</Option>)
    })
    const CoverUploader = (
      <div style={{width: 400, padding: '0 10px'}}>
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          className="article__cover-uploader"
          action={window.apiURL+'upload'}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          headers={{
            'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
          }}
        >
          {this.state.cover&&!this.state.loading ?
            <img src={imageURL(this.state.cover)} alt="avatar" style={{width:'100%'}} /> :
            (<div style={{width:'100%'}}>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
              </div>)
          }
        </Upload>
      </div>
    )
    // editor
    const extendControls = [
      {
        key: 'custom-modal',
        type: 'modal',
        text: 'Article image upload',
        modal: {
          id: 'my-moda-1',
          title: 'Article image settings',
          showFooter: false,
          children: CoverUploader,
        }
      }
    ]

    return (
      <Form>
        <FormItem
          {...formItemLayout}>
          <Input
            prefix={<Icon type="info-circle-o" />}
            placeholder="Enter article title"
            ref="title"
            value={this.state.title}
            onChange={this.handelTitleChange} />
        </FormItem>
        <FormItem
          {...formItemLayout}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add Tag"
            value={this.state.tags}
            onChange={this.handleTagsChange}
          >
            {children}
          </Select>
        </FormItem>
        {
          this.state.isMarkdown?
          (
            <FormItem
              {...formItemLayout}>
              <Switch checkedChildren="Preview" unCheckedChildren="Edit" onChange={v => this.setState({preview:v})} />
              <ButtonGroup style={{marginLeft:20}}>
                <Button size="small" onClick={() => document.getElementById('imageUploader').click()}>
                  <Icon type="picture" />Insert picture
                </Button>
                <input type="file" id="imageUploader" name="file" onChange={this.uploadImage} style={{display:'none'}}/>
                <Button size="small" onClick={() => this.setState({visibleCoverUploadModal:true})}>
                  <Icon type="pushpin" />Article cover upload
                </Button>
                <Modal
                  title="Article image upload"
                  visible={this.state.visibleCoverUploadModal}
                  onCancel={() => this.setState({visibleCoverUploadModal:false})}
                  footer={null}
                >
                  {CoverUploader}
                </Modal>
              </ButtonGroup>
              <a href="http://rexxars.github.io/react-markdown/" target="_blank">
                <Button icon="question" size="small" style={{marginLeft:20}}>Markdown Syntax example</Button>
              </a>
              {
                this.state.preview?
                (
                  <ReactMarkdown
                    className="article__markdown-preview"
                    source={this.state.editorMarkdown}/>
                ):
                (
                  <TextArea
                    id="textarea"
                    autosize={{ minRows: 20, maxRows: 25 }}
                    value={this.state.editorMarkdown}
                    onChange={this.handleTextAreaChange}
                    />
                )
              }
            </FormItem>
          ):
          (
            <FormItem {...formItemLayout}>
              <div  style={{ borderRadius: 5, boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)'}}>
                <BraftEditor
                  value={this.state.editorState}
                  onChange={this.handleEditorChange}
                  extendControls={extendControls}
                  media={{
                    uploadFn:this.uploadFn,
                    accepts:{
                      image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                      video: false,
                      audio: false
                    }
                  }}
                  onSave={this.handleSubmit}
                />
              </div>
            </FormItem>
          )
        }
        <FormItem {...formItemLayout} style={{textAlign:'right'}}>
          <Button
            onClick={this.handleSubmit}
            type="primary"
            htmlType="submit"
            icon="form"> 保存
          </Button>
        </FormItem>
      </Form>
    )
  }

  handleSubmit = () => {
    this.props.handleSubmit({
      id:this.state.id,
      title:this.state.title,
      tags:this.state.tags,
      cover:this.state.cover,
      content_raw:this.state.editorState.toRAW(),
      content_html:this.state.isMarkdown?markdown.toHTML(this.state.editorMarkdown):this.state.editorState.toHTML(),
      content_markdown:this.state.editorMarkdown,
      is_markdown:this.state.isMarkdown,
    })
  }
  handelTitleChange = (e) => {
    let title = this.refs.title.input.value
    this.setState({title: title})
  }
  handleTagsChange = (value) => {
    this.setState({tags: value})
  }
  handleEditorChange = (editorState) => {
      this.setState({ editorState })
  }

  uploadFn = (param) => {
    const serverURL = window.apiURL + 'upload'
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    const successFn = (response) => {
      // Suppose the server directly returns the address after the file is uploaded.
      // After the upload is successful, call param.success and pass in the uploaded file address.
      param.success({
        url: imageURL(xhr.responseText)
      })
    }
    const progressFn = (event) => {
      // Call param.progress when the upload progress changes
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (response) => {
      // Call param.progress when the upload progress changes
      param.error({
        msg:  'upload failed！'
      })
    }
    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('X-CSRF-TOKEN', document.head.querySelector('meta[name="csrf-token"]').content);
    xhr.send(fd)
  }
  //Check before uploading the file
  beforeUpload = (file) => {
    const allowType = ["image/png", "image/jpeg"];
    const isJPGPNG = ~allowType.indexOf(file.type);
    if (!isJPGPNG) {
      message.error('Only upload images in JPG, PNG format！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Only upload images smaller than 2MB！');
    }
    return isJPGPNG && isLt2M;
  }
  //Upload handler
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        cover: info.file.response,
        loading: false,
      });
      message.success('Uploaded successfully, it will take effect after saving.！')
    }
  }
  handleTextAreaChange = (e) => {
    this.setState({editorMarkdown: e.target.value});
  }

  uploadImage = (e) => {
    let textarea = document.getElementById('textarea');
    let data = new FormData();
    data.append('file', e.target.files[0]);
    axios.post(window.apiURL+'upload', data)
    .then((response) => {
      let url = `![](${imageURL(response.data)})`;
      this.insertText(textarea, url);
      this.setState({editorMarkdown: textarea.value});
    })
    .catch((error) => {
      console.log(error);
    });
  }
  //在 textarea 光标位置处插入文字
  insertText = (obj,str) => {
      if (document.selection) {
          var sel = document.selection.createRange();
          sel.text = str;
      } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          var startPos = obj.selectionStart,
              endPos = obj.selectionEnd,
              cursorPos = startPos,
              tmpStr = obj.value;
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
          cursorPos += str.length;
          obj.selectionStart = obj.selectionEnd = cursorPos;
      } else {
          obj.value += str;
      }
  }
  //new function
}

import React, { Component } from 'react';
import { Breadcrumb, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import { ArticleForm } from './ArticleForm';

export class ArticleCreate extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tagsArr:[],
      isMarkdown:false,
    };
  }
  componentDidMount(props) {
    //Editor type
    if (this.props.match.params.type == 'markdown') {
      this.setState({isMarkdown:true});
    }
    //Get label
    axios.get(window.apiURL + 'tags')
    .then((response) => {
      this.setState({
        tagsArr:response.data.tagsArr,
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleSubmit(article) {
    if (article.title == '') {
      message.error('The title can not be blank');
    }else {
      //Create article
      axios.post(window.apiURL + 'articles', article)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          message.success(response.data.message)
          location.replace('#/articles')
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
  render(){
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
              Article creation
          </Breadcrumb.Item>
        </Breadcrumb>
        <ArticleForm tagsArr={this.state.tagsArr} handleSubmit={this.handleSubmit} isMarkdown={this.state.isMarkdown} />
      </div>
    )
  }
}

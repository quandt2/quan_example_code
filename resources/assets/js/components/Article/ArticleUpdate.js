import React, { Component } from 'react';
import { Breadcrumb, Icon, Spin, message} from 'antd';
import { Link } from 'react-router-dom';
import { ArticleForm } from './ArticleForm';

export class ArticleUpdate extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id:props.match.params.id,
      article:{},
      loading:true,
      tagsArr:[],
    };
  }
  componentDidMount(props) {
    axios.get(window.apiURL + 'articles/' + this.state.id)
    .then((response) => {
      this.setState({
        article:response.data.article,
        loading:false,
        tagsArr:response.data.tagsArr,
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  handleSubmit(article) {
    if (article.title == '') {
      message.error('The title can not be blank');
    }else {
      //Update article
      axios.post(window.apiURL + 'articles', article)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          message.success(response.data.message)
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
              Article editor
          </Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <ArticleForm article={this.state.article} tagsArr={this.state.tagsArr} isMarkdown={this.state.article.is_markdown} handleSubmit={this.handleSubmit.bind(this)}/>
        </Spin>
      </div>
    )
  }
}

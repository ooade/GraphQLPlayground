import React from 'react';
import withMutation from './WithMutation';

import { commentListQuery } from './CommentsList';

class SubmitComment extends React.Component {
  state = {
    name: '',
    comment: ''
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.comments({
      name: this.state.name,
      comment: this.state.comment
    }, commentListQuery).then(() => {
      this.setState({ name: '', comment: '' });
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input
          placeholder='name'
          value={this.state.name}
          onChange={ e => this.setState({ name: e.target.value }) }
        />
        <input
          placeholder='comment'
          value={this.state.comment}
          onChange={ e => {
            this.setState({ comment: e.target.value });
            this.props.socket.emit('typing', this.state.name, this.props.query.key);
          } }
        />
        <button>Submit</button>
      </form>
    )
  }
}

const options = {
  name: 'comments',
  args: { name: 'String', comment: 'String' }
}

export default withMutation(options)(SubmitComment);

import mongoose, { Schema } from 'mongoose';
import casual from 'casual';
import axios from 'axios';
import _ from 'lodash';

const authorSchema = new Schema({
  firstName: String,
  lastName: String,
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'post',
  }],
});

const postSchema = new Schema({
  title: String,
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'author',
  },
});

const viewSchema = new Schema({
  postId: Schema.Types.ObjectId,
  views: Number,
});

const commentSchema = new Schema({
  name: String,
  comment: String
})

casual.seed(123);
const View = mongoose.model('view', viewSchema);
const Author = mongoose.model('author', authorSchema);
const Post = mongoose.model('post', postSchema);
const Comment = mongoose.model('comment', commentSchema);

// Seed data
_.times(10, () => {
  const author = new Author();
  author.firstName = casual.first_name;
  author.lastName = casual.last_name;

  author.save()
    .then($author => {
      const post = new Post();
      post.title = `A post by ${$author.firstName}`;
      post.text = casual.sentences(3);
      post.author = $author._id;

      author.posts.push(post);
      author.save();
      post.save()
        .then($post => {
          const view = new View();
          view.postId = $post._id;
          view.views = casual.integer(0, 100);

          view.save();
          post.save();
        });
    });
});

const FortuneCookie = {
  getOne() {
    return axios('http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1')
      .then(res => res.data[0].content);
  },
};

export { Author, Post, View, Comment, FortuneCookie };

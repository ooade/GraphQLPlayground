import Mongoose, { Schema } from 'mongoose';
import casual from 'casual';
import axios from 'axios';
import _ from 'lodash';

Mongoose.connect('mongodb://localhost:27017/graphql');

// Assign ES6 Promise to mongoose
Mongoose.Promise = global.Promise;

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

const viewSchema = new Mongoose.Schema({
  postId: Schema.Types.ObjectId,
  views: Number,
});

casual.seed(123);
const View = Mongoose.model('view', viewSchema);
const Author = Mongoose.model('author', authorSchema);
const Post = Mongoose.model('post', postSchema);
// const View = mongoose.model('view', ViewSchema);

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

export { Author, Post, View, FortuneCookie };

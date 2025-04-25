const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

blogSchema.set('toJSON', {
    transform: (document, blogObject) => {
      blogObject.id = blogObject._id.toString()
      delete blogObject._id
      delete blogObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
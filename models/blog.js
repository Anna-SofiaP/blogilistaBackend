const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGODB_URI

console.log('connecting to', mongoUrl)
mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, blogObject) => {
      blogObject.id = blogObject._id.toString()
      delete blogObject._id
      delete blogObject.__v
    }
  })

//const Blog = mongoose.model('Blog', blogSchema)

module.exports = mongoose.model('Note', noteSchema)
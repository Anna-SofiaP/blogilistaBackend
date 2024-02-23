require('dotenv').config()
const express = require('express')
const app = express()
//const cors = require('cors')
//app.use(cors())
app.use(express.json())
const Blog = require('./models/blog')


/*app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})*/

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogposts => {
      console.log('All blog posts: ', blogposts)
      response.json(blogposts)
  })
})


app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  console.log('Adding new post... ', blog)

  blog
    .save()
    .then(result => {
      console.log('New post added! ', result)
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

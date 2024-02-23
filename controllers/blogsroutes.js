const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogposts => {
        console.log('All blog posts: ', blogposts)
        response.json(blogposts)
    })
  })
  
  
  blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    console.log('Adding new post... ', blog)
  
    blog
      .save()
      .then(result => {
        console.log('New post added! ', result)
        response.status(201).json(result)
      })
  })

  module.exports = blogsRouter
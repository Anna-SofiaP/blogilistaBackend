const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    logger.info('All blogs: ', blogs)
    response.json(blogs)
})
  

//TODO: Muuta tämäkin async awaitiksi!
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  logger.info('Adding new post... ', blog)

  blog
    .save()
    .then(result => {
      logger.info('New post added! ', result)
      response.status(201).json(result)
    })
})

module.exports = blogsRouter
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    logger.info('All blogs: ', blogs)
    response.json(blogs)
})
  

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
    logger.info('Adding new post... ', blog)

    const result = await blog.save()
    logger.info('New post added! ', result)
    response.status(201).json(result)
})

module.exports = blogsRouter
const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, id: 1 })
    logger.info('All blogs: ', blogs)
    response.json(blogs)
})
  

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userID)
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    logger.info('Adding new post... ', blog)

    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    logger.info('New post added! ', result)
    response.status(201).json(result)
})


blogsRouter.delete('/:id', async (request, response, next) => {
    const noteToDelete = request.params.id
    logger.info('Deleting a post with id: ', noteToDelete)

    try {
        const result = await Blog.findByIdAndDelete(noteToDelete)
        logger.info('Post deleted! ', result)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter
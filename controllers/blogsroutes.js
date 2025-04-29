const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, id: 1 })
    logger.info('All blogs: ', blogs)
    response.json(blogs)
})
  

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {
        // Decode the token that was sent with the request
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'invalid token' })
        }

        const user = await User.findById(decodedToken.id)
    
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

    }
    catch(error) {
        next(error)
    }
})


blogsRouter.delete('/:id', async (request, response, next) => {
    const blogToDelete = request.params.id
    logger.info('Deleting a post with id: ', blogToDelete)

    try {
        // Decode the token that was sent with the request
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        // Find the blog to be deleted
        const blog = await Blog.findById(blogToDelete)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'invalid token' })
        }

        if (blog.user.toString() === decodedToken.id.toString()) {
            const result = await Blog.findByIdAndDelete(blogToDelete)
            logger.info('Post deleted! ', result)
            response.status(204).end()
        }

    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter
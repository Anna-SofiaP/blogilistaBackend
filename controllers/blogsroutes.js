const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, id: 1, name: 1 })
    logger.info('All blogs: ' + blogs)
    const users = blogs.map(blog => blog.user)
    logger.info('All users: ' + users)
    response.json(blogs)
})
  

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
    const body = request.body
    logger.info("Request body: ", body)
    const user = request.user
    logger.info("User is: ", user)

    try {
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


blogsRouter.put('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
    const blogToUpdateID = request.params.id
    logger.info('Updating a post with id: ' + blogToUpdateID)
    const blogToUpdate = request.body
    logger.info('Blog to update: ' + blogToUpdate)

    try {
        const user = request.user
        logger.info('User whose blog is being updated: ' + user)

        const blog = await Blog.findById(blogToUpdateID)
        logger.info('Blog that we want to update: ' + blog)

        if (blog.user.toString() === user._id.toString()) {
            const result = await Blog.findByIdAndUpdate(blog._id, blogToUpdate)
            logger.info('Post updated! ' + result)
            response.status(204).end()
        }

    } catch (exception) {
        next(exception)
    }
})


blogsRouter.delete('/:id', async (request, response, next) => {
    const blogToDelete = request.params.id
    logger.info('Deleting a post with id: ' + blogToDelete)

    try {
        // Decode the token that was sent with the request
        const user = request.user
        // Find the blog to be deleted
        const blog = await Blog.findById(blogToDelete)

        if (blog.user.toString() === user._id.toString()) {
            const result = await Blog.findByIdAndDelete(blogToDelete)
            logger.info('Post deleted! ', result)
            response.status(204).end()
        }

    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter